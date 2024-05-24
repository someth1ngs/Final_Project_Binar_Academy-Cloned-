const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function CategorySeeder() {
  return new Promise(async (resolve, reject) => {
    let data = [
      {
        type: "adult",
        discount: 0,
      },
      {
        type: "child",
        discount: 5,
      },
      {
        type: "baby",
        discount: 100,
      },
    ];
    try {
      const deleteCategory = await prisma.category.deleteMany({});
      const categoryCreate = await prisma.category.createMany({
        data: data,
      });
      resolve("Success create category seeds");
    } catch (error) {
      reject(error.message);
    }
  });
}

module.exports = CategorySeeder;
