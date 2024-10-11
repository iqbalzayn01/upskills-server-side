// Pendaftaran Kegiatan
const Registration = require('../../api/v1/registration/model');
const { BadRequestError, NotFoundError } = require('../../errors');
const { checkingUsers } = require('./users');
const { checkingEvents } = require('./events');
const { checkingDocuments } = require('./uploadDocument');

const createRegistration = async (req, res) => {
  const { userID, documentID, eventID } = req.body;

  await checkingUsers(userID);
  await checkingDocuments(documentID);
  await checkingEvents(eventID);

  if (!userID && !eventID) {
    throw new BadRequestError('userID dan eventID harus diisi');
  }

  const result = await Registration.create({
    userID,
    documentID,
    eventID,
  });

  return result;
};

const getAllRegistration = async (req, res) => {
  const { keyword, userID, documentID, eventID } = req.query;
  let condition = {};

  if (keyword) {
    condition = { ...condition, title: { $regex: keyword, $options: 'i' } };
  }

  if (userID) {
    condition = { ...condition, userID: userID };
  }

  if (documentID) {
    condition = { ...condition, documentID: documentID };
  }

  if (eventID) {
    condition = { ...condition, eventID: eventID };
  }

  const result = await Registration.find(condition)
    .populate({
      path: 'userID',
      select: '_id name email no_telp avatar role',
    })
    .populate({
      path: 'documentID',
      select: '_id fileName fileUrl fileType filePath data_valid',
    })
    .populate({
      path: 'eventID',
      select:
        '_id id_event name description event_status location price linkMeeting imageID kuota',
    });

  return result;
};

const getOneRegistration = async (req, res) => {
  const { id } = req.params;

  const result = await Registration.findOne({ _id: id })
    .populate({
      path: 'userID',
      select: '_id name email no_telp avatar role',
    })
    .populate({
      path: 'documentID',
      select: '_id fileName data_valid',
    })
    .populate({
      path: 'eventID',
      select:
        '_id id_event name description event_status location price linkMeeting imageID kuota',
    });

  if (!result)
    throw new NotFoundError(`Tidak ada pendaftaran dengan id :  ${id}`);

  return result;
};

const updateRegistration = async (req) => {
  const { id } = req.params;
  const { userID, documentID, eventID, registrationDate } = req.body;

  const check = await Registration.findOne({
    userID,
    documentID,
    eventID,
    registrationDate,
    _id: { $ne: id },
  });

  if (check) throw new BadRequestError('Pendaftaran sudah terdaftar');

  const result = await Registration.findOneAndUpdate(
    { _id: id },
    { userID, documentID, eventID, registrationDate },
    { new: true, runValidators: true }
  );

  if (!result)
    throw new NotFoundError(`Tidak ada pendaftaran dengan id :  ${id}`);

  return result;
};

const deleteRegistration = async (req) => {
  const { id } = req.params;

  const result = await Registration.findOne({ _id: id });

  if (!result)
    throw new NotFoundError(`Tidak ada pendaftaran dengan id :  ${id}`);

  await result.deleteOne({ _id: id });

  return result;
};

const checkingRegistration = async (id) => {
  const result = await Registration.findOne({ _id: id });

  if (!result)
    throw new NotFoundError(`Tidak ada registrasi dengan id :  ${id}`);

  return result;
};

module.exports = {
  createRegistration,
  getAllRegistration,
  getOneRegistration,
  updateRegistration,
  deleteRegistration,
  checkingRegistration,
};
