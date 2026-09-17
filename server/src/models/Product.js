import mongoose from 'mongoose';
import slugify from 'slugify';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: [true, 'Image url is required'] },
    // Alt text is required on every product image so the storefront never renders
    // an <img> without a real, descriptive alt attribute.
    alt: { type: String, required: [true, 'Alt text is required for every product image'], trim: true, maxlength: 150 },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 120 },
    slug: { type: String, unique: true, index: true },
    brand: { type: String, trim: true, maxlength: 60 },
    sku: { type: String, trim: true, unique: true, sparse: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'Category is required'] },
    shortDescription: { type: String, trim: true, maxlength: 200 },
    description: { type: String, required: [true, 'Description is required'], maxlength: 5000 },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    currency: { type: String, default: 'USD' },
    images: {
      type: [imageSchema],
      validate: [(arr) => arr.length > 0, 'At least one product image is required'],
    },
    stock: { type: Number, required: true, min: 0, default: 0 },
    attributes: [
      {
        name: String,
        value: String,
        _id: false,
      },
    ],
    tags: [{ type: String, trim: true }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    // --- SEO fields, editable per product from the admin app ---
    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 160 },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', shortDescription: 'text', description: 'text', tags: 'text' });

productSchema.pre('validate', function generateSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});
// findOneAndUpdate with upsert:true bypasses document middleware above,
// so this covers slug generation on upsert-style inserts too.
productSchema.pre('findOneAndUpdate', function generateSlugOnUpsert(next) {
  const update = this.getUpdate() || {};
  const name = update.name || update.$set?.name;
  const hasSlug = update.slug || update.$set?.slug;
  if (name && !hasSlug) {
    const slug = slugify(name, { lower: true, strict: true });
    if (update.$set) update.$set.slug = slug;
    else update.slug = slug;
  }
  next();
});

productSchema.methods.recalculateRating = function recalculateRating() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
    return;
  }
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.numReviews = this.reviews.length;
  this.rating = Math.round((total / this.reviews.length) * 10) / 10;
};

export default mongoose.model('Product', productSchema);
