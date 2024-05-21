const { PrismaClient } = require("@prisma/client");
const UserSeeder = require("./user-seed");
const prisma = new PrismaClient();

async function main() {
  const deleteUser = await prisma.user.deleteMany({});
  const createUser = await UserSeeder(prisma);

  console.log(createUser);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
