import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Get all active categories along with their available products
// @route   GET /api/catalog/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('displayOrder').lean();
    const products = await Product.find({ isAvailable: true }).lean();

    // Group products into their respective categories
    const categoriesWithProducts = categories.map((cat) => ({
      ...cat,
      products: products.filter(
        (prod) => prod.category.toString() === cat._id.toString()
      ),
    }));

    res.status(200).json({ success: true, data: categoriesWithProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all active products
// @route   GET /api/catalog/products
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isAvailable: true };

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).populate('category', 'name slug');
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/catalog/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Seed database with initial menu (Development Only)
// @route   POST /api/catalog/seed
export const seedDatabase = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Database seeding is disabled in production.' });
  }
  try {
    await Category.deleteMany();
    await Product.deleteMany();

    const cakesCat = await Category.create({ name: 'Cakes', slug: 'cakes', displayOrder: 1 });
    const pastriesCat = await Category.create({ name: 'Pastries', slug: 'pastries', displayOrder: 2 });
    const cookiesCat = await Category.create({ name: 'Cookies', slug: 'cookies', displayOrder: 3 });
    const donutsCat = await Category.create({ name: 'Donuts', slug: 'donuts', displayOrder: 4 });
    const snacksCat = await Category.create({ name: 'Snacks', slug: 'snacks', displayOrder: 5 });
    const drinksCat = await Category.create({ name: 'Drinks', slug: 'drinks', displayOrder: 6 });
    const combosCat = await Category.create({ name: 'Combos', slug: 'combos', displayOrder: 7 });

    const products = [
      // Cakes
      {
        name: 'Chocolate Cake',
        category: cakesCat._id,
        description: 'Decadent rich dark chocolate sponge layered with smooth chocolate ganache and chocolate shavings.',
        basePrice: 1800,
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
        hasVariants: true,
        variants: [
          { name: '1 kg', price: 1800, isActive: true },
          { name: '2 kg', price: 2900, isActive: true },
          { name: 'Slice', price: 250, isActive: true },
        ],
        isAvailable: true,
      },
      {
        name: 'Red Velvet Cake',
        category: cakesCat._id,
        description: 'Luxurious crimson sponge with hints of cocoa, finished with silky vanilla cream cheese frosting.',
        basePrice: 1900,
        imageUrl: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&auto=format&fit=crop&q=80',
        hasVariants: true,
        variants: [
          { name: '1 kg', price: 1900, isActive: true },
          { name: '2 kg', price: 3100, isActive: true },
          { name: 'Slice', price: 280, isActive: true },
        ],
        isAvailable: true,
      },
      {
        name: 'Red Velvet Cupcake',
        category: cakesCat._id,
        description: 'Handcrafted mini velvet cake topped with cream cheese swirl and ruby sponge crumbs.',
        basePrice: 250,
        imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&auto=format&fit=crop&q=80',
        hasVariants: true,
        variants: [
          { name: 'Single Cupcake', price: 250, isActive: true },
          { name: 'Box of 4', price: 900, isActive: true },
          { name: 'Box of 6', price: 1300, isActive: true },
        ],
        isAvailable: true,
      },

      // Pastries
      {
        name: 'Cinnamon Roll',
        category: pastriesCat._id,
        description: 'Warm, fluffy rolled pastry baked with aromatic cinnamon, brown sugar, and sweet vanilla icing.',
        basePrice: 150,
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        hasVariants: true,
        variants: [
          { name: 'Single Piece', price: 150, isActive: true },
          { name: 'Pack of 3', price: 400, isActive: true },
        ],
        isAvailable: true,
      },
      {
        name: 'Butter Croissant',
        category: pastriesCat._id,
        description: 'Golden, flaky, French-style laminated pastry made with pure butter for a melt-in-the-mouth texture.',
        basePrice: 160,
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
        hasVariants: false,
        isAvailable: true,
      },
      {
        name: 'Fresh Bread Loaf',
        category: pastriesCat._id,
        description: 'Daily fresh-baked soft sliced white artisan bread loaf, perfect for toast and sandwiches.',
        basePrice: 60,
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        hasVariants: false,
        isAvailable: true,
      },

      // Cookies
      {
        name: 'Chocolate-Chip Cookies',
        category: cookiesCat._id,
        description: 'Golden, buttery cookies baked chewy in the center with chunks of real melted chocolate chips.',
        basePrice: 200,
        imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80',
        hasVariants: true,
        variants: [
          { name: 'Pack of 3', price: 200, isActive: true },
          { name: 'Pack of 6', price: 380, isActive: true },
        ],
        isAvailable: true,
      },

      // Donuts
      {
        name: 'Donuts (Glazed)',
        category: donutsCat._id,
        description: 'Light and airy ring donuts drenched in our signature sweet glaze with a crispy bite.',
        basePrice: 120,
        imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80',
        hasVariants: true,
        variants: [
          { name: 'Single Donut', price: 120, isActive: true },
          { name: 'Box of 4', price: 420, isActive: true },
        ],
        isAvailable: true,
      },

      // Snacks / Savoury Bites
      {
        name: 'Beef Samosa',
        category: snacksCat._id,
        description: 'Crispy fried triangular pastry filled with spiced minced beef, coriander, onions, and garlic.',
        basePrice: 100,
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
        hasVariants: true,
        variants: [
          { name: 'Pair (2 pcs)', price: 100, isActive: true },
          { name: 'Plate (5 pcs)', price: 230, isActive: true },
        ],
        isAvailable: true,
      },
      {
        name: 'Golden Mandazi',
        category: snacksCat._id,
        description: 'Authentic Kenyan coastal-style fried pastry infused with ground cardamom and coconut milk.',
        basePrice: 20,
        imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80',
        hasVariants: true,
        variants: [
          { name: 'Single Piece', price: 20, isActive: true },
          { name: 'Pack of 5', price: 90, isActive: true },
        ],
        isAvailable: true,
      },
      {
        name: 'Chicken Loaded Fries',
        category: snacksCat._id,
        description: 'Crispy potato fries smothered in shredded seasoned chicken, homemade sauce, and melted cheese.',
        basePrice: 250,
        imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80',
        hasVariants: true,
        variants: [
          { name: 'Regular', price: 250, isActive: true },
          { name: 'Large Platter', price: 380, isActive: true },
        ],
        isAvailable: true,
      },

      // Drinks
      {
        name: 'Fruits Juice',
        category: drinksCat._id,
        description: 'Freshly blended cold tropical juice featuring passion fruit, sweet mango, and fresh orange.',
        basePrice: 180,
        imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
        hasVariants: true,
        variants: [
          { name: '350ml Glass', price: 180, isActive: true },
          { name: '500ml Bottle', price: 240, isActive: true },
        ],
        isAvailable: true,
      },

      // Combos
      {
        name: 'Combo Deal: Cake Slice + Drink',
        category: combosCat._id,
        description: 'Your choice of any fresh cake slice paired with a chilled tropical juice or handcrafted iced coffee.',
        basePrice: 550,
        imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80',
        hasVariants: false,
        isAvailable: true,
      },
    ];

    await Product.insertMany(products);

    res.status(201).json({ success: true, message: 'Database seeded successfully with Zhele bakery menu!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Seeding Error', error: error.message });
  }
};

// @desc    Create a product (admin only)
// @route   POST /api/catalog/products
export const createProduct = async (req, res) => {
  try {
    const { name, category, description, basePrice, imageUrl, hasVariants, variants, isAvailable } = req.body;
    if (!name || !category || basePrice === undefined) {
      return res.status(400).json({ success: false, message: 'name, category and basePrice are required.' });
    }
    const product = await Product.create({ name, category, description, basePrice, imageUrl, hasVariants, variants, isAvailable });
    const populated = await product.populate('category', 'name slug');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update a product (admin only)
// @route   PUT /api/catalog/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a product (admin only)
// @route   DELETE /api/catalog/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};