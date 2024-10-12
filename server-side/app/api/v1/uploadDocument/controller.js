// import services Documents
const {
  uploadDocuments,
  getAllDocuments,
  getOneDocuments,
  updateDocuments,
  deleteDocuments,
} = require('../../../services/mongoose/uploadDocument');
const { StatusCodes } = require('http-status-codes');

const create = async (req, res, next) => {
  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).send('No file uploaded.');
  }

  try {
    const result = await uploadDocuments(req, req.file);
    res.status(StatusCodes.CREATED).json({
      msg: 'File uploaded successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    const result = await getAllDocuments(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const find = async (req, res, next) => {
  try {
    const result = await getOneDocuments(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await updateDocuments(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await deleteDocuments(req);

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
  update,
  destroy,
};
