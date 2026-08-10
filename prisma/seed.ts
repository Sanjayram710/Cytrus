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
      name: 'CYTRUS Admin',
      email: 'admin@cytrus.com',
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
    { name: 'Aditya Singhania', email: 'aditya.s@example.com' },
    { name: 'Kabir Oberoi', email: 'kabir.o@example.com' },
    { name: 'Rohan Khanna', email: 'rohan.khanna@example.com' },
    { name: 'Siddharth Rao', email: 'siddharth.r@example.com' },
    { name: 'Vikramaditya Shah', email: 'vikram.shah@example.com' },
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

  console.log('--- Seeding T-Shirt Categories ---');
  const categoriesData = [
    {
      name: 'Oversized Tees',
      slug: 'oversized-tees',
      description: '280 GSM Heavyweight French Terry cotton featuring boxy drop-shoulder streetwear cuts.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Graphic Tees',
      slug: 'graphic-tees',
      description: 'High-density puff-printed and vintage screen-printed artistic statement t-shirts.',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Minimalist Embroidered',
      slug: 'minimalist-embroidered',
      description: 'Subtle micro-embroidery logos on 240 GSM organic combed cotton t-shirts.',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Vintage Wash Tees',
      slug: 'vintage-wash-tees',
      description: 'Acid-washed, stone-washed, and garment-dyed distressed luxury t-shirts.',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Pima Cotton Essentials',
      slug: 'pima-cotton-essentials',
      description: 'Ultra-soft 100% Supima and Peruvian Pima cotton classic fit t-shirts.',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Drop-Shoulder Boxy',
      slug: 'drop-shoulder-boxy',
      description: 'Relaxed wide-chest silhouettes tailored for contemporary streetwear comfort.',
      image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Polo & Henley Tees',
      slug: 'polo-henley-tees',
      description: 'Textured waffle-knit and ribbed collar luxury henleys and tailored polos.',
      image: 'https://images.unsplash.com/photo-1625910513413-3fc215c76e0b?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
    {
      name: 'Athleisure Performance',
      slug: 'athleisure-performance',
      description: 'Moisture-wicking bamboo cotton and ribbed stretch muscle-fit t-shirts.',
      image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=800',
      isFeatured: true,
    },
  ];

  const createdCategories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = created;
  }

  console.log('--- Seeding T-Shirt Collections ---');
  const collectionsData = [
    {
      name: 'Midnight Streetwear',
      slug: 'midnight-streetwear',
      description: 'Noir heavy-gsm oversized t-shirts with matte black hardware and industrial accents.',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1200',
      isFeatured: true,
    },
    {
      name: 'Acid Wash Edit',
      slug: 'acid-wash-edit',
      description: 'Hand-dyed mineral washed vintage tees with worn-in character and relaxed boxy cuts.',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1200',
      isFeatured: true,
    },
    {
      name: 'Heavyweight Graphic Series',
      slug: 'heavyweight-graphic-series',
      description: 'Art-gallery inspired back prints on 300 GSM combed cotton drop-shoulder tees.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200',
      isFeatured: true,
    },
    {
      name: 'Raw Pima Essentials',
      slug: 'raw-pima-essentials',
      description: 'Minimalist solid everyday t-shirts crafted from long-staple Peruvian Pima cotton.',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1200',
      isFeatured: true,
    },
    {
      name: 'Atelier Embroidery',
      slug: 'atelier-embroidery',
      description: 'High-density metallic thread and tonal embroidery accents on heavy cotton tees.',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200',
      isFeatured: true,
    },
  ];

  const createdCollections: Record<string, any> = {};
  for (const col of collectionsData) {
    const created = await prisma.collection.create({ data: col });
    createdCollections[col.slug] = created;
  }

  console.log('--- Seeding Exactly 5 T-Shirt Hero Slides ---');
  const heroSlidesData = [
    {
      title: '280 GSM HEAVYWEIGHT OVERSIZED TEES',
      subtitle: 'THE STREETWEAR DROP 2026',
      description: 'Discover thick French Terry organic cotton t-shirts featuring boxy drop-shoulder cuts and reinforced ribbed collar construction.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1920',
      mobileImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
      buttonText: 'SHOP OVERSIZED',
      buttonUrl: '/category/oversized-tees',
      displayOrder: 1,
      isActive: true,
    },
    {
      title: 'ACID WASHED VINTAGE SERIES',
      subtitle: 'MINERAL DYED CAPSULE',
      description: 'Hand-dyed mineral washed t-shirts with unique worn-in vintage fades and relaxed boxy silhouettes.',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1920',
      mobileImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
      buttonText: 'DISCOVER VINTAGE',
      buttonUrl: '/collection/acid-wash-edit',
      displayOrder: 2,
      isActive: true,
    },
    {
      title: 'HIGH-DENSITY GRAPHIC PRINTS',
      subtitle: 'ART GALLERY EDITION',
      description: 'Heavyweight 300 GSM cotton tees over-printed with textured puff ink graphics and back prints.',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1920',
      mobileImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800',
      buttonText: 'EXPLORE GRAPHICS',
      buttonUrl: '/category/graphic-tees',
      displayOrder: 3,
      isActive: true,
    },
    {
      title: 'RAW PERUVIAN PIMA COTTON',
      subtitle: 'ESSENTIAL DAILY COUTURE',
      description: 'Ultra-soft long-staple Pima cotton crewneck tees engineered for silky softness and non-shrink durability.',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1920',
      mobileImage: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800',
      buttonText: 'SHOP ESSENTIALS',
      buttonUrl: '/collection/raw-pima-essentials',
      displayOrder: 4,
      isActive: true,
    },
    {
      title: 'TONAL EMBROIDERED ATELIER TEES',
      subtitle: 'MINIMALIST LUXURY EMBROIDERIES',
      description: 'Micro chest logo embroideries using high-lustre metallic threads on dense combed cotton t-shirts.',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1920',
      mobileImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
      buttonText: 'SHOP EMBROIDERED',
      buttonUrl: '/category/minimalist-embroidered',
      displayOrder: 5,
      isActive: true,
    },
  ];

  for (const slide of heroSlidesData) {
    await prisma.heroSlide.create({ data: slide });
  }

  console.log('--- Seeding 11 Unique Luxury T-Shirt Products ---');
  const productsMaster = [
    {
      name: 'Monolith 280 GSM Heavyweight Oversized Tee',
      slug: 'monolith-280gsm-oversized-tee',
      description: 'Engineered from 280 GSM 100% organic French Terry cotton. Features an architectural boxy cut, dropped shoulders, and a thick 1.2-inch ribbed crewneck collar.',
      price: 3490,
      comparePrice: 4200,
      categorySlug: 'oversized-tees',
      collectionSlug: 'midnight-streetwear',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'TEE-OV-001',
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Obsidian Black', hex: '#121212' }, { name: 'Raw Off-White', hex: '#FDFBF7' }],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      name: 'Vanguard Boxy Drop-Shoulder Heavy Tee',
      slug: 'vanguard-boxy-heavy-tee',
      description: 'Pre-shrunk 260 GSM combed cotton t-shirt with seamless side construction and structured wide sleeves.',
      price: 2990,
      comparePrice: 3500,
      categorySlug: 'oversized-tees',
      collectionSlug: 'midnight-streetwear',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      sku: 'TEE-OV-002',
      images: [
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Washed Charcoal', hex: '#262529' }, { name: 'Forest Emerald', hex: '#004B49' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Nocturne Oversized Noir Streetwear Tee',
      slug: 'nocturne-oversized-noir-tee',
      description: 'Pitch black 300 GSM ultra-heavy cotton tee accented with matte rubberized hem label and reinforced double-needle seam stitching.',
      price: 3990,
      comparePrice: 4800,
      categorySlug: 'oversized-tees',
      collectionSlug: 'midnight-streetwear',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      sku: 'TEE-OV-003',
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Obsidian Black', hex: '#121212' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Cybernetic Renaissance Graphic Tee',
      slug: 'cybernetic-renaissance-graphic-tee',
      description: 'Art gallery back-print t-shirt featuring high-density 3D puff screen printing on 260 GSM combed cotton.',
      price: 3790,
      comparePrice: 4500,
      categorySlug: 'graphic-tees',
      collectionSlug: 'heavyweight-graphic-series',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'TEE-GR-004',
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Washed Grey', hex: '#36454F' }, { name: 'Optic White', hex: '#FFFFFF' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Atelier Mythos Vintage Graphic Tee',
      slug: 'atelier-mythos-vintage-graphic-tee',
      description: 'Hand-distressed graphic tee with cracked vintage screen print effect and enzyme stone wash finish.',
      price: 3290,
      comparePrice: 3990,
      categorySlug: 'graphic-tees',
      collectionSlug: 'heavyweight-graphic-series',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      sku: 'TEE-GR-005',
      images: [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Vintage Acid Wash', hex: '#4A4A4A' }],
      sizes: ['M', 'L', 'XL'],
    },
    {
      name: 'Acid Washed Mineral Slub Tee',
      slug: 'acid-washed-mineral-slub-tee',
      description: 'Individually mineral dyed 240 GSM slub cotton t-shirt with raw edge hem details and vintage worn finish.',
      price: 2890,
      comparePrice: 3400,
      categorySlug: 'vintage-wash-tees',
      collectionSlug: 'acid-wash-edit',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'TEE-VW-006',
      images: [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Acid Slate', hex: '#708090' }, { name: 'Acid Violet', hex: '#4B0082' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Maison Tonal Crest Embroidered Tee',
      slug: 'maison-tonal-crest-embroidered-tee',
      description: 'High-density micro chest embroidery in metallic thread on 240 GSM organic long-staple cotton.',
      price: 2690,
      comparePrice: 3200,
      categorySlug: 'minimalist-embroidered',
      collectionSlug: 'atelier-embroidery',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      sku: 'TEE-EM-007',
      images: [
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Sand Beige', hex: '#C19A6B' }, { name: 'Obsidian Black', hex: '#121212' }, { name: 'Cream White', hex: '#FFFDD0' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Supima Cotton Ultra-Soft Crewneck Tee',
      slug: 'supima-cotton-ultrasoft-crewneck',
      description: 'Crafted from 100% American Supima long-staple cotton for unmatched silkiness and shape retention after washing.',
      price: 2490,
      comparePrice: 2990,
      categorySlug: 'pima-cotton-essentials',
      collectionSlug: 'raw-pima-essentials',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'TEE-PM-008',
      images: [
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Optic White', hex: '#FFFFFF' }, { name: 'Navy Blue', hex: '#000080' }, { name: 'Heather Grey', hex: '#D3D3D3' }],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    {
      name: 'Waffle-Knit Heavy Cotton Henley Tee',
      slug: 'waffle-knit-heavy-henley-tee',
      description: 'Textured 300 GSM thermal waffle cotton henley tee styled with custom horn buttons and ribbed collar.',
      price: 3590,
      comparePrice: 4200,
      categorySlug: 'polo-henley-tees',
      collectionSlug: 'raw-pima-essentials',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      sku: 'TEE-HN-009',
      images: [
        'https://images.unsplash.com/photo-1625910513413-3fc215c76e0b?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Oatmeal Beige', hex: '#E6D7C3' }, { name: 'Obsidian Black', hex: '#121212' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Tailored Piqué Luxury Polo Tee',
      slug: 'tailored-pique-luxury-polo-tee',
      description: 'Heavy cotton piqué knit polo t-shirt with mother-of-pearl buttons and tailored muscle-fit sleeves.',
      price: 3890,
      comparePrice: 4600,
      categorySlug: 'polo-henley-tees',
      collectionSlug: 'atelier-embroidery',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: true,
      sku: 'TEE-PL-010',
      images: [
        'https://images.unsplash.com/photo-1625910513413-3fc215c76e0b?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'French Blue', hex: '#4682B4' }, { name: 'Optic White', hex: '#FFFFFF' }],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      name: 'Bamboo Ribbed Stretch Muscle Fit Tee',
      slug: 'bamboo-ribbed-stretch-muscle-tee',
      description: 'Breathable bamboo elastane blend athletic t-shirt with ergonomic raglan seamwork for athletic contours.',
      price: 2290,
      comparePrice: 2800,
      categorySlug: 'athleisure-performance',
      collectionSlug: 'raw-pima-essentials',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      sku: 'TEE-AT-011',
      images: [
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=1000',
      ],
      colors: [{ name: 'Stealth Black', hex: '#121212' }, { name: 'Olive Green', hex: '#556B2F' }],
      sizes: ['S', 'M', 'L', 'XL'],
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
        stock: 15,
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
            p.colors.map((color, colorIdx) => ({
              size,
              color: color.name,
              colorHex: color.hex,
              sku: `${p.sku}-${size}-C${colorIdx + 1}`,
              stock: Math.floor(5 + Math.random() * 10),
              price: p.price,
            }))
          ),
        },
      },
    });

    createdProducts.push(prod);

    await prisma.inventory.create({
      data: {
        productId: prod.id,
        stock: 15,
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
        minSpend: 2000,
        maxDiscount: 2000,
        usageLimit: 500,
        isActive: true,
      },
      {
        code: 'STREET20',
        type: 'PERCENTAGE',
        value: 20,
        minSpend: 5000,
        maxDiscount: 5000,
        usageLimit: 200,
        isActive: true,
      },
      {
        code: 'TEE500',
        type: 'FIXED',
        value: 500,
        minSpend: 1500,
        usageLimit: 1000,
        isActive: true,
      },
    ],
  });

  console.log('--- Seeding T-Shirt Customer Reviews ---');
  const reviewComments = [
    { title: 'Insane 280 GSM Heavy Weight!', rating: 5, text: 'The collar does not stretch out after washing. Boxy fit is 10/10 perfection.' },
    { title: 'Best Oversized Tee I Own', rating: 5, text: 'The drop shoulder drape is incredible. Super soft French Terry organic cotton.' },
    { title: 'Top Notch Quality & Stitching', rating: 5, text: 'Puff print details on the graphic are very clean. Heavy and premium.' },
    { title: 'Worth Every Penny', rating: 4, text: 'Fabric feels like luxury designer streetwear brands. Fast shipping too!' },
  ];

  for (let i = 0; i < createdProducts.length; i++) {
    const randomProduct = createdProducts[i];
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
    const prod = createdProducts[i % createdProducts.length];
    const orderNum = `CYT-2026-${1000 + i}`;
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

  console.log('✅ CYTRUS Database Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
