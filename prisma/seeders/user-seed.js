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
      },
      {
        name: "User",
        email: "user@user.com",
        password: await bcrypt.hash("user123", 10),
        role: "USER",
        is_verified: true,
      },
    ];
    await prisma.user
      .createMany({
        data: data,
      })
      .then(() => {
        resolve("Successfully insert user seed");
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = UserSeeder;
