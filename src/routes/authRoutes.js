const express = require("express");
const {register , Login} = require("./../controllers/authController");
const router = express.Router();

router.use((req, res, next) => {
  console.log("AUTH ROUTER:", req.method, req.originalUrl);
  next();
});


router.post("/register", register);
router.post("/login", Login);

module.exports = router;

