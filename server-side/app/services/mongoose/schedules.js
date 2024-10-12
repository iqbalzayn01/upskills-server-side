// Jadwal
const Schedules = require('../../api/v1/schedules/model');
const { BadRequestError, NotFoundError } = require('../../errors');
const { checkingTalents } = require('./talents');
const { checkingEvents } = require('./events');

const createSchedules = async (req, res) => {
  const { schedules, batas_daftar, talentID, eventID } = req.body;

  await checkingTalents(talentID);
  await checkingEvents(eventID);

  if (!schedules) {
    throw new BadRequestError('Jadwal harus diisi');
  }

  const result = await Schedules.create({
    schedules,
    batas_daftar,
    talentID,
    eventID,
  });

  return result;
};

const getAllSchedules = async (req) => {
  const { keyword, talentID, eventID } = req.query;
  let condition = {};

  if (keyword) {
    condition = { ...condition, title: { $regex: keyword, $options: 'i' } };
  }

  if (talentID) {
    condition = { ...condition, talentID: talentID };
  }

  if (eventID) {
    condition = { ...condition, eventID: eventID };
  }
  const result = await Schedules.find(condition)
    .populate({
      path: 'talentID',
      select: '_id name email avatar no_telp role',
    })
    .populate({
      path: 'eventID',
      select:
        '_id id_event name description event_status location price linkMeeting imageID kuota',
      populate: {
        path: 'imageID',
        select: '_id fileName fileUrl fileType filePath',
      },
    });

  return result;
};

const getOneSchedules = async (req) => {
  const { id } = req.params;

  const result = await Schedules.findOne({ _id: id })
    .populate({
      path: 'talentID',
      select: '_id name email avatar no_telp role',
    })
    .populate({
      path: 'eventID',
      select:
        '_id id_event name description event_status location price linkMeeting imageID kuota',
      populate: {
        path: 'imageID',
        select: '_id fileName fileUrl fileType filePath',
      },
    });

  if (!result) throw new NotFoundError(`Tidak ada jadwal dengan id :  ${id}`);

  return result;
};

const updateSchedules = async (req) => {
  const { id } = req.params;
  const { schedules, talentID, eventID } = req.body;

  const check = await Events.findOne({
    schedules,
    talentID,
    eventID,
    _id: { $ne: id },
  });

  if (check) throw new BadRequestError('Jadwal sudah terdaftar');

  const result = await Events.findOneAndUpdate(
    { _id: id },
    {
      schedules,
      talentID,
      eventID,
    },
    { new: true, runValidators: true }
  );

  if (!result) throw new NotFoundError(`Tidak ada jadwal dengan id :  ${id}`);

  return result;
};

const deleteSchedules = async (req) => {
  const { id } = req.params;

  const result = await Schedules.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada jadwal dengan id :  ${id}`);

  await result.deleteOne({ _id: id });

  return result;
};

module.exports = {
  createSchedules,
  getAllSchedules,
  getOneSchedules,
  updateSchedules,
  deleteSchedules,
};
