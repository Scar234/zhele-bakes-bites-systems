import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  ClipboardList, Cake, LogOut, RefreshCw, Lock, Package,
  Sparkles, Plus, Pencil, Trash2, Check, X,
  TrendingUp, ShoppingBag, AlertCircle, Filter,
} from 'lucide-react';
import { ordersApi, catalogApi, adminApi } from '../services/api';

const STATUS_STYLES = {
  pending:   'bg-amber-100 text-amber-900 border-amber-300',
  confirmed: 'bg-purple-100 text-purple-900 border-purple-300',
  preparing: 'bg-blue-100 text-blue-900 border-blue-300',
  ready:     'bg-teal-100 text-teal-900 border-teal-300',
  completed: 'bg-green-100 text-green-900 border-green-300',
  cancelled: 'bg-red-100 text-red-900 border-red-300',
};

const STATUS_LABELS = {
  pending:   '🟡 Pending',
  confirmed: '🟣 Confirmed',
  preparing: '🔵 Baking',
  ready:     '🟢 Ready',
  completed: '⚪ Completed',
  cancelled: '🔴 Cancelled',
};

const EMPTY_PRODUCT = {
  name: '', description: '', basePrice: '', imageUrl: '',
  category: '', hasVariants: false, isAvailable: true,
  variants: [{ name: '', price: '' }],
};

