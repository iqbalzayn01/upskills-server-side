const mongoose = require('mongoose');

let registrationSchema = new mongoose.Schema(
  {
    id_regis: {
      type: String,
      unique: true,
    },
    userID: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    documentID: {
      type: mongoose.Types.ObjectId,
      ref: 'UploadDocument',
      required: true,
    },
    eventID: {
      type: mongoose.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
  },
  { timestamps: true }
);

registrationSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const yearSuffix = new Date().getFullYear().toString().slice(-2);
      const lastRegistration = await this.constructor
        .findOne()
        .sort({ createdAt: -1 })
        .exec();
      let sequenceNumber = '001';

      if (lastRegistration) {
        const lastIdRegis = lastRegistration.id_regis;
        const lastSequence = parseInt(lastIdRegis.slice(-3), 10);
        sequenceNumber = (lastSequence + 1).toString().padStart(3, '0');
      }

      this.id_regis = `DF${yearSuffix}${sequenceNumber}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Registration', registrationSchema);
