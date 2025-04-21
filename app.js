var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const authRouter = require("./routes/authRoutes");
const contactsRouter = require("./routes/contactsRoutes");

const dotenv = require("dotenv");

dotenv.config();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/contact", contactsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error.";
  const errors = Array.isArray(err.errors) ? err.errors : [];
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    errors,
  });
});

module.exports = app;
