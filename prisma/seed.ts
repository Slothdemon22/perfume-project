import { prisma } from '../lib/prisma';

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@classicperfumes.com';
  const rawPassword = process.env.ADMIN_PASSWORD || 'password123';
  const heroImage = process.env.DEFAULT_HERO_IMAGE || '/images/hero_banner_1773220198541.png';
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: rawPassword,
    },
    create: {
      email: adminEmail,
      password: rawPassword,
      name: 'Classic Perfumes Admin',
      role: 'admin',
    },
  });

  // Reset catalog for a clean perfume storefront.
  await prisma.product.deleteMany();
  await prisma.homeFeature.deleteMany();
  await prisma.category.deleteMany();

  const createdCategories = await Promise.all([
    prisma.category.create({ data: { name: 'WOODY SIGNATURES' } }),
    prisma.category.create({ data: { name: 'FLORAL ELEGANCE' } }),
    prisma.category.create({ data: { name: 'ORIENTAL AMBER' } }),
    prisma.category.create({ data: { name: 'FRESH CITRUS' } }),
  ]);

  const categoryByName = Object.fromEntries(createdCategories.map((c) => [c.name, c]));

  await prisma.product.createMany({
    data: [
      {
        name: 'Noir Cedar Reserve',
        price: 'PKR 8,900',
        badge: 'BESTSELLER',
        description: 'A rich woody blend with cedarwood, patchouli, and smooth vanilla for evening sophistication.',
        categoryId: categoryByName['WOODY SIGNATURES'].id,
        image: heroImage,
        gallery: [heroImage],
        sku: 'NP-WO-001',
        fragrances: ['Noir Cedar', 'Noir Cedar Intense'],
      },
      {
        name: 'Velvet Rose Elixir',
        price: 'PKR 7,500',
        badge: 'NEW',
        description: 'A romantic floral scent with Turkish rose, peony, and white musk.',
        categoryId: categoryByName['FLORAL ELEGANCE'].id,
        image: heroImage,
        gallery: [heroImage],
        sku: 'NP-FL-002',
        fragrances: ['Velvet Rose', 'Velvet Rose Reserve'],
      },
      {
        name: 'Amber Oud Royale',
        price: 'PKR 10,900',
        badge: 'SIGNATURE',
        description: 'Deep oriental character with saffron, oud, amber resin, and smoky tonka.',
        categoryId: categoryByName['ORIENTAL AMBER'].id,
        image: heroImage,
        gallery: [heroImage],
        sku: 'NP-OR-003',
        fragrances: ['Amber Oud', 'Amber Oud Noir'],
      },
      {
        name: 'Citrus Neroli Mist',
        price: 'PKR 6,800',
        badge: null,
        description: 'A clean and uplifting profile of bergamot, neroli blossom, and soft vetiver.',
        categoryId: categoryByName['FRESH CITRUS'].id,
        image: heroImage,
        gallery: [heroImage],
        sku: 'NP-FR-004',
        fragrances: ['Citrus Neroli', 'Citrus Neroli Bright'],
      },
      {
        name: 'Midnight Sandal Aura',
        price: 'PKR 9,600',
        badge: null,
        description: 'Creamy sandalwood wrapped in iris and warm amber for refined daily wear.',
        categoryId: categoryByName['WOODY SIGNATURES'].id,
        image: heroImage,
        gallery: [heroImage],
        sku: 'NP-WO-005',
        fragrances: ['Midnight Sandal', 'Midnight Sandal Gold'],
      },
      {
        name: 'Bloom Petal Veil',
        price: 'PKR 7,200',
        badge: null,
        description: 'A soft floral veil of jasmine petals, freesia, and powdery musk.',
        categoryId: categoryByName['FLORAL ELEGANCE'].id,
        image: heroImage,
        gallery: [heroImage],
        sku: 'NP-FL-006',
        fragrances: ['Bloom Petal', 'Bloom Petal Velvet'],
      },
    ],
  });

  await prisma.homeFeature.createMany({
    data: [
      {
        title: 'WOODY SIGNATURES',
        image: heroImage,
        order: 1,
        categoryId: categoryByName['WOODY SIGNATURES'].id,
      },
      {
        title: 'FLORAL ELEGANCE',
        image: heroImage,
        order: 2,
        categoryId: categoryByName['FLORAL ELEGANCE'].id,
      },
      {
        title: 'ORIENTAL AMBER',
        image: heroImage,
        order: 3,
        categoryId: categoryByName['ORIENTAL AMBER'].id,
      },
    ],
  });

  await prisma.siteSettings.upsert({
    where: { key: 'hero_image_url' },
    update: { value: heroImage },
    create: {
      key: 'hero_image_url',
      value: heroImage,
    },
  });

  console.log('Seed completed for perfume brand storefront.');
  console.log('Admin user seeded:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
