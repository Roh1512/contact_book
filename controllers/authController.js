const bcrypt = require("bcryptjs");
const prisma = require("../config/prismaClient");
const token = require("../utils/tokenUtils");
const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidators");
const { validationResult } = require("express-validator");

const { validationErrors, errorMessage } = require("../utils/errorMessages");
const generateToken = require("../utils/tokenUtils");
const { setTokenCookie, clearTokenCookie } = require("../utils/tokenCookie");
const { successMessage } = require("../utils/successHandler");

exports.registerUser = [
  registerValidator,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(validationErrors(400, errors.array()));
    }

    try {
      const { name, email, password } = req.body;
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return next(errorMessage(400, "Email already exists."));
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      const tokenData = {
        id: newUser.id,
        email: newUser.email,
      };
      const authToken = generateToken(tokenData);
      setTokenCookie(res, authToken);
      return res.status(201).json(successMessage("User created successfully"));
    } catch (error) {
      console.log(error);
      return next(errorMessage(500, "Internal Server Error."));
    }
  },
];

exports.login = [
  loginValidator,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(validationErrors(400, errors.array()));
      }
      const validUser = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (!validUser) {
        return next(errorMessage(404, "User not found"));
      }

      const validPassword = await bcrypt.compare(password, validUser.password);

      if (!validPassword) {
        return next(errorMessage(400, "Incorrect password"));
      }
      const tokenData = {
        id: validUser.id,
        email: validUser.email,
      };
      const authToken = generateToken(tokenData);
      setTokenCookie(res, authToken);
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: validUser.id,
          name: validUser.name,
          email: validUser.email,
        },
      });
    } catch (error) {
      console.error(error);
      return next(errorMessage(500, "Error logging in customer"));
    }
  },
];

exports.logout = async (req, res, next) => {
  try {
    req.user = null;
    clearTokenCookie(res);
    return res.status(200).json({
      successMessage: "Logout successful",
    });
  } catch (error) {
    return next(errorMessage(500, "Error logging in customer"));
  }
};
