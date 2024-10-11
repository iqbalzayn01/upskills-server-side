const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema(
  {
    id_document: {
      type: String,
      unique: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: String,
    fileType: String,
    filePath: String,
    uploadDate: { type: Date, default: Date.now },
    data_valid: {
      type: String,
      enum: ['Belum Diperiksa', 'Data Valid', 'Data Tidak Valid'],
      default: 'Belum Diperiksa',
    },
  },
  { timestamps: true }
);

uploadSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const yearSuffix = new Date().getFullYear().toString().slice(-2);
      const lastDocument = await this.constructor
        .findOne()
        .sort({ createdAt: -1 })
        .exec();
      let sequenceNumber = '001';

      if (lastDocument) {
        const lastIdDocument = lastDocument.id_document;
        const lastSequence = parseInt(lastIdDocument.slice(-3), 10);
        sequenceNumber = (lastSequence + 1).toString().padStart(3, '0');
      }

      this.id_document = `DK${yearSuffix}${sequenceNumber}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('UploadDocument', uploadSchema);
