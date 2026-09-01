require("dotenv").config();

const express = require("express");
const prisma = require("./src/config/prisma");
const authRoutes = require("./src/routes/authRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");

const app = express();

app.use(express.json());
app.use("/api", jobRoutes);
app.use("/api", applicationRoutes);


app.use("/api/auth", authRoutes);


app.get("/api/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      message: "Database connection works!",
      users
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});