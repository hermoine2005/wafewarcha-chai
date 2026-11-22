// Usage: npm run seed  (creates the admin from env vars + SAMPLE demo content if collections are empty)
require('dotenv').config({ override: true });
const mongoose = require('mongoose');
const User = require('../models/User');
const Brand = require('../models/BrandInformation');
const FranchiseModel = require('../models/FranchiseModel');
const Investment = require('../models/Investment');
const OperatingCost = require('../models/OperatingCost');
const Product = require('../models/Product');
const FranchiseProcess = require('../models/FranchiseProcess');
const Gallery = require('../models/Gallery');

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;
const I = {
  tea: img('1544787219-7f47ccb76574'), pour: img('1564890369478-c89ca6d9cde9'), tea2: img('1576092768241-dec231879fc3'),
  cups: img('1571934811356-5cc061b6821f'), latte: img('1495474472287-4d71bcdd2085'), coffee: img('1509042239860-f550ce710b93'),
  cafe: img('1442512595331-e89e73853f31'), cafe2: img('1554118811-1e0d58224f24'), interior: img('1517248135467-4c7edcad34c4'),
  iced: img('1461023058943-07fcbe16d735'), snack: img('1601050690597-df0568f70950'),
};

(async () => {
  await require('../config/db')();
  const { ADMIN_NAME = 'Site Admin', ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (8+ chars) in env');
  if (!(await User.findOne({ email: ADMIN_EMAIL.toLowerCase() }))) {
    await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, phone: '9000000000', password: ADMIN_PASSWORD, role: 'admin' });
    console.log('Admin created:', ADMIN_EMAIL);
  } else console.log('Admin already exists');

  if (!(await Brand.countDocuments())) await Brand.create({
    name: 'Wafewarcha Chai', tagline: 'Brew Your Business with Wafewarcha Chai',
    intro: 'Wafewarcha Chai is a sample brand profile for a modern Indian tea franchise. Replace this text from the admin panel when official information is available.',
    story: 'SAMPLE CONTENT: Wafewarcha Chai began with a simple idea - serve honest, freshly brewed chai in a warm, modern cafe. Edit this story from Manage Brand Information.',
    mission: 'To make authentic, high-quality chai accessible everywhere and help entrepreneurs build successful tea businesses.',
    vision: 'To become a trusted name in Indian tea cafes with a supportive franchise community.',
    values: ['Quality in every cup', 'Honesty and transparency', 'Entrepreneur success', 'Respect for tradition', 'Consistency across outlets'],
    whyChoose: ['Simple, proven cafe format', 'Training and onboarding support', 'Popular, easy-to-prepare menu', 'Transparent cost information', 'Dedicated franchise support team'],
    contactEmail: 'contact@example.com', contactPhone: '+91 00000 00000', address: 'Your business address here (editable placeholder)',
    mapEmbedUrl: '',
  });
  if (!(await FranchiseModel.countDocuments())) await FranchiseModel.insertMany([
    { name: 'Chai Kiosk (Sample)', description: 'Compact takeaway kiosk ideal for high-footfall spots like bus stands, offices and markets.', spaceRequired: '80 - 120 sq ft (sample)', features: ['Takeaway counter', 'Quick-serve menu', 'Low staffing needs'], benefits: ['Lower setup effort', 'Fast launch', 'Easy operations'], eligibility: ['Valid ID and address proof', 'Ability to arrange a suitable location', 'Passion for hospitality'] },
    { name: 'Chai Cafe (Sample)', description: 'Full cafe with seating, complete tea menu, snacks and a warm brand ambience.', spaceRequired: '250 - 400 sq ft (sample)', features: ['Seating area', 'Full menu', 'Branded interiors'], benefits: ['Higher customer dwell time', 'Wider menu', 'Strong brand presence'], eligibility: ['Valid ID and address proof', 'Commercial space on rent or owned', 'Ability to manage staff'] },
    { name: 'Premium Chai Lounge (Sample)', description: 'Large-format lounge with premium interiors, events corner and extended menu.', spaceRequired: '600+ sq ft (sample)', features: ['Premium interiors', 'Events corner', 'Extended food menu'], benefits: ['Premium positioning', 'Group & event business', 'Maximum menu reach'], eligibility: ['Prior business or F&B experience preferred', 'Prime commercial location', 'Financial documents for verification'] },
  ]);
  if (!(await Investment.countDocuments())) await Investment.insertMany([
    { title: 'Initial Investment', category: 'Initial Investment', amount: 300000, note: 'Illustrative estimate', order: 1 },
    { title: 'Franchise Fee', category: 'Franchise Fee', amount: 200000, note: 'Illustrative estimate', order: 2 },
    { title: 'Interior & Setup', category: 'Interior & Setup', amount: 400000, note: 'Illustrative estimate', order: 3 },
    { title: 'Equipment', category: 'Equipment', amount: 250000, note: 'Illustrative estimate', order: 4 },
    { title: 'Furniture', category: 'Furniture', amount: 150000, note: 'Illustrative estimate', order: 5 },
    { title: 'Licences & Other Expenses', category: 'Other Expenses', amount: 100000, note: 'Illustrative estimate', order: 6 },
  ]);
  if (!(await OperatingCost.countDocuments())) await OperatingCost.insertMany([
    { item: 'Monthly Rent', monthlyAmount: 40000, order: 1 }, { item: 'Employee Salaries', monthlyAmount: 60000, order: 2 },
    { item: 'Raw Materials', monthlyAmount: 70000, order: 3 }, { item: 'Electricity & Utilities', monthlyAmount: 12000, order: 4 },
    { item: 'Maintenance', monthlyAmount: 6000, order: 5 }, { item: 'Marketing', monthlyAmount: 10000, order: 6 },
    { item: 'Other Operating Expenses', monthlyAmount: 7000, order: 7 },
  ].map((c) => ({ ...c, note: 'Illustrative estimate' })));
  if (!(await Product.countDocuments())) await Product.insertMany([
    { name: 'Classic Masala Chai', description: 'Strong tea simmered with milk and freshly crushed spices.', category: 'Special Chai', price: 30, image: I.tea },
    { name: 'Kadak Cutting Chai', description: 'Bold, half-glass chai for a quick refreshing break.', category: 'Tea Varieties', price: 15, image: I.cups },
    { name: 'Ginger Elaichi Chai', description: 'Warm ginger and cardamom brewed with a fragrant tea base.', category: 'Special Chai', price: 35, image: I.pour },
    { name: 'Green Tea', description: 'Light and soothing green tea, served hot.', category: 'Tea Varieties', price: 40, image: I.tea2 },
    { name: 'Iced Lemon Tea', description: 'Chilled tea with fresh lemon and a hint of mint.', category: 'Cold Beverages', price: 70, image: I.iced },
    { name: 'Cold Coffee', description: 'Creamy blended cold coffee topped with froth.', category: 'Cold Beverages', price: 90, image: I.latte },
    { name: 'Samosa (2 pcs)', description: 'Crisp pastry stuffed with spiced potato, served with chutney.', category: 'Snacks', price: 30, image: I.snack },
    { name: 'Veg Sandwich', description: 'Grilled sandwich with fresh vegetables and green chutney.', category: 'Food Items', price: 60, image: I.coffee, available: false },
  ]);
  if (!(await FranchiseProcess.countDocuments())) await FranchiseProcess.insertMany([
    ['Explore Franchise Opportunities', 'Browse the available franchise models and find the one that suits your space and goals.'],
    ['Understand Investment Requirements', 'Review the investment and operating cost breakdown to plan your budget.'],
    ['Submit Franchise Enquiry', 'Register, log in and submit your enquiry to receive a unique reference number.'],
    ['Admin Reviews the Enquiry', 'Our team reviews your enquiry and updates its status in your dashboard.'],
    ['Initial Communication and Discussion', 'We contact you to discuss your plans, location and expectations.'],
    ['Documentation and Verification', 'Submit the required documents for verification.'],
    ['Agreement and Approval', 'Sign the franchise agreement once approval is complete.'],
    ['Setup and Training', 'Interior setup, equipment installation and staff training.'],
    ['Franchise Launch', 'Open your doors and start serving Wafewarcha Chai.'],
  ].map(([title, description], i) => ({ stepNumber: i + 1, title, description })));
  if (!(await Gallery.countDocuments())) await Gallery.insertMany([
    { title: 'Warm cafe ambience', imageUrl: I.cafe, category: 'Cafe Interiors' },
    { title: 'Modern seating', imageUrl: I.cafe2, category: 'Cafe Interiors' },
    { title: 'Interior design', imageUrl: I.interior, category: 'Cafe Interiors' },
    { title: 'Pouring fresh chai', imageUrl: I.pour, category: 'Tea Preparation' },
    { title: 'Tea brewing', imageUrl: I.tea2, category: 'Tea Preparation' },
    { title: 'Signature chai', imageUrl: I.tea, category: 'Products' },
    { title: 'Cold beverages', imageUrl: I.iced, category: 'Products' },
    { title: 'Chai cups', imageUrl: I.cups, category: 'Franchise' },
    { title: 'Cafe counter', imageUrl: I.latte, category: 'Franchise' },
  ]);
  console.log('Seed complete');
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
