const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function TaxSeeder() {
  return new Promise(async (resolve, reject) => {
    try {
      const deleteTax = await prisma.tax.deleteMany({});
      const taxCreate = await prisma.tax.create({
        data: {},
      });
      resolve("Success create tax seeds");
    } catch (error) {
      reject(error.message);
    }
  });
}

module.exports = TaxSeeder;
