import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String, trim: true },
  basePrice: { type: Number, required: true, min: 0 },
  imageUrl: { type: String },
  
  hasVariants: { type: Boolean, default: false },
  variants: [{
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true }
  }],

  isAvailable: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: null },
  
  availabilitySchedule: {
    isRestricted: { type: Boolean, default: false },
    availableDays: [{ type: Number, min: 0, max: 6 }]
  }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);