// import services images
const {
  createImages,
  getAllImages,
  getOneImages,
  deleteImages,
} = require('../../../services/mongoose/images');

const { StatusCodes } = require('http-status-codes');

const create = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).send('No file uploaded.');
    }

    const result = await createImages(req.file);

    res.status(StatusCodes.CREATED).json({
      msg: 'File uploaded successfully',
      data: result,
    });
  } catch (err) {
    console.error('Error in createImages:', err);
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    const result = await getAllImages(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const find = async (req, res, next) => {
  try {
    const result = await getOneImages(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await deleteImages(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, index, find, destroy };
