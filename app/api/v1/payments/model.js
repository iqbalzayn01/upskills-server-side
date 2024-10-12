const mongoose = require('mongoose');
const Registration = require('../registration/model');
const Event = require('../events/model');

let paymentSchema = new mongoose.Schema(
  {
    id_payment: {
      type: String,
      unique: true,
    },
    registrationID: {
      type: mongoose.Types.ObjectId,
      ref: 'Registration',
      required: true,
    },
    total_payment: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// paymentSchema.pre('save', async function (next) {
//   if (this.isNew || this.isModified('registrationID')) {
//     try {
//       const registration = await Registration.findById(
//         this.registrationID
//       ).populate('eventID');
//       if (!registration) {
//         throw new Error('Registration not found');
//       }
//       const event = await Event.findById(registration.eventID);
//       if (!event) {
//         throw new Error('Event not found');
//       }
//       this.total_payment = event.price;
//       next();
//     } catch (err) {
//       next(err);
//     }
//   } else {
//     next();
//   }
// });

paymentSchema.pre('save', async function (next) {
  const Payment = this;

  if (Payment.isNew) {
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = 'PY';

    try {
      const lastPayment = await this.constructor.findOne(
        {},
        {},
        { sort: { createdAt: -1 } }
      );
      let sequentialNumber = '001';

      if (lastPayment) {
        const lastSequentialNumber = parseInt(lastPayment.id_payment.slice(-3));
        sequentialNumber = (lastSequentialNumber + 1)
          .toString()
          .padStart(3, '0');
      }

      Payment.id_payment = `${prefix}${year}${sequentialNumber}`;
    } catch (error) {
      return next(error);
    }
  }

  if (Payment.isNew || Payment.isModified('registrationID')) {
    try {
      const registration = await Registration.findById(
        Payment.registrationID
      ).populate('eventID');
      if (!registration) {
        throw new Error('Registration not found');
      }
      const event = await Event.findById(registration.eventID);
      if (!event) {
        throw new Error('Event not found');
      }
      Payment.total_payment = event.price;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
