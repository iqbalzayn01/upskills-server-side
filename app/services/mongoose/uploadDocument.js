const UploadDocument = require('../../api/v1/uploadDocument/model');
const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} = require('firebase/storage');
const { storage } = require('../../firebase.config');
const { BadRequestError, NotFoundError } = require('../../errors');

const uploadToFirebase = async (file) => {
  const fileName = `${Date.now()}_${file.originalname}`;
  let folderPath;

  if (file.mimetype.startsWith('application/pdf')) {
    folderPath = 'uploads/documents';
  } else {
    throw new BadRequestError(
      'Invalid file format. Only document are allowed.'
    );
  }

  const storageRef = ref(storage, `${folderPath}/${fileName}`);
  const metadata = {
    contentType: file.mimetype,
  };
  try {
    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { fileName, downloadURL, filePath: `${folderPath}/${fileName}` };
  } catch (error) {
    console.error('Error uploading document to Firebase:', error);
    throw new Error('Error uploading document to Firebase');
  }
};

const uploadDocuments = async (req, file) => {
  try {
    const { fileName, downloadURL, filePath } = await uploadToFirebase(file);
    const { data_valid } = req.body;

    const result = await UploadDocument.create({
      fileName,
      fileUrl: downloadURL,
      fileType: file.mimetype,
      filePath: filePath,
      data_valid,
    });

    return result;
  } catch (error) {
    console.error('Error creating document:', error);

    if (error.code && error.code.startsWith('storage/')) {
      throw new BadRequestError(`Firebase Storage error: ${error.message}`);
    }
    throw new Error('Error creating document');
  }
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

  // Delete from Firebase Storage
  try {
    const storageRef = ref(storage, result.filePath);
    await deleteObject(storageRef);
    console.log('File deleted successfully from Firebase Storage');
  } catch (error) {
    console.error('Error deleting file from Firebase Storage:', error);
  }

  // Delete from MongoDB
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
