require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("../src/config/prisma");

const setupHr = async () => {
  try {
    const passwordHash = await bcrypt.hash("hr123456", 10);

    const hr = await prisma.user.upsert({
      where: {
        email: "hr@applitrack.com"
      },

      update: {
        name: "HR Manager",
        passwordHash,
        role: "HR"
      },

      create: {
        name: "HR Manager",
        email: "hr@applitrack.com",
        passwordHash,
        role: "HR"
      }
    });

    console.log("HR account ready:");

    console.log({
      id: hr.id,
      name: hr.name,
      email: hr.email,
      role: hr.role
    });

  } catch (error) {
    console.error("Failed to setup HR:", error);
  } finally {
    await prisma.$disconnect();
  }
};

setupHr();
