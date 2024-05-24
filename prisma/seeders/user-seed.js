const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function UserSeeder() {
  return new Promise(async (resolve, reject) => {
    let data = [
      {
        name: "Admin",
        email: "admin@admin.com",
        password: await bcrypt.hash("admin123", 10),
        role: "ADMIN",
        is_verified: true,
        profile: {
          create: {},
        },
      },
      {
        name: "User",
        email: "user@user.com",
        password: await bcrypt.hash("user123", 10),
        role: "USER",
        is_verified: true,
        profile: {
          create: {},
        },
      },
    ];
    try {
      const deleteUser = await prisma.user.deleteMany({});

      for (item of data) {
        await prisma.user.create({
          data: item,
          include: {
            profile: true,
          },
        });
      }
      resolve("Success create user seeds");
    } catch (error) {
      reject(error.message);
    }
  });
}

module.exports = UserSeeder;
