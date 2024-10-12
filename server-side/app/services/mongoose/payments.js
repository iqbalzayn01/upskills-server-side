// Pembayaran
const Payments = require('../../api/v1/payments/model');
const { BadRequestError, NotFoundError } = require('../../errors');
const { checkingRegistration } = require('./registration');

const createPayments = async (req, res) => {
  const { registrationID, total_payment } = req.body;

  await checkingRegistration(registrationID);

  if (!registrationID) {
    throw new BadRequestError('registrationID harus diisi');
  }

  const result = await Payments.create({
    registrationID,
    total_payment,
  });

  return result;
};

const getAllPayments = async (req) => {
  const { keyword, registrationID } = req.query;
  let condition = {};

  if (keyword) {
    condition = { ...condition, title: { $regex: keyword, $options: 'i' } };
  }

  if (registrationID) {
    condition = { ...condition, registrationID: registrationID };
  }

  const result = await Payments.find(condition).populate({
    path: 'registrationID',
    select: '_id userID documentID eventID createAt',
    populate: [
      {
        path: 'userID',
        select: '_id name email no_telp avatar role',
      },
      {
        path: 'documentID',
        select: '_id fileName data_valid',
      },
      {
        path: 'eventID',
        select:
          '_id name description event_status location price linkMeeting imageID kuota',
      },
    ],
  });

  return result;
};

const getOnePayments = async (req) => {
  const { id } = req.params;

  const result = await Payments.findOne({ _id: id }).populate({
    path: 'registrationID',
    select: '_id userID documentID eventID createAt',
    populate: [
      {
        path: 'userID',
        select: '_id id_user name email no_telp avatar role',
      },
      {
        path: 'documentID',
        select: '_id fileName data_valid',
      },
      {
        path: 'eventID',
        select:
          '_id id_event name description event_status location price linkMeeting imageID kuota',
      },
    ],
  });

  if (!result)
    throw new NotFoundError(`Tidak ada pembayaran dengan id :  ${id}`);

  return result;
};

const checkingPayments = async (id) => {
  const result = await Payments.findOne({ _id: id });

  if (!result)
    throw new NotFoundError(`Tidak ada pembayaran dengan id :  ${id}`);

  return result;
};

module.exports = {
  createPayments,
  getAllPayments,
  getOnePayments,
  checkingPayments,
};
