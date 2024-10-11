const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let imageSchema = Schema(
  {
    fileName: String,
    fileUrl: String,
    fileType: String,
    filePath: String,
    uploadDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = model('Image', imageSchema);
