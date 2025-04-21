const {
  addContact,
  getContacts,
  editContact,
  deleteContact,
} = require("../controllers/contactController");
const authenticateUser = require("../middlewares/authMiddleware");

const express = require("express");
const router = express.Router();
router.get("/", authenticateUser, getContacts);
router.post("/add", authenticateUser, addContact);
router.put("/edit/:contactid", authenticateUser, editContact);
router.delete("/delete/:contactid", authenticateUser, deleteContact);

module.exports = router;
