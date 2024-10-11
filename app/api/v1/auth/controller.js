const { login, getUserLogged } = require('../../../services/mongoose/auth');
const { StatusCodes } = require('http-status-codes');

const loginCms = async (req, res, next) => {
  try {
    const result = await login(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const userLogged = async (req, res, next) => {
  try {
    const result = await getUserLogged(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { loginCms, userLogged };
