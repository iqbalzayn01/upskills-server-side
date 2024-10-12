const mongoose = require('mongoose');

let scheduleSchema = new mongoose.Schema(
  {
    id_schedule: {
      type: String,
      unique: true,
    },
    schedules: [
      {
        start_time: {
          type: Date,
          required: [true, 'Jadwal mulai harus diisi'],
        },
        end_time: {
          type: Date,
          required: [true, 'Jadwal selesai harus diisi'],
        },
      },
    ],
    batas_daftar: {
      type: Date,
      required: [true, 'Batas Pendaftaran selesai harus diisi'],
    },
    talentID: {
      type: mongoose.Types.ObjectId,
      ref: 'Talent',
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

scheduleSchema.pre('save', async function (next) {
  const Schedule = this;

  if (Schedule.isNew) {
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = 'JD';

    try {
      const lastSchedule = await this.constructor.findOne(
        {},
        {},
        { sort: { createdAt: -1 } }
      );
      let sequentialNumber = '001';

      if (lastSchedule) {
        const lastSequentialNumber = parseInt(
          lastSchedule.id_schedule.slice(-3)
        );
        sequentialNumber = (lastSequentialNumber + 1)
          .toString()
          .padStart(3, '0');
      }

      Schedule.id_schedule = `${prefix}${year}${sequentialNumber}`;
    } catch (error) {
      return next(error);
    }
  }

  next();
});

module.exports = mongoose.model('Schedule', scheduleSchema);
