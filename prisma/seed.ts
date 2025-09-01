import { PrismaClient } from "@prisma/client";
import seedData from "../data/seed-data.json";

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.idea.deleteMany();
  await prisma.category.deleteMany();

  console.log("🗑️  Cleared existing data");

  // Seed categories and ideas
  for (const categoryData of seedData.categories) {
    console.log(`📁 Creating category: ${categoryData.title}`);

    const category = await prisma.category.create({
      data: {
        title: categoryData.title,
        slug: generateSlug(categoryData.title),
      },
    });

    // Create ideas for this category
    for (const ideaData of categoryData.ideas) {
      console.log(`💡 Creating idea: ${ideaData.title}`);

      await prisma.idea.create({
        data: {
          title: ideaData.title,
          slug: generateSlug(ideaData.title),
          description: ideaData.description,
          categoryId: category.id,
        },
      });
    }
  }

  console.log("✅ Database seeded successfully!");

  // Display summary
  const categoryCount = await prisma.category.count();
  const ideaCount = await prisma.idea.count();

  console.log(`📊 Summary:`);
  console.log(`   Categories: ${categoryCount}`);
  console.log(`   Ideas: ${ideaCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
