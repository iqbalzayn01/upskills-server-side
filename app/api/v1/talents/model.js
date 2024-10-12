const mongoose = require('mongoose');

let talentSchema = new mongoose.Schema(
  {
    id_talent: {
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
    avatar: {
      type: String,
      default: function () {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
          this.name
        )}&background=random`;
      },
    },
    no_telp: {
      type: String,
      unique: true,
      required: [true, 'Nomor Telepon harus diisi'],
      maxlength: 13,
    },
    role: {
      type: String,
      default: 'narasumber',
      required: [true, 'Role harus diisi'],
    },
  },
  { timestamps: true }
);

talentSchema.pre('save', async function (next) {
  const Talent = this;

  if (Talent.isNew) {
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = 'NR';

    try {
      // const count = await mongoose.model('Talent').countDocuments();
      // const sequentialNumber = (count + 1).toString().padStart(3, '0');
      // Generate a random three-digit number
      const randomPart = Math.floor(100 + Math.random() * 900).toString();

      Talent.id_talent = `${prefix}${year}${randomPart}`;
    } catch (error) {
      return next(error);
    }
  }

  next();
});

module.exports = mongoose.model('Talent', talentSchema);
