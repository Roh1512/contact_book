const { body } = require("express-validator");

exports.registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Email must be in the format abcd@something.com"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password must not be empty"),
];

exports.loginValidator = [
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Email must be in the format abcd@something.com"),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password must not be empty"),
];
