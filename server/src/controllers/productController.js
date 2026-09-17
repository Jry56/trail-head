import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    List products with search, category filter, sort, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 12, 48);
  const { search, category, minPrice, maxPrice, sort, featured } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$text = { $search: search };
  }
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) query.category = cat._id;
    else return res.json({ success: true, products: [], page, pages: 0, total: 0 });
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (featured === 'true') {
    query.isFeatured = true;
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
    name: { name: 1 },
  };
  const sortOption = sortMap[sort] || sortMap.newest;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-reviews'),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get a single product by slug (used for clean, SEO-friendly URLs)
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate(
    'category',
    'name slug'
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  res.json({ success: true, product });
});

// @desc    Get related products (same category, excluding current product)
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(4)
    .select('-reviews');

  res.json({ success: true, products: related });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json({ success: true, product: updated });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }
  await product.deleteOne();
  res.json({ success: true, message: 'Product removed.' });
});

// @desc    Get single product by id (admin editing)
// @route   GET /api/products/:id
// @access  Private/Admin
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }
  res.json({ success: true, product });
});

// @desc    Add a review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  const alreadyReviewed = product.reviews.some((r) => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) {
    res.status(409);
    throw new Error('You have already reviewed this product.');
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });
  product.recalculateRating();
  await product.save();

  res.status(201).json({ success: true, message: 'Review added.' });
});
