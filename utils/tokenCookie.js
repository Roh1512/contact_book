const setTokenCookie = (res, value, options = {}) => {
  const defaultOptions = {
    httpOnly: true, // Prevents client-side JS access
    secure: process.env.NODE_ENV === "production", // Secure in production
    sameSite: "Strict", // Prevents CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // Default: 7 days
    path: "/", // Available for all routes
    ...options, // Override defaults if needed
  };

  res.cookie("token", value, defaultOptions);
};

const clearTokenCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
};

module.exports = { setTokenCookie, clearTokenCookie };
