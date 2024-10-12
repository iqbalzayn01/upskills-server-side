// Pembicara
const Talents = require('../../api/v1/talents/model');
const { BadRequestError, NotFoundError } = require('../../errors');

const createTalents = async (req, res) => {
  const { name, email, avatar, no_telp, role } = req.body;

  if (!name || !email) {
    throw new BadRequestError('Nama atau Email harus diisi');
  }

  const result = await Talents.create({
    name,
    email,
    avatar,
    no_telp,
    role,
  });

  return result;
};

const getAllTalents = async (req) => {
  const result = await Talents.find();

  return result;
};

const getOneTalents = async (req) => {
  const { id } = req.params;

  const result = await Talents.findOne({ _id: id });

  if (!result)
    throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

  return result;
};

const updateTalents = async (req) => {
  const { id } = req.params;
  const { name, email, no_telp } = req.body;

  const check = await Talents.findOne({
    name,
    email,
    no_telp,
    _id: { $ne: id },
  });

  if (check) throw new BadRequestError('Pembicara sudah terdaftar');

  const result = await Talents.findOneAndUpdate(
    { _id: id },
    { name, email, no_telp },
    { new: true, runValidators: true }
  );

  if (!result)
    throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

  return result;
};

const deleteTalents = async (req) => {
  const { id } = req.params;

  const result = await Talents.findOne({ _id: id });

  if (!result)
    throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

  await result.deleteOne({ _id: id });

  return result;
};

const checkingTalents = async (id) => {
  const result = await Talents.findOne({ _id: id });

  if (!result)
    throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

  return result;
};

module.exports = {
  createTalents,
  getAllTalents,
  getOneTalents,
  updateTalents,
  deleteTalents,
  checkingTalents,
};