export default function AdminPage() {
  // ── Auth ─────────────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Core data ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  // ── Product form ──────────────────────────────────────────────────────────
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [productFormLoading, setProductFormLoading] = useState(false);
  const [productFormError, setProductFormError] = useState('');
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── Toast notification ────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  // ── Check for saved session on mount ────────────────────────────────────
  useEffect(() => {
    const token = sessionStorage.getItem('zhele_admin_token');
    if (token) {
      adminApi.verify()
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          sessionStorage.removeItem('zhele_admin_token');
          setIsAuthenticated(false);
        });
    }
  }, []);

  // ── Fetch admin data ─────────────────────────────────────────────────────
  const fetchAdminData = (showLoadingSpinner = false) => {
    if (showLoadingSpinner) setLoading(true);
    const params = statusFilter ? { status: statusFilter } : {};
    Promise.all([
      ordersApi.getOrders(params),
      catalogApi.getProducts(),
      catalogApi.getCategories(),
    ])
      .then(([orderRes, prodRes, catRes]) => {
        setOrders(orderRes.data || []);
        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      })
      .catch((err) => showToast(`Failed to load data: ${err.message}`, 'error'))
      .finally(() => setLoading(false));
  };

  // ── Socket.io ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAdminData(true);

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token: sessionStorage.getItem('zhele_admin_token') },
    });
    socket.on('order:created', (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      showToast(`🔔 New order: ${newOrder.orderNumber} from ${newOrder.customerName}`);
    });
    socket.on('order:updated', (updated) => {
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    });
    return () => socket.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, statusFilter]);

  // ── Login ─────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await adminApi.login(username, password);
      if (res.success && res.token) {
        sessionStorage.setItem('zhele_admin_token', res.token);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('zhele_admin_token');
    setIsAuthenticated(false);
    setOrders([]);
    setProducts([]);
  };

  // ── Order status update ───────────────────────────────────────────────────
  const handleStatusChange = async (orderId, newStatus) => {
    setIsUpdatingStatus(orderId);
    try {
      await ordersApi.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`);
    } catch (err) {
      showToast(`Failed to update: ${err.message}`, 'error');
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // ── Re-seed ───────────────────────────────────────────────────────────────
  const handleReSeedMenu = async () => {
    if (!window.confirm('Re-seed bakery database with fresh products? This will replace all existing products!')) return;
    try {
      await catalogApi.seedDatabase();
      setSeedSuccess(true);
      fetchAdminData();
      showToast('Database seeded successfully!');
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch (err) {
      showToast(`Seeding error: ${err.message}`, 'error');
    }
  };

  // ── Product form helpers ──────────────────────────────────────────────────
  const openNewProductForm = () => {
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT);
    setProductFormError('');
    setShowProductForm(true);
  };

  const openEditProductForm = (product) => {
    setEditingProduct(product._id);
    setProductForm({
      name: product.name,
      description: product.description || '',
      basePrice: product.basePrice,
      imageUrl: product.imageUrl || '',
      category: product.category?._id || product.category || '',
      hasVariants: product.hasVariants || false,
      isAvailable: product.isAvailable !== false,
      variants: product.variants?.length > 0
        ? product.variants.map((v) => ({ name: v.name, price: v.price }))
        : [{ name: '', price: '' }],
    });
    setProductFormError('');
    setShowProductForm(true);
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    setProductFormLoading(true);
    setProductFormError('');

    try {
      const payload = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        basePrice: Number(productForm.basePrice),
        imageUrl: productForm.imageUrl.trim(),
        category: productForm.category,
        hasVariants: productForm.hasVariants,
        isAvailable: productForm.isAvailable,
        variants: productForm.hasVariants
          ? productForm.variants
              .filter((v) => v.name.trim() && v.price)
              .map((v) => ({ name: v.name.trim(), price: Number(v.price), isActive: true }))
          : [],
      };

      if (editingProduct) {
        await catalogApi.updateProduct(editingProduct, payload);
        showToast('Product updated successfully!');
      } else {
        await catalogApi.createProduct(payload);
        showToast('Product created successfully!');
      }

      setShowProductForm(false);
      fetchAdminData();
    } catch (err) {
      setProductFormError(err.message);
    } finally {
      setProductFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await catalogApi.deleteProduct(productId);
      setDeleteConfirm(null);
      fetchAdminData();
      showToast('Product deleted.');
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  // ── KPIs ─────────────────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const completedOrders = orders.filter((o) => ['completed', 'ready'].includes(o.status));
  const todayOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // PIN Gate → now uses real JWT login
  // ─────────────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#FFF8F0]">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-[#EEDCCB] shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#FAF4ED] flex items-center justify-center mx-auto border border-[#EEDCCB]">
            <Lock className="w-7 h-7 text-[#C8874A]" />
          </div>

          <div>
            <h2 className="text-xl font-black text-[#4B2E2B] font-display">Kitchen &amp; Staff Portal</h2>
            <p className="text-xs text-[#776D68] mt-1">Authorized bakery administrators only.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 text-left">
            <div>
              <label className="text-xs font-bold text-[#4B2E2B] block mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full p-3 bg-[#FAF4ED] border border-[#EEDCCB] rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#C8874A]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#4B2E2B] block mb-1">Password</label>
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full p-3 bg-[#FAF4ED] border border-[#EEDCCB] rounded-2xl text-sm font-semibold focus:outline-none focus:border-[#C8874A]"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-[#4B2E2B] hover:bg-[#2D150F] text-white font-black text-xs rounded-full shadow-md transition-all disabled:opacity-60"
            >
              {loginLoading ? 'Authenticating...' : 'Unlock Dashboard'}
            </button>
          </form>

          <p className="text-[10px] text-[#776D68]">
            Demo credentials: <strong className="text-[#C8874A]">admin / zhele2024</strong>
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Dashboard
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FDF8F2] flex flex-col md:flex-row font-sans relative">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 transition-all ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-[#4B2E2B] text-white'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4 text-[#C8874A]" />}
          {toast.msg}
        </div>
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="w-full md:w-64 bg-[#2D150F] text-[#FFF8F0] p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-11 h-11 rounded-full bg-[#FFF8F0] flex items-center justify-center text-2xl shadow-xs border border-[#C8874A]">
              🧁
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Zhele Kitchen</h2>
              <span className="text-[10px] font-bold text-[#C8874A] uppercase tracking-wider">Live Store Ops</span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-bold">
            {[
              { id: 'orders', icon: ClipboardList, label: 'Orders Queue', badge: pendingOrders.length },
              { id: 'products', icon: Cake, label: 'Products & Menu', badge: null, info: products.length },
              { id: 'analytics', icon: TrendingUp, label: 'Analytics', badge: null },
            ].map(({ id, icon: Icon, label, badge, info }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  activeTab === id
                    ? 'bg-[#C8874A] text-white shadow-md'
                    : 'text-[#F4D7C4]/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
                {badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{badge}</span>
                )}
                {info !== undefined && (
                  <span className="ml-auto text-[10px] text-white/50">{info}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" /> Exit to Shop
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Lock Portal
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#4B2E2B] font-display">
              {activeTab === 'orders' ? 'Live Orders & Kitchen Queue'
               : activeTab === 'products' ? 'Product Catalogue & Inventory'
               : 'Analytics & Overview'}
            </h1>
            <p className="text-xs text-[#776D68] mt-0.5">
              Real-time feed • WebSocket connected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAdminData(true)}
              className="p-2.5 rounded-xl bg-white border border-[#EEDCCB] text-[#4B2E2B] hover:bg-[#FAF4ED] transition-colors shadow-xs"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {activeTab === 'products' && (
              <>
                <button
                  onClick={openNewProductForm}
                  className="px-4 py-2.5 bg-[#C8874A] text-white rounded-xl text-xs font-bold hover:bg-[#b57438] transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Product
                </button>
                <button
                  onClick={handleReSeedMenu}
                  className="px-4 py-2.5 bg-[#4B2E2B] text-white rounded-xl text-xs font-bold hover:bg-[#2D150F] transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C8874A]" /> Re-Seed DB
                </button>
              </>
            )}
          </div>
        </div>

        {seedSuccess && (
          <div className="bg-green-100 border border-green-300 text-green-900 p-4 rounded-2xl text-xs font-bold mb-6">
            🎉 Database successfully populated with the updated bakery master catalogue!
          </div>
        )}

        {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: orders.length, sub: `${todayOrders.length} today`, color: 'text-[#4B2E2B]', icon: '📦' },
            { label: 'Total Revenue', value: `KSh ${totalRevenue.toLocaleString()}`, sub: 'All time', color: 'text-[#C8874A]', icon: '💰' },
            { label: 'Pending', value: pendingOrders.length, sub: 'Need action', color: 'text-amber-600', icon: '⏳' },
            { label: 'Completed', value: completedOrders.length, sub: 'Fulfilled', color: 'text-green-600', icon: '✅' },
          ].map(({ label, value, sub, color, icon }) => (
            <div key={label} className="bg-white p-5 rounded-3xl border border-[#EEDCCB] shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-[#776D68] uppercase">{label}</span>
                <span className="text-lg">{icon}</span>
              </div>
              <div className={`text-2xl font-black font-display ${color}`}>{value}</div>
              <span className="text-[10px] text-[#776D68] font-medium">{sub}</span>
            </div>
          ))}
        </div>

        {/* ── ORDERS TAB ────────────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#EEDCCB] p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[#EEDCCB] pb-4">
              <h2 className="text-base font-extrabold text-[#4B2E2B] font-display">
                Orders Feed ({orders.length})
              </h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#776D68]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-bold p-2 rounded-xl border border-[#EEDCCB] bg-[#FAF4ED] focus:outline-none focus:border-[#C8874A]"
                >
                  <option value="">All Statuses</option>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16 text-xs text-[#776D68]">Loading live feed...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 space-y-2 text-[#776D68]">
                <Package className="w-10 h-10 mx-auto text-gray-300" />
                <p className="font-bold text-sm">No orders found.</p>
                <p className="text-xs">Placed orders will stream here automatically.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div
                    key={o._id}
                    className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#EEDCCB] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:border-[#C8874A] transition-colors"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-[#C8874A] text-sm tracking-wide">{o.orderNumber}</span>
                        <span className="text-xs font-bold text-[#4B2E2B]">{o.customerName}</span>
                        <span className="text-xs text-[#776D68]">({o.phone})</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[o.status] || ''}`}>
                          {STATUS_LABELS[o.status] || o.status}
                        </span>
                        <span className="text-[10px] text-[#776D68]">
                          {new Date(o.createdAt).toLocaleString('en-KE', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-xs text-[#776D68]">
                        📍 <strong className="text-[#4B2E2B] capitalize">{o.deliveryType}</strong> • {o.deliveryLocation}
                        <span className="ml-2 text-[10px] font-bold text-[#C8874A]">💳 {o.paymentMethod?.toUpperCase()}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {o.items?.map((it, i) => (
                          <span key={i} className="bg-white border border-[#EEDCCB] px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#4B2E2B]">
                            {it.quantity}× {it.name} {it.variantName ? `(${it.variantName})` : ''}
                          </span>
                        ))}
                      </div>
                      {o.orderNotes && (
                        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 mt-1">
                          📝 {o.orderNotes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-[#EEDCCB] shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-[#776D68] uppercase font-bold block">Total</span>
                        <span className="font-black text-sm text-[#4B2E2B]">KSh {o.totalAmount?.toLocaleString()}</span>
                        {o.deliveryFee > 0 && (
                          <span className="text-[10px] text-[#776D68] block">+KSh {o.deliveryFee} delivery</span>
                        )}
                      </div>
                      <select
                        value={o.status}
                        disabled={isUpdatingStatus === o._id}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className={`text-xs font-black p-2.5 rounded-xl border focus:outline-none cursor-pointer ${STATUS_STYLES[o.status] || ''}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ──────────────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {showProductForm && (
              <ProductFormModal
                form={productForm}
                setForm={setProductForm}
                categories={categories}
                isEditing={!!editingProduct}
                loading={productFormLoading}
                error={productFormError}
                onSubmit={handleProductFormSubmit}
                onClose={() => setShowProductForm(false)}
              />
            )}

            {deleteConfirm && (
              <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-red-200 shadow-2xl text-center space-y-4">
                  <Trash2 className="w-10 h-10 text-red-500 mx-auto" />
                  <h3 className="font-black text-[#4B2E2B]">Delete Product?</h3>
                  <p className="text-xs text-[#776D68]">This action cannot be undone.</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 py-2.5 border border-[#EEDCCB] rounded-xl text-xs font-bold text-[#776D68] hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(deleteConfirm)}
                      className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-[#EEDCCB] p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[#EEDCCB] pb-4">
                <h2 className="text-base font-extrabold text-[#4B2E2B] font-display">
                  Current Menu ({products.length} Products)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-[#EEDCCB] flex gap-3 items-center hover:border-[#C8874A] transition-colors group"
                  >
                    <img
                      src={p.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=120&auto=format&fit=crop'}
                      alt={p.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#EEDCCB] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#C8874A] uppercase block">{p.category?.name || 'Category'}</span>
                      <h4 className="font-extrabold text-xs text-[#4B2E2B] truncate">{p.name}</h4>
                      <span className="text-xs font-black text-[#4B2E2B]">KSh {p.basePrice?.toLocaleString()}</span>
                      {p.hasVariants && (
                        <span className="ml-2 text-[10px] text-gray-500">({p.variants?.length} sizes)</span>
                      )}
                      <div className="mt-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {p.isAvailable ? '● Available' : '● Unavailable'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditProductForm(p)}
                        className="p-1.5 rounded-lg bg-white border border-[#EEDCCB] text-[#4B2E2B] hover:bg-[#FAF4ED] transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(p._id)}
                        className="p-1.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ANALYTICS TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <AnalyticsTab orders={orders} products={products} />
        )}

      </main>
    </div>
  );
}

// ─── Product Form Modal ────────────────────────────────────────────────────────
function ProductFormModal({ form, setForm, categories, isEditing, loading, error, onSubmit, onClose }) {
  const updateVariant = (i, field, value) => {
    const updated = [...form.variants];
    updated[i] = { ...updated[i], [field]: value };
    setForm((f) => ({ ...f, variants: updated }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-[#EEDCCB] shadow-2xl my-4">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-black text-[#4B2E2B] font-display">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-[#776D68]" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name */}
          <InputField
            label="Product Name *" value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            placeholder="e.g. Chocolate Cake" required
          />

          {/* Category */}
          <div>
            <label className="text-xs font-bold text-[#4B2E2B] block mb-1">Category *</label>
            <select
              required value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full p-2.5 bg-[#FAF4ED] border border-[#EEDCCB] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C8874A]"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Base Price */}
          <InputField
            label="Base Price (KSh) *" type="number" value={form.basePrice}
            onChange={(v) => setForm((f) => ({ ...f, basePrice: v }))}
            placeholder="e.g. 350" required min={0}
          />

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-[#4B2E2B] block mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short product description..."
              rows={2}
              className="w-full p-2.5 bg-[#FAF4ED] border border-[#EEDCCB] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C8874A] resize-none"
            />
          </div>

          {/* Image URL */}
          <InputField
            label="Image URL" value={form.imageUrl}
            onChange={(v) => setForm((f) => ({ ...f, imageUrl: v }))}
            placeholder="https://images.unsplash.com/..."
          />

          {/* Toggles */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={form.hasVariants}
                onChange={(e) => setForm((f) => ({ ...f, hasVariants: e.target.checked }))}
                className="accent-[#C8874A] w-4 h-4"
              />
              <span className="text-xs font-bold text-[#4B2E2B]">Has Variants / Sizes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={form.isAvailable}
                onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))}
                className="accent-[#00A859] w-4 h-4"
              />
              <span className="text-xs font-bold text-[#4B2E2B]">Available</span>
            </label>
          </div>

          {/* Variants */}
          {form.hasVariants && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#4B2E2B] block">Variants / Sizes</label>
              {form.variants.map((v, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={v.name} onChange={(e) => updateVariant(i, 'name', e.target.value)}
                    placeholder="e.g. 1 kg" 
                    className="flex-1 p-2 bg-[#FAF4ED] border border-[#EEDCCB] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C8874A]"
                  />
                  <input
                    type="number" value={v.price} onChange={(e) => updateVariant(i, 'price', e.target.value)}
                    placeholder="Price" min={0}
                    className="w-24 p-2 bg-[#FAF4ED] border border-[#EEDCCB] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C8874A]"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, variants: f.variants.filter((_, j) => j !== i) }))}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, variants: [...f.variants, { name: '', price: '' }] }))}
                className="text-xs font-bold text-[#C8874A] flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-xl border border-red-200">
              ⚠️ {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-3 border border-[#EEDCCB] rounded-xl text-xs font-bold text-[#776D68] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 py-3 bg-[#C8874A] hover:bg-[#b57438] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-60"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Input Field Helper ────────────────────────────────────────────────────────
function InputField({ label, value, onChange, type = 'text', placeholder, required, min }) {
  return (
    <div>
      <label className="text-xs font-bold text-[#4B2E2B] block mb-1">{label}</label>
      <input
        type={type} value={value} required={required} min={min}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2.5 bg-[#FAF4ED] border border-[#EEDCCB] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#C8874A]"
      />
    </div>
  );
}

// ─── Analytics Tab ─────────────────────────────────────────────────────────────
function AnalyticsTab({ orders, products }) {
  const byStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const byPayment = orders.reduce((acc, o) => {
    const m = o.paymentMethod || 'unknown';
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const avgOrder = orders.length ? Math.round(totalRevenue / orders.length) : 0;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-[#EEDCCB] shadow-xs text-center">
          <span className="text-3xl font-black text-[#C8874A]">KSh {totalRevenue.toLocaleString()}</span>
          <p className="text-xs text-[#776D68] font-bold mt-1 uppercase tracking-wide">Total Revenue</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-[#EEDCCB] shadow-xs text-center">
          <span className="text-3xl font-black text-[#4B2E2B]">KSh {avgOrder.toLocaleString()}</span>
          <p className="text-xs text-[#776D68] font-bold mt-1 uppercase tracking-wide">Avg Order Value</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-[#EEDCCB] shadow-xs text-center">
          <span className="text-3xl font-black text-[#4B2E2B]">{products.length}</span>
          <p className="text-xs text-[#776D68] font-bold mt-1 uppercase tracking-wide">Active Products</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Orders by status */}
        <div className="bg-white p-6 rounded-3xl border border-[#EEDCCB] shadow-xs">
          <h3 className="font-black text-[#4B2E2B] mb-4 font-display">Orders by Status</h3>
          <div className="space-y-2.5">
            {Object.entries(byStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                  {STATUS_LABELS[status] || status}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-[#C8874A] h-1.5 rounded-full"
                      style={{ width: `${(count / orders.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-[#4B2E2B] w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by payment */}
        <div className="bg-white p-6 rounded-3xl border border-[#EEDCCB] shadow-xs">
          <h3 className="font-black text-[#4B2E2B] mb-4 font-display">Orders by Payment Method</h3>
          <div className="space-y-2.5">
            {Object.entries(byPayment).map(([method, count]) => (
              <div key={method} className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#4B2E2B] capitalize">
                  {method === 'mpesa' ? '📱 M-Pesa' : method === 'cash' ? '💵 Cash' : '💳 Card'}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-[#4B2E2B] h-1.5 rounded-full"
                      style={{ width: `${(count / orders.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-[#4B2E2B] w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
