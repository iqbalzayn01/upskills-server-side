// Users (Role Admin & Pengguna/Mahasiswa)
const Users = require('../../api/v1/users/model');
const { BadRequestError, NotFoundError } = require('../../errors');

const createUsers = async (req, res) => {
  const { name, email, password, confirmPassword, no_telp, avatar, role } =
    req.body;

  if (password !== confirmPassword) {
    throw new BadRequestError('Password dan Konfirmasi password tidak cocok');
  }

  const result = await Users.create({
    name,
    email,
    password,
    no_telp,
    avatar,
    role,
  });

  delete result._doc.password;

  return result;
};

const getAllUsers = async (req) => {
  const result = await Users.find(
    {},
    'id_user name email no_telp avatar role createdAt'
  ).exec();

  return result;
};

const getOneUsers = async (req) => {
  const { id } = req.params;

  const result = await Users.findOne(
    { _id: id },
    'id_user name email no_telp avatar role'
  ).exec();

  if (!result) throw new NotFoundError(`Tidak ada user dengan id :  ${id}`);

  return result;
};

const updateUsers = async (req) => {
  const { id } = req.params;
  const { name, email, no_telp } = req.body;

  const check = await Users.findOne({
    name,
    email,
    no_telp,
    _id: { $ne: id },
  });

  if (check) throw new BadRequestError('Nama user sudah terdaftar');

  const result = await Users.findOneAndUpdate(
    { _id: id },
    { name, email, no_telp },
    { new: true, runValidators: true }
  );

  if (!result) throw new NotFoundError(`Tidak ada user dengan id :  ${id}`);

  return result;
};

const deleteUsers = async (req) => {
  const { id } = req.params;

  const result = await Users.findOne({
    _id: id,
  });

  if (!result) throw new NotFoundError(`Tidak ada user dengan id :  ${id}`);

  await result.deleteOne({ _id: id });

  return result;
};

const checkingUsers = async (id) => {
  const result = await Users.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada user dengan id :  ${id}`);

  return result;
};

module.exports = {
  createUsers,
  getAllUsers,
  getOneUsers,
  updateUsers,
  deleteUsers,
  checkingUsers,
};
