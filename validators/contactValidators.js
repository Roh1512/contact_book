const { body } = require("express-validator");

exports.addContactValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").optional().trim().isEmail().withMessage("Invalid email format"),
  body("phone")
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 digits"),
  body("address").optional().trim(),
];
