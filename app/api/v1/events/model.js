const mongoose = require('mongoose');

let eventSchema = new mongoose.Schema(
  {
    id_event: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      unique: true,
      required: [true, 'Nama kegiatan harus diisi'],
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Deskripsi harus diisi'],
    },
    event_status: {
      type: String,
      enum: ['buka', 'tutup', 'selesai'],
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Deskripsi harus diisi'],
      minlength: 2,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: [true, 'Harga harus diisi'],
      default: 0,
    },
    linkMeeting: {
      type: String,
      default: '',
    },
    imageID: {
      type: mongoose.Types.ObjectId,
      ref: 'Image',
      required: true,
    },
    kuota: {
      type: Number,
      required: [true, 'Kuota harus diisi'],
      default: 0,
    },
  },
  { timestamps: true }
);

eventSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const yearSuffix = new Date().getFullYear().toString().slice(-2);
      const lastEvent = await this.constructor
        .findOne()
        .sort({ createdAt: -1 })
        .exec();
      let sequenceNumber = '001';

      if (lastEvent) {
        const lastIdEvent = lastEvent.id_event;
        const lastSequence = parseInt(lastIdEvent.slice(-3), 10);
        sequenceNumber = (lastSequence + 1).toString().padStart(3, '0');
      }

      this.id_event = `KN${yearSuffix}${sequenceNumber}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
