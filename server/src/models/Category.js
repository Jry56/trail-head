import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Category name is required'], trim: true, unique: true, maxlength: 60 },
    slug: { type: String, unique: true, index: true },
    description: { type: String, trim: true, maxlength: 300 },
    image: {
      url: { type: String, default: '' },
      alt: { type: String, default: '' },
    },
    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 160 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.pre('validate', function generateSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});
// findOneAndUpdate with upsert:true bypasses document middleware above,
// so this covers slug generation on upsert-style inserts too.
categorySchema.pre('findOneAndUpdate', function generateSlugOnUpsert(next) {
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
export default mongoose.model('Category', categorySchema);
