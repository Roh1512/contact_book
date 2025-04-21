exports.errorMessage = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

exports.validationErrors = (statusCode = 400, errors) => {
  if (Array.isArray(errors)) {
    const errorArray = errors.map((error) => ({
      field: error.path, // `path` is used by express-validator instead of `field`
      message: error.msg,
    }));

    const error = new Error();
    error.statusCode = statusCode;
    error.message = "Form Validation failed";
    error.errors = errorArray;
    return error;
  }

  return errorMessage(statusCode, "Invalid input data");
};
