const prisma = require("../config/prismaClient");
const { errorMessage } = require("../utils/errorMessages");
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      console.log("Token not in cookies");
      return next(errorMessage(401, "Unauthorized"));
    }
    const decodedData = jwt.verify(token, process.env.SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: decodedData.data.id,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      return next(errorMessage(401, "Unauthorized"));
    }
    console.log(user);
    req.user = user;
    next();
  } catch (error) {
    return next(errorMessage(401, "Unauthorized"));
  }
};

module.exports = authenticateUser;
