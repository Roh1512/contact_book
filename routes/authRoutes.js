const {
  registerUser,
  login,
  logout,
} = require("../controllers/authController");
const authenticateUser = require("../middlewares/authMiddleware");

const express = require("express");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/private", authenticateUser, (req, res) => {
  res.status(200).json({ message: "You are authenticated" });
});
router.post("/logout", authenticateUser, logout);

module.exports = router;
