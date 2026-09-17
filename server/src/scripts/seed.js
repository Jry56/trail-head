import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

const categories = [
  {
    name: 'Tents & Shelter',
    description: 'Freestanding, backpacking and family tents built for wind, rain and long trail miles.',
    image: { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', alt: 'Two-person tent pitched beside a mountain lake at dawn' },
    metaTitle: 'Tents & Shelter | Trailhead Supply Co.',
    metaDescription: 'Backpacking, freestanding and family camping tents tested in real wind and rain. Free shipping over $100.',
  },
  {
    name: 'Backpacks',
    description: 'Daypacks, overnight packs and multi-day haulers with real load-carrying capacity.',
    image: { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', alt: 'Hiker wearing a loaded backpacking pack on a forest trail' },
    metaTitle: 'Backpacks & Packs | Trailhead Supply Co.',
    metaDescription: 'Daypacks and multi-day backpacking packs sized for real trips, from fastpacking vests to 65L haulers.',
  },
  {
    name: 'Cook Systems',
    description: 'Stoves, cookware and water filters for basecamp and ultralight trips alike.',
    image: { url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0723c6a?w=800', alt: 'Camping stove boiling water on a rock beside a tent' },
    metaTitle: 'Camp Stoves & Cook Systems | Trailhead Supply Co.',
    metaDescription: 'Backpacking stoves, cookware and water filters chosen for weight, boil time and reliability in the field.',
  },
  {
    name: 'Footwear',
    description: 'Trail runners, hiking boots and camp shoes for every terrain and season.',
    image: { url: 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=800', alt: 'Pair of hiking boots resting on a rocky trail' },
    metaTitle: 'Hiking Boots & Trail Shoes | Trailhead Supply Co.',
    metaDescription: 'Hiking boots and trail running shoes built for grip, support and long days on rocky or wet terrain.',
  },
  {
    name: 'Apparel',
    description: 'Layering pieces built for temperature swings on the trail, from base layers to rain shells.',
    image: { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', alt: 'Hiker wearing a rain shell jacket in misty forest conditions' },
    metaTitle: 'Trail Apparel & Layers | Trailhead Supply Co.',
    metaDescription: 'Base layers, insulation and rain shells for backpacking, day hikes and cold-weather camping.',
  },
];

const productsByCategory = {
  'Tents & Shelter': [
    {
      name: 'Ridgeline 2P Backpacking Tent',
      brand: 'Trailhead',
      price: 289.0,
      compareAtPrice: 329.0,
      stock: 24,
      shortDescription: 'A 2-person, 3-season freestanding tent at 3.1 lbs packed weight.',
      description:
        'The Ridgeline 2P is built for backpackers who count every ounce without giving up livable space. A freestanding aluminum pole structure pitches in under four minutes, dual doors and vestibules keep gear dry and accessible, and a fully taped 20D ripstop floor holds up to rocky, root-covered ground. Tested down to 20°F with light snow load.',
      images: [
        { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1000', alt: 'Ridgeline 2P tent pitched beside a mountain lake at sunrise' },
        { url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1000', alt: 'Interior view of the Ridgeline 2P tent showing dual vestibules' },
      ],
      attributes: [
        { name: 'Packed weight', value: '3.1 lbs (1.4 kg)' },
        { name: 'Capacity', value: '2 people' },
        { name: 'Season rating', value: '3-season' },
        { name: 'Floor material', value: '20D ripstop nylon, taped seams' },
      ],
      tags: ['tent', 'backpacking', 'freestanding', '2-person'],
      isFeatured: true,
    },
    {
      name: 'Basecamp 6P Family Tent',
      brand: 'Trailhead',
      price: 379.0,
      stock: 12,
      shortDescription: 'Room-to-stand family tent with a full-coverage rainfly.',
      description:
        'The Basecamp 6P trades ultralight weight for headroom and livability. A 6-foot center height means most adults can stand fully upright, a color-coded pole system speeds up setup at the campground, and the full-coverage rainfly with large awning keeps a dry porch area for boots and packs in wet weather.',
      images: [
        { url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1000', alt: 'Basecamp 6P family tent set up at a campground site' },
      ],
      attributes: [
        { name: 'Packed weight', value: '14.6 lbs (6.6 kg)' },
        { name: 'Capacity', value: '6 people' },
        { name: 'Center height', value: '74 in (188 cm)' },
      ],
      tags: ['tent', 'family', 'car camping'],
    },
  ],
  Backpacks: [
    {
      name: 'Summit 45L Backpacking Pack',
      brand: 'Trailhead',
      price: 219.0,
      stock: 30,
      shortDescription: 'A 45L overnight-to-3-day pack with an adjustable torso.',
      description:
        'The Summit 45L is sized for one- to three-night trips without wasted volume. An adjustable torso length (torso range 16"-21") means one pack fits a wider range of hikers, a ventilated mesh back panel cuts down on sweat build-up on climbs, and a roll-top main compartment keeps the load compact when it is not full.',
      images: [
        { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000', alt: 'Hiker wearing the Summit 45L backpack on a forested ridge trail' },
      ],
      attributes: [
        { name: 'Volume', value: '45 liters' },
        { name: 'Empty weight', value: '2.9 lbs (1.3 kg)' },
        { name: 'Torso range', value: '16"-21" adjustable' },
      ],
      tags: ['backpack', 'overnight', '45L'],
      isFeatured: true,
    },
    {
      name: 'Fastpack 20L Daypack',
      brand: 'Trailhead',
      price: 89.0,
      stock: 48,
      shortDescription: 'A running-vest-inspired 20L daypack for fast, unloaded miles.',
      description:
        'Built from the same pattern as running vests, the Fastpack 20L rides close to the body so it does not bounce on descents. Front shoulder pockets hold water bottles and snacks within reach, and a dedicated hydration reservoir sleeve keeps weight centered.',
      images: [
        { url: 'https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=1000', alt: 'Trail runner wearing the Fastpack 20L daypack on a dirt trail' },
      ],
      attributes: [
        { name: 'Volume', value: '20 liters' },
        { name: 'Empty weight', value: '1.1 lbs (0.5 kg)' },
      ],
      tags: ['backpack', 'daypack', 'trail running'],
    },
  ],
  'Cook Systems': [
    {
      name: 'Ember Ultralight Canister Stove',
      brand: 'Trailhead',
      price: 54.0,
      stock: 60,
      shortDescription: 'A 2.6oz canister stove that boils 1L of water in under 4 minutes.',
      description:
        'The Ember weighs 2.6 ounces yet boils a liter of water in under four minutes in still conditions. Folding pot supports stabilize wider pots, and a built-in piezo igniter means no matches or lighter in wet or windy weather.',
      images: [
        { url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0723c6a?w=1000', alt: 'Ember canister stove boiling water on rocky ground' },
      ],
      attributes: [
        { name: 'Weight', value: '2.6 oz (74 g)' },
        { name: 'Boil time (1L)', value: '~3.5 minutes' },
        { name: 'Fuel type', value: 'Iso-butane canister' },
      ],
      tags: ['stove', 'cook system', 'ultralight'],
      isFeatured: true,
    },
    {
      name: 'Clearflow Water Filter',
      brand: 'Trailhead',
      price: 42.0,
      stock: 55,
      shortDescription: 'A 0.1-micron hollow-fiber filter, field-cleanable, no batteries.',
      description:
        'A 0.1-micron hollow-fiber filter removes bacteria, protozoa and microplastics from backcountry water sources. The filter threads directly onto standard disposable water bottles or the included pouch, and a backflush syringe restores flow rate in the field without spare parts.',
      images: [
        { url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0723c6a?w=1000', alt: 'Clearflow water filter attached to a bottle beside a stream' },
      ],
      attributes: [
        { name: 'Filter pore size', value: '0.1 micron' },
        { name: 'Rated capacity', value: '1,000 liters' },
      ],
      tags: ['water filter', 'cook system'],
    },
  ],
  Footwear: [
    {
      name: 'Talus Mid Hiking Boot',
      brand: 'Trailhead',
      price: 159.0,
      stock: 40,
      shortDescription: 'A waterproof mid-cut boot with a Vibram outsole for loaded miles.',
      description:
        'The Talus Mid pairs a waterproof-breathable membrane with a Vibram outsole for grip on wet rock and loose scree. A supportive midsole handles pack loads on multi-day trips, and the mid-cut collar protects ankles on uneven terrain without the stiffness of a full boot.',
      images: [
        { url: 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=1000', alt: 'Talus Mid hiking boots resting on a granite trail' },
      ],
      attributes: [
        { name: 'Upper', value: 'Waterproof-breathable membrane' },
        { name: 'Outsole', value: 'Vibram rubber, multidirectional lugs' },
      ],
      tags: ['boots', 'hiking', 'waterproof'],
      isFeatured: true,
    },
    {
      name: 'Switchback Trail Runner',
      brand: 'Trailhead',
      price: 129.0,
      stock: 50,
      shortDescription: 'A lightweight trail running shoe for fast hikes and day trips.',
      description:
        'The Switchback is built for hikers who prefer the lighter feel of a trail runner over a boot. A rock plate protects the forefoot from sharp terrain, and an aggressive lug pattern grips loose dirt and mud on descents.',
      images: [
        { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000', alt: 'Switchback trail running shoes on a muddy forest trail' },
      ],
      attributes: [
        { name: 'Weight (pair)', value: '1.4 lbs (635 g)' },
        { name: 'Drop', value: '6mm' },
      ],
      tags: ['trail runner', 'footwear', 'lightweight'],
    },
  ],
  Apparel: [
    {
      name: 'Alpenglow Rain Shell',
      brand: 'Trailhead',
      price: 189.0,
      stock: 35,
      shortDescription: 'A fully seam-taped 2.5-layer rain shell, packs to fist size.',
      description:
        'The Alpenglow keeps weather out on multi-day trips without the bulk of a heavier shell. Fully taped seams and a storm-flap-protected zipper block driving rain, pit zips dump heat on climbs, and the whole jacket packs into its own chest pocket for storage.',
      images: [
        { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1000', alt: 'Hiker wearing the Alpenglow rain shell in misty conditions' },
      ],
      attributes: [
        { name: 'Weight', value: '10.9 oz (309 g)' },
        { name: 'Waterproof rating', value: '20,000mm' },
      ],
      tags: ['rain jacket', 'shell', 'apparel'],
      isFeatured: true,
    },
    {
      name: 'Merino Base Layer Top',
      brand: 'Trailhead',
      price: 69.0,
      stock: 70,
      shortDescription: '150gsm merino wool base layer, odor-resistant for multi-day trips.',
      description:
        'A 150gsm merino wool base layer that regulates temperature in both cold mornings and warm afternoon climbs. Merino resists odor buildup far better than synthetic layers, which matters on trips where you cannot wash a shirt for days.',
      images: [
        { url: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1000', alt: 'Merino wool base layer top laid flat, folded' },
      ],
      attributes: [
        { name: 'Fabric', value: '150gsm merino wool' },
        { name: 'Fit', value: 'Regular, athletic taper' },
      ],
      tags: ['base layer', 'merino', 'apparel'],
    },
  ],
};

async function seed() {
  await connectDB();

  const destroy = process.argv.includes('--destroy');

  if (destroy) {
    await Promise.all([Product.deleteMany({}), Category.deleteMany({}), User.deleteMany({ role: 'admin' })]);
    console.log('Destroyed existing catalog data and admin users.');
    await mongoose.connection.close();
    return;
  }

  console.log('Seeding categories...');
  const createdCategories = {};
  for (const cat of categories) {
    const existing = await Category.findOneAndUpdate({ name: cat.name }, cat, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    createdCategories[cat.name] = existing;
  }

  console.log('Seeding products...');
  for (const [categoryName, items] of Object.entries(productsByCategory)) {
    const category = createdCategories[categoryName];
    for (const item of items) {
      await Product.findOneAndUpdate(
        { name: item.name },
        { ...item, category: category._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  }

  const adminEmail = 'admin@trailheadsupply.example.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'Store Admin',
      email: adminEmail,
      password: 'ChangeThisPassword123!',
      role: 'admin',
    });
    console.log(`Created admin user: ${adminEmail} / ChangeThisPassword123! (change this immediately)`);
  }

  console.log('Seed complete.');
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
