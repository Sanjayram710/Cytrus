import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning Existing Database ---');
  await prisma.couponUsage.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.heroSlide.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();

  console.log('--- Seeding Users & Admin ---');
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const userPassword = await bcrypt.hash('Customer@123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'LUXEWEAR Admin',
      email: 'admin@luxewear.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    },
  });

  const customersData = [
    { name: 'Aarya Sharma', email: 'aarya.sharma@example.com' },
    { name: 'Ananya Roy', email: 'ananya.roy@example.com' },
    { name: 'Diya Kapoor', email: 'diya.kapoor@example.com' },
    { name: 'Isha Verma', email: 'isha.verma@example.com' },
    { name: 'Kiara Mehta', email: 'kiara.mehta@example.com' },
    { name: 'Meera Nair', email: 'meera.nair@example.com' },
    { name: 'Natasha Malhotra', email: 'natasha.m@example.com' },
    { name: 'Pooja Reddy', email: 'pooja.reddy@example.com' },
    { name: 'Riya Sengupta', email: 'riya.s@example.com' },
    { name: 'Sneha Bose', email: 'sneha.bose@example.com' },
    { name: 'Tara Joshi', email: 'tara.joshi@example.com' },
    { name: 'Vanya Saxena', email: 'vanya.s@example.com' },
    { name: 'Zoya Patel', email: 'zoya.patel@example.com' },
    { name: 'Aditya Singhania', email: 'aditya.s@example.com' },
    { name: 'Kabir Oberoi', email: 'kabir.o@example.com' },
    { name: 'Rohan Khanna', email: 'rohan.khanna@example.com' },
    { name: 'Siddharth Rao', email: 'siddharth.r@example.com' },
    { name: 'Vikramaditya Shah', email: 'vikram.shah@example.com' },
    { name: 'Yash Gupta', email: 'yash.gupta@example.com' },
    { name: 'Zaid Merchant', email: 'zaid.m@example.com' },
  ];

  const createdCustomers = [];
  for (const c of customersData) {
    const cust = await prisma.user.create({
      data: {
        name: c.name,
        email: c.email,
        password: userPassword,
        role: 'USER',
        phone: `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
      },
    });
    createdCustomers.push(cust);
  }

  // Create sample default address for first customer
  const firstAddress = await prisma.address.create({
    data: {
      userId: createdCustomers[0].id,
      fullName: createdCustomers[0].name,
      phone: createdCustomers[0].phone || '+91 9988776655',
      street: '45 Marine Drive, Penthouse 8B',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400020',
      country: 'India',
      isDefault: true,
    },
  });

  console.log('--- Seeding Categories ---');
  const categoriesData = [
    {
      name: 'Dresses',
      slug: 'dresses',
      description: 'Handcrafted evening gowns, cocktail silhouettes, and bespoke silk dresses.',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Sarees',
      slug: 'sarees',
      description: 'Authentic Banarasi silk, Kanjeevaram weaves, and contemporary organza drape sarees.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Kurtis',
      slug: 'kurtis',
      description: 'Elegant embroidered tunics, flared Anarkalis, and refined everyday ethnic drapes.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Shirts',
      slug: 'shirts',
      description: 'Tailored Egyptian cotton shirts and fluid silk button-downs for timeless sophistication.',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Tops',
      slug: 'tops',
      description: 'Modern luxury blouses, corset drapes, and structured minimal tops.',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Ethnic Wear',
      slug: 'ethnic-wear',
      description: 'Royal bridal lehengas, intricately embroidered sherwanis, and festive couture.',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Party Wear',
      slug: 'party-wear',
      description: 'Sequined midi dresses, velvet jackets, and head-turning gala attire.',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Casual Wear',
      slug: 'casual-wear',
      description: 'Effortless cashmere knits, relaxed linen resortwear, and minimal daily luxury.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
  ];

  const createdCategories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = created;
  }

  console.log('--- Seeding Collections ---');
  const collectionsData = [
    {
      name: 'Silk Symphony',
      slug: 'silk-symphony',
      description: 'Pure mulberry silk gowns crafted with liquid sheen and minimalist French tailoring.',
      image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=1200',
      isFeatured: true,
    },
    {
      name: 'Royal Velvet',
      slug: 'royal-velvet',
      description: 'Deep jewel-toned plush velvet blazers, capes, and winter evening drapes.',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200',
      isFeatured: true,
    },
    {
      name: 'Midnight Elegance',
      slug: 'midnight-elegance',
      description: 'Gothic-glam black lace, obsidian sequins, and dramatic nocturnal eveningwear.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
      isFeatured: true,
    },
    {
      name: 'Summer Linen',
      slug: 'summer-linen',
      description: 'Bespoke breathable Italian linen resort ensembles for coastal getaways.',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200',
      isFeatured: true,
    },
    {
      name: 'Haute Couture',
      slug: 'haute-couture',
      description: 'Limited edition runway masterpieces with hand-strung crystals and golden zari work.',
      image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&q=80&w=1200',
      isFeatured: true,
    },
  ];

  const createdCollections: Record<string, any> = {};
  for (const col of collectionsData) {
    const created = await prisma.collection.create({ data: col });
    createdCollections[col.slug] = created;
  }

  console.log('--- Seeding Exactly 5 Hero Slides ---');
  const heroSlidesData = [
    {
      title: 'THE AUTUMN SILK COLLECTION',
      subtitle: 'HAUTE COUTURE 2026',
      description: 'Discover handcrafted pure mulberry silk gowns featuring effortless drapes and modern architectural cuts.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1920',
      mobileImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
      buttonText: 'EXPLORE COLLECTION',
      buttonUrl: '/collection/silk-symphony',
      displayOrder: 1,
      isActive: true,
    },
    {
      title: 'MIDNIGHT COCKTAIL EDITION',
      subtitle: 'ROYAL EVENINGWEAR',
      description: 'Exquisite velvet blazers, floor-sweeping noir dresses, and crystal-embellished accessories.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1920',
      mobileImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
      buttonText: 'SHOP MIDNIGHT',
      buttonUrl: '/collection/midnight-elegance',
      displayOrder: 2,
      isActive: true,
    },
    {
      title: 'ROYAL VELVET STATEMENT',
      subtitle: 'LIMITED RUNWAY PIECES',
      description: 'Rich deep emerald and crimson velvet drapes tailored to flawless luxury perfection.',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1920',
      mobileImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
      buttonText: 'DISCOVER VELVET',
      buttonUrl: '/collection/royal-velvet',
      displayOrder: 3,
      isActive: true,
    },
    {
      title: 'SUMMER RESORT LINEN',
      subtitle: 'EDITORIAL ESSENTIALS',
      description: 'Lightweight linen gowns, breezy ivory kaftans, and relaxed tailoring for high-sun retreats.',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1920',
      mobileImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800',
      buttonText: 'SHOP RESORTWEAR',
      buttonUrl: '/collection/summer-linen',
      displayOrder: 4,
      isActive: true,
    },
    {
      title: 'HANDCRAFTED HERITAGE WEAVES',
      subtitle: 'BESPOKE ETHNIC COUTURE',
      description: 'Intricate gold zari brocades, hand-woven Banarasi silk sarees, and royal wedding lehengas.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1920',
      mobileImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
      buttonText: 'EXPLORE HERITAGE',
      buttonUrl: '/category/sarees',
      displayOrder: 5,
      isActive: true,
    },
  ];

  for (const slide of heroSlidesData) {
    await prisma.heroSlide.create({ data: slide });
  }

  console.log('--- Seeding 32 Luxury Products ---');
  const productsMaster = [
    // DRESSES (1-6)
    {
      name: 'Aurelia Emerald Silk Evening Gown',
      slug: 'aurelia-emerald-silk-gown',
      description: 'Crafted from pure 100% mulberry silk in a captivating deep emerald hue. Features an asymmetric draped neckline, side thigh slit, and fluid floor-sweeping train.',
      price: 28500,
      comparePrice: 35000,
      categorySlug: 'dresses',
      collectionSlug: 'silk-symphony',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'LUX-DR-001',
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Emerald Green', hex: '#004B49' }, { name: 'Obsidian Black', hex: '#121212' }],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    {
      name: 'Celeste Crimson Slip Midi Dress',
      slug: 'celeste-crimson-slip-dress',
      description: 'Minimalist biased-cut silk slip dress in vibrant ruby crimson. Designed with delicate cowl neck detailing and crossover thin shoulder straps.',
      price: 18900,
      comparePrice: 22000,
      categorySlug: 'dresses',
      collectionSlug: 'silk-symphony',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      sku: 'LUX-DR-002',
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Crimson Red', hex: '#990000' }, { name: 'Champagne Gold', hex: '#D4AF37' }],
      sizes: ['S', 'M', 'L'],
    },
    {
      name: 'Nocturne Sequin Velvet Cocktail Dress',
      slug: 'nocturne-sequin-velvet-dress',
      description: 'Plush midnight black velvet adorned with micro glass sequins that shimmer with motion. Features long fitted sleeves and a square open back.',
      price: 32000,
      comparePrice: 39000,
      categorySlug: 'dresses',
      collectionSlug: 'midnight-elegance',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      sku: 'LUX-DR-003',
      images: [
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Obsidian Black', hex: '#121212' }, { name: 'Midnight Navy', hex: '#0B192C' }],
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      name: 'Isla Pleated Chiffon Maxi Dress',
      slug: 'isla-pleated-chiffon-maxi',
      description: 'Floaty sunburst pleated chiffon dress in soft alabaster white. Elasticated waist contouring with an ethereal neck tie ribbon.',
      price: 24500,
      comparePrice: 28000,
      categorySlug: 'dresses',
      collectionSlug: 'summer-linen',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      sku: 'LUX-DR-004',
      images: [
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Pearl White', hex: '#FFFFFF' }, { name: 'Soft Beige', hex: '#F2EDE4' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Valerie Off-Shoulder Satin Column Gown',
      slug: 'valerie-off-shoulder-gown',
      description: 'Architectural duchess satin column silhouette featuring a sculpted fold-over bardot neckline and internal corsetry support.',
      price: 45000,
      comparePrice: 52000,
      categorySlug: 'dresses',
      collectionSlug: 'haute-couture',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      sku: 'LUX-DR-005',
      images: [
        'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Midnight Navy', hex: '#0B192C' }, { name: 'Emerald Green', hex: '#004B49' }],
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      name: 'Lumiere Crystal Embellished Mesh Mini',
      slug: 'lumiere-crystal-mesh-mini',
      description: 'High-impact cocktail mini dress constructed from sheer nude mesh lined with stretch crepe and over-embroidered with Swarovski crystal rain.',
      price: 36000,
      comparePrice: 42000,
      categorySlug: 'party-wear',
      collectionSlug: 'midnight-elegance',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      sku: 'LUX-PW-006',
      images: [
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Crystal Silver', hex: '#C0C0C0' }, { name: 'Champagne Gold', hex: '#D4AF37' }],
      sizes: ['XS', 'S', 'M'],
    },

    // SAREES (7-11)
    {
      name: 'Royal Heritage Kanjeevaram Silk Saree',
      slug: 'royal-heritage-kanjeevaram-saree',
      description: 'Handwoven in Kanchipuram using pure gold zari threads. Crimson red body adorned with antique temple motifs and a contrast royal blue rich pallu.',
      price: 68000,
      comparePrice: 85000,
      categorySlug: 'sarees',
      collectionSlug: 'haute-couture',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'LUX-SA-007',
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Crimson & Royal Blue', hex: '#990000' }],
      sizes: ['Free Size'],
    },
    {
      name: 'Elysian Handloom Banarasi Organza Saree',
      slug: 'elysian-banarasi-organza-saree',
      description: 'Ethereal tissue organza drape in delicate pastel lavender with silver kadwa zari floral boti motifs and scallop hand-finished edges.',
      price: 34000,
      comparePrice: 40000,
      categorySlug: 'sarees',
      collectionSlug: 'silk-symphony',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      sku: 'LUX-SA-008',
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Pastel Lavender', hex: '#E6E6FA' }, { name: 'Blush Pink', hex: '#FFB6C1' }],
      sizes: ['Free Size'],
    },
    {
      name: 'Nizam Emerald Chanderi Silk Saree',
      slug: 'nizam-emerald-chanderi-saree',
      description: 'Lightweight handloom Chanderi silk saree with hand-painted Pichwai botanical motifs and fine gold border work.',
      price: 26500,
      comparePrice: 31000,
      categorySlug: 'sarees',
      collectionSlug: 'royal-velvet',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      sku: 'LUX-SA-009',
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Emerald Green', hex: '#004B49' }],
      sizes: ['Free Size'],
    },
    {
      name: 'Noor Satin Draped Pre-Stitched Saree',
      slug: 'noor-satin-draped-saree',
      description: 'Modern pre-draped liquid satin saree featuring a pre-pleated skirt structure paired with a fully crystal embroidered corset blouse.',
      price: 42000,
      comparePrice: 49000,
      categorySlug: 'sarees',
      collectionSlug: 'midnight-elegance',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'LUX-SA-010',
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Obsidian Black', hex: '#121212' }, { name: 'Ruby Wine', hex: '#722F37' }],
      sizes: ['S', 'M', 'L'],
    },

    // KURTIS & ETHNIC (11-16)
    {
      name: 'Zaria Chikankari Silk Anarkali Set',
      slug: 'zaria-chikankari-anarkali-set',
      description: 'Full-flared chanderi silk Anarkali kurta featuring authentic Lucknow hand-embroidered shadow Chikankari, pearl drops, and matching dupatta.',
      price: 29500,
      comparePrice: 36000,
      categorySlug: 'kurtis',
      collectionSlug: 'silk-symphony',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'LUX-KU-011',
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Ivory White', hex: '#FFFFF0' }, { name: 'Powder Blue', hex: '#B0E0E6' }],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      name: 'Maharani Velvet Embroidered Kurta Set',
      slug: 'maharani-velvet-kurta-set',
      description: 'Deep plum micro-velvet straight kurta set accented with zardozi dabka embroidery, paired with cigarette pants and tissue organza dupatta.',
      price: 38000,
      comparePrice: 45000,
      categorySlug: 'ethnic-wear',
      collectionSlug: 'royal-velvet',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      sku: 'LUX-EW-012',
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Plum Velvet', hex: '#4A0E17' }, { name: 'Bottle Green', hex: '#003319' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Sultana Silk Lehenga Ensemble',
      slug: 'sultana-silk-lehenga-ensemble',
      description: 'Heavy Raw Silk bridal lehenga set adorned with vintage Marodi handwork, gold thread motifs, and dual net embroidered dupattas.',
      price: 125000,
      comparePrice: 150000,
      categorySlug: 'ethnic-wear',
      collectionSlug: 'haute-couture',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'LUX-EW-013',
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Royal Crimson', hex: '#800020' }],
      sizes: ['S', 'M', 'L'],
    },
    {
      name: 'Gulnar Printed Chiffon Sharara Set',
      slug: 'gulnar-chiffon-sharara-set',
      description: 'Pastel rose botanical print chiffon short kurta paired with multi-tiered flared sharara pants and mirror work lace trims.',
      price: 21000,
      comparePrice: 25000,
      categorySlug: 'kurtis',
      collectionSlug: 'summer-linen',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      sku: 'LUX-KU-014',
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Dusty Rose', hex: '#DCAE96' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },

    // SHIRTS & TOPS (15-22)
    {
      name: 'Monaco Pure Linen Oversized Shirt',
      slug: 'monaco-pure-linen-shirt',
      description: 'Pre-washed 100% French linen longline shirt featuring Mother of Pearl buttons, relaxed drop shoulders, and chest patch pocket.',
      price: 11500,
      comparePrice: 14000,
      categorySlug: 'shirts',
      collectionSlug: 'summer-linen',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'LUX-SH-015',
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Optic White', hex: '#FFFFFF' }, { name: 'Oatmeal Beige', hex: '#E6D7C3' }],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    {
      name: 'Atelier Mulberry Silk Blouse',
      slug: 'atelier-mulberry-silk-blouse',
      description: 'Fluid heavyweight silk crepe de chine blouse with a draped ascot pussy-bow neck collar and french barrel cuffs.',
      price: 16500,
      comparePrice: 19500,
      categorySlug: 'tops',
      collectionSlug: 'silk-symphony',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      sku: 'LUX-TP-016',
      images: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Champagne Gold', hex: '#D4AF37' }, { name: 'Ivory White', hex: '#FFFFF0' }],
      sizes: ['S', 'M', 'L'],
    },
    {
      name: 'Corset Tailored Cotton Poplin Shirt',
      slug: 'corset-tailored-poplin-shirt',
      description: 'Structured crisp 200s Egyptian cotton poplin shirt featuring integrated waist cinching corset seamwork and concealed front placket.',
      price: 13800,
      comparePrice: 16000,
      categorySlug: 'shirts',
      collectionSlug: 'summer-linen',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      sku: 'LUX-SH-017',
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'French Blue', hex: '#4682B4' }, { name: 'Optic White', hex: '#FFFFFF' }],
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      name: 'Solene Draped Asymmetric Satin Top',
      slug: 'solene-draped-satin-top',
      description: 'One-shoulder heavy liquid satin drape top styled with a dramatic waterfall sash falling down the hip line.',
      price: 14500,
      comparePrice: 17500,
      categorySlug: 'tops',
      collectionSlug: 'midnight-elegance',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      sku: 'LUX-TP-018',
      images: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Obsidian Black', hex: '#121212' }, { name: 'Ruby Wine', hex: '#722F37' }],
      sizes: ['XS', 'S', 'M', 'L'],
    },

    // CASUAL WEAR & KNITS (19-24)
    {
      name: 'Geneva Pure Cashmere Knit Sweater',
      slug: 'geneva-cashmere-knit-sweater',
      description: 'Ultra-soft 100% 2-ply Mongolian cashmere crewneck jumper styled with ribbed trims and subtle shoulder drop seams.',
      price: 22000,
      comparePrice: 26000,
      categorySlug: 'casual-wear',
      collectionSlug: 'summer-linen',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      sku: 'LUX-CW-019',
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Camel Tan', hex: '#C19A6B' }, { name: 'Charcoal Grey', hex: '#36454F' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Capri Linen Wide-Leg Trousers',
      slug: 'capri-linen-wide-leg-trousers',
      description: 'High-waisted Italian linen tailored pants featuring double front pleats, side slash pockets, and wide sweeping hemline.',
      price: 12900,
      comparePrice: 15500,
      categorySlug: 'casual-wear',
      collectionSlug: 'summer-linen',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'LUX-CW-020',
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Ecru Linen', hex: '#FAF0E6' }, { name: 'Olive Green', hex: '#556B2F' }],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },

    // PARTY WEAR & JACKETS (21-30)
    {
      name: 'Verona Velvet Tuxedo Blazer',
      slug: 'verona-velvet-tuxedo-blazer',
      description: 'Single-breasted cotton velvet smoking blazer detailed with black silk satin peak lapels and padded structured shoulders.',
      price: 28000,
      comparePrice: 34000,
      categorySlug: 'party-wear',
      collectionSlug: 'royal-velvet',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'LUX-PW-021',
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Midnight Blue Velvet', hex: '#191970' }, { name: 'Deep Burgundy', hex: '#800020' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Astral Metallic Jacquard Trench Coat',
      slug: 'astral-metallic-jacquard-trench',
      description: 'Double-breasted statement trench coat tailored in French brocade jacquard weave lined with silk cupro.',
      price: 49000,
      comparePrice: 58000,
      categorySlug: 'party-wear',
      collectionSlug: 'haute-couture',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: false,
      sku: 'LUX-PW-022',
      images: [
        'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Antique Gold Jacquard', hex: '#B8860B' }],
      sizes: ['S', 'M', 'L'],
    },
    {
      name: 'Ophelia Floral Organza Tiered Gown',
      slug: 'ophelia-floral-organza-gown',
      description: 'Ethereal multi-layered silk organza gown hand-printed with impressionist water-color floral motifs.',
      price: 39500,
      comparePrice: 46000,
      categorySlug: 'dresses',
      collectionSlug: 'haute-couture',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      sku: 'LUX-DR-023',
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Pastel Garden', hex: '#FFF0F5' }],
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      name: 'Serena Pearl Embellished Silk Camisole',
      slug: 'serena-pearl-silk-camisole',
      description: 'Luxury bias-cut silk camisole top adorned with hand-strung freshwater seed pearls along the delicate neckline.',
      price: 11900,
      comparePrice: 14500,
      categorySlug: 'tops',
      collectionSlug: 'silk-symphony',
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: true,
      sku: 'LUX-TP-024',
      images: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Pearl White', hex: '#FFFFFF' }, { name: 'Midnight Black', hex: '#121212' }],
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      name: 'Calypso Cut-Out Back Satin Midi Dress',
      slug: 'calypso-cutout-satin-midi',
      description: 'Sleek high-neck midi dress featuring geometric waist side cut-outs and a dramatic open back with fine criss-cross ties.',
      price: 21500,
      comparePrice: 26000,
      categorySlug: 'dresses',
      collectionSlug: 'midnight-elegance',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      sku: 'LUX-DR-025',
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Burnt Bronze', hex: '#8C6239' }, { name: 'Obsidian Black', hex: '#121212' }],
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      name: 'Florence Double-Breasted Linen Blazer',
      slug: 'florence-linen-blazer',
      description: 'Tailored relaxed blazer crafted in heavy European flax linen with horn buttons and fully unlined breathable construction.',
      price: 17800,
      comparePrice: 21000,
      categorySlug: 'casual-wear',
      collectionSlug: 'summer-linen',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'LUX-CW-026',
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Sand Beige', hex: '#E2D4B7' }, { name: 'Pure White', hex: '#FFFFFF' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Rhea Hand-Embroidered Zardozi Crop Top',
      slug: 'rhea-zardozi-crop-top',
      description: 'Raw silk cropped bustier intricately encrusted with zardozi threadwork, bullion wire, and matte beads.',
      price: 15900,
      comparePrice: 18500,
      categorySlug: 'ethnic-wear',
      collectionSlug: 'haute-couture',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      sku: 'LUX-EW-027',
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Antique Gold', hex: '#D4AF37' }],
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      name: 'Helena Metallic Lamé Pleated Gown',
      slug: 'helena-lame-pleated-gown',
      description: 'Liquid gold sunray pleated floor-length gown featuring a plunging v-neckline and waist buckle detail.',
      price: 41000,
      comparePrice: 48000,
      categorySlug: 'party-wear',
      collectionSlug: 'haute-couture',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'LUX-PW-028',
      images: [
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Liquid Gold', hex: '#FFD700' }],
      sizes: ['S', 'M', 'L'],
    },
    {
      name: 'Anya Silk Crepe Wrap Dress',
      slug: 'anya-silk-wrap-dress',
      description: 'Timeless wrap silhouette in fluid silk crepe de chine with flutter elbow sleeves and a self-tie sash waist.',
      price: 19800,
      comparePrice: 23000,
      categorySlug: 'dresses',
      collectionSlug: 'silk-symphony',
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: true,
      sku: 'LUX-DR-029',
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Sapphire Navy', hex: '#0F2C59' }, { name: 'Emerald Green', hex: '#004B49' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Zara Embroidered Georgette Tunic',
      slug: 'zara-georgette-tunic',
      description: 'Flowing lightweight georgette tunic styled with mirror-work hand embroidery along the split mandarin collar.',
      price: 14200,
      comparePrice: 16800,
      categorySlug: 'kurtis',
      collectionSlug: 'summer-linen',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      sku: 'LUX-KU-030',
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Peach Coral', hex: '#F08080' }],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      name: 'Cynthia Structured Peplum Silk Top',
      slug: 'cynthia-peplum-silk-top',
      description: 'Bespoke duchess silk peplum top featuring tailored bust darts, concealed side zip, and flared hem waistline.',
      price: 16800,
      comparePrice: 19500,
      categorySlug: 'tops',
      collectionSlug: 'silk-symphony',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      sku: 'LUX-TP-031',
      images: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Ivory Cream', hex: '#FFFDD0' }],
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      name: 'Bespoke Velvet Cape Jacket',
      slug: 'bespoke-velvet-cape-jacket',
      description: 'Statement floor-length velvet cape coat embroidered with metallic gold bullion thread along the collar and edges.',
      price: 46000,
      comparePrice: 55000,
      categorySlug: 'party-wear',
      collectionSlug: 'royal-velvet',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'LUX-PW-032',
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Royal Emerald', hex: '#004B49' }, { name: 'Deep Crimson', hex: '#800020' }],
      sizes: ['Free Size'],
    },
  ];

  const createdProducts = [];
  for (const p of productsMaster) {
    const category = createdCategories[p.categorySlug];
    const collection = p.collectionSlug ? createdCollections[p.collectionSlug] : null;

    const prod = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        comparePrice: p.comparePrice,
        sku: p.sku,
        stock: 12,
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        isBestSeller: p.isBestSeller,
        status: 'ACTIVE',
        categoryId: category.id,
        collectionId: collection?.id,
        images: {
          create: p.images.map((url, idx) => ({
            url,
            alt: `${p.name} view ${idx + 1}`,
            isPrimary: idx === 0,
            displayOrder: idx,
          })),
        },
        variants: {
          create: p.sizes.flatMap((size) =>
            p.colors.map((color) => ({
              size,
              color: color.name,
              colorHex: color.hex,
              sku: `${p.sku}-${size}-${color.name.slice(0, 3).toUpperCase()}`,
              stock: Math.floor(4 + Math.random() * 8),
              price: p.price,
            }))
          ),
        },
      },
    });

    createdProducts.push(prod);

    // Create inventory record
    await prisma.inventory.create({
      data: {
        productId: prod.id,
        stock: 12,
        lowStockThreshold: 5,
      },
    });
  }

  console.log('--- Seeding Coupons ---');
  await prisma.coupon.createMany({
    data: [
      {
        code: 'LUXE10',
        type: 'PERCENTAGE',
        value: 10,
        minSpend: 5000,
        maxDiscount: 5000,
        usageLimit: 500,
        isActive: true,
      },
      {
        code: 'ELEGANCE20',
        type: 'PERCENTAGE',
        value: 20,
        minSpend: 20000,
        maxDiscount: 10000,
        usageLimit: 200,
        isActive: true,
      },
      {
        code: 'WELCOME500',
        type: 'FIXED',
        value: 500,
        minSpend: 2000,
        usageLimit: 1000,
        isActive: true,
      },
    ],
  });

  console.log('--- Seeding Customer Reviews ---');
  const reviewComments = [
    { title: 'Exquisite Craftsmanship!', rating: 5, text: 'The silk fabric is breathtaking and feels so soft against the skin. Fits like a glove!' },
    { title: 'Pure Luxury', rating: 5, text: 'Arrived packaged in a beautiful luxury box. Wore it to a wedding reception and received endless compliments.' },
    { title: 'Stunning Fit & Quality', rating: 5, text: 'The color is exact to the photographs. Excellent stitching and premium finish.' },
    { title: 'Worth Every Rupee', rating: 4, text: 'Fast delivery, beautiful silhouette. Slightly long for my height but easily hemmed.' },
  ];

  for (let i = 0; i < 15; i++) {
    const randomProduct = createdProducts[i % createdProducts.length];
    const randomCustomer = createdCustomers[i % createdCustomers.length];
    const rev = reviewComments[i % reviewComments.length];

    await prisma.review.create({
      data: {
        productId: randomProduct.id,
        userId: randomCustomer.id,
        userName: randomCustomer.name,
        rating: rev.rating,
        title: rev.title,
        comment: rev.text,
        isVerified: true,
        isApproved: true,
      },
    });
  }

  console.log('--- Seeding Sample Orders ---');
  const sampleOrderStatuses = ['DELIVERED', 'SHIPPED', 'PROCESSING', 'CONFIRMED'];
  for (let i = 0; i < 8; i++) {
    const cust = createdCustomers[i];
    const prod = createdProducts[i * 2];
    const orderNum = `LXW-2026-${1000 + i}`;
    const status = sampleOrderStatuses[i % sampleOrderStatuses.length];

    const order = await prisma.order.create({
      data: {
        orderNumber: orderNum,
        userId: cust.id,
        customerName: cust.name,
        customerEmail: cust.email,
        customerPhone: cust.phone || '+91 9876543210',
        shippingAddressJson: JSON.stringify({
          fullName: cust.name,
          phone: cust.phone || '+91 9876543210',
          street: '12 Luxury Boulevard, Flat 402',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400001',
          country: 'India',
        }),
        subtotal: prod.price,
        discount: 0,
        shippingFee: 0,
        tax: prod.price * 0.12,
        total: prod.price * 1.12,
        paymentMethod: i % 2 === 0 ? 'RAZORPAY' : 'COD',
        paymentStatus: i % 2 === 0 || status === 'DELIVERED' ? 'PAID' : 'PENDING',
        orderStatus: status,
        courierName: status === 'SHIPPED' || status === 'DELIVERED' ? 'BlueDart Express' : null,
        trackingNumber: status === 'SHIPPED' || status === 'DELIVERED' ? `BD${88273619 + i}` : null,
        items: {
          create: [
            {
              productId: prod.id,
              productName: prod.name,
              productImage: prod.slug,
              size: 'M',
              color: 'Emerald Green',
              quantity: 1,
              price: prod.price,
              total: prod.price,
            },
          ],
        },
        statusHistory: {
          create: [
            { status: 'CONFIRMED', notes: 'Order placed successfully' },
            ...(status !== 'CONFIRMED' ? [{ status, notes: `Order updated to ${status}` }] : []),
          ],
        },
      },
    });
  }

  console.log('--- Seeding Newsletter Subscribers ---');
  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: 'vip.fashionista@example.com' },
      { email: 'couture.collector@example.com' },
      { email: 'style.curator@example.com' },
    ],
  });

  console.log('✅ LUXEWEAR Database Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
