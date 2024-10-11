const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let userSchema = new mongoose.Schema(
  {
    id_user: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Nama harus diisi'],
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email harus diisi'],
      minlength: 3,
      maxlength: 30,
    },
    password: {
      type: String,
      required: [true, 'Password harus diisi'],
      minlength: 6,
    },
    no_telp: {
      type: String,
      unique: true,
      required: [true, 'Nomor telepon harus diisi'],
      maxlength: 14,
    },
    avatar: {
      type: String,
      default: function () {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
          this.name
        )}&background=random`;
      },
    },
    role: {
      type: String,
      enum: ['peserta', 'admin'],
      default: 'peserta',
      required: [true, 'Role harus diisi'],
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  const User = this;

  if (User.isNew) {
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = User.role === 'admin' ? 'AD' : 'PS';

    // Generate a random three-digit number
    const randomPart = Math.floor(100 + Math.random() * 900).toString();

    User.id_user = `${prefix}${year}${randomPart}`;
  }

  if (User.isModified('password')) {
    User.password = await bcrypt.hash(User.password, 12);
  }

  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', userSchema);
