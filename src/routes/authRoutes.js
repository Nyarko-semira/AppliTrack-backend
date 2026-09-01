const express = require("express");
const {register , Login} = require("./../controllers/authController");
const router = express.Router();


router.post("/register", register);
router.post("/login", Login);

module.exports = router;

