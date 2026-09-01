require("dotenv").config();

const bcrypt = require("bcryptjs");
const prisma = require("../src/config/prisma");

const setupHr = async () => {
  try {
    const passwordHash = await bcrypt.hash("hr123456", 10);

    const hr = await prisma.user.update({
      where: {
        email: "hr@applitrack.com"
      },
      data: {
        name: "HR Manager",
        passwordHash,
        role: "HR"
      }
    });

    console.log("HR account updated:");
    console.log({
      id: hr.id,
      name: hr.name,
      email: hr.email,
      role: hr.role
    });

  } catch (error) {
    console.error("Failed to update HR:", error);
  } finally {
    await prisma.$disconnect();
  }
};

setupHr();
