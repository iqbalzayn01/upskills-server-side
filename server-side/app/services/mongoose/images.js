const Images = require('../../api/v1/images/model');
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

  if (file.mimetype.startsWith('image/')) {
    folderPath = 'uploads/images';
  } else {
    throw new BadRequestError('Invalid file format. Only images are allowed.');
  }

  const storageRef = ref(storage, `${folderPath}/${fileName}`);
  const metadata = {
    contentType: file.mimetype,
  };
  const snapshot = await uploadBytesResumable(
    storageRef,
    file.buffer,
    metadata
  );
  const downloadURL = await getDownloadURL(snapshot.ref);

  return { fileName, downloadURL, filePath: `${folderPath}/${fileName}` };
};

const createImages = async (file) => {
  try {
    const { fileName, downloadURL, filePath } = await uploadToFirebase(file);

    const result = await Images.create({
      fileName,
      fileUrl: downloadURL,
      fileType: file.mimetype,
      filePath: filePath,
    });

    return result;
  } catch (error) {
    console.error('Error creating image:', error);

    if (error.code && error.code.startsWith('storage/')) {
      throw new BadRequestError(`Firebase Storage error: ${error.message}`);
    }
    throw new Error('Error creating image');
  }
};

const getAllImages = async (req) => {
  const result = await Images.find();

  return result;
};

const getOneImages = async (req) => {
  const { id } = req.params;

  const result = await Images.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada gambar dengan id :  ${id}`);

  return result;
};

const deleteImages = async (req) => {
  const { id } = req.params;

  const result = await Images.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada gambar dengan id :  ${id}`);

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

// tambahkan function checking Image
const checkingImage = async (id) => {
  const result = await Images.findOne({ _id: id });
  console.log(result);

  if (!result) throw new NotFoundError(`Tidak ada gambar dengan id :  ${id}`);

  return result;
};

module.exports = {
  createImages,
  getAllImages,
  getOneImages,
  deleteImages,
  checkingImage,
};
