const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };
  // error validation dari mongoose
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `${Object.keys(
      err.keyValue
    )} yang dimasukkan sudah ada, silakan gunakan ${Object.keys(
      err.keyValue
    )} lain.`;
    customError.statusCode = 400;
  }
  if (err.name === 'CastError') {
    customError.msg = `Tidak ada item yang ditemukan dengan Id : ${err.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
