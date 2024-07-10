const UploadDocument = require('../../api/v1/uploadDocument/model');
const { BadRequestError, NotFoundError } = require('../../errors');

const uploadDocuments = async (req) => {
  const { filename } = req.file;
  const { data_valid } = req.body;

  const result = await UploadDocument.create({
    fileName: `uploads/documents/${filename}`,
    data_valid,
  });

  return result;
};

const getAllDocuments = async (req) => {
  const result = await UploadDocument.find();

  return result;
};

const getOneDocuments = async (req) => {
  const { id } = req.params;

  const result = await UploadDocument.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada dokumen dengan id :  ${id}`);

  return result;
};

const updateDocuments = async (req) => {
  const { id } = req.params;
  const { data_valid } = req.body;

  const check = await UploadDocument.findOne({
    data_valid,
    _id: { $ne: id },
  });

  const result = await UploadDocument.findOneAndUpdate(
    { _id: id },
    { data_valid: data_valid },
    { new: true, runValidators: true }
  );

  if (!result) throw new NotFoundError(`Tidak ada dokumen dengan id :  ${id}`);

  return result;
};

const deleteDocuments = async (req) => {
  const { id } = req.params;

  const result = await UploadDocument.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada dokumen dengan id :  ${id}`);

  await result.deleteOne({ _id: id });

  return result;
};

const checkingDocuments = async (id) => {
  const result = await UploadDocument.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada dokumen dengan id :  ${id}`);

  return result;
};

module.exports = {
  uploadDocuments,
  getAllDocuments,
  getOneDocuments,
  updateDocuments,
  deleteDocuments,
  checkingDocuments,
};
