// import services Payments
const {
  createPayments,
  getAllPayments,
  getOnePayments,
} = require('../../../services/mongoose/payments');
const { StatusCodes } = require('http-status-codes');

const create = async (req, res, next) => {
  try {
    const result = await createPayments(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    const result = await getAllPayments(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const find = async (req, res, next) => {
  try {
    const result = await getOnePayments(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  index,
  find,
};
