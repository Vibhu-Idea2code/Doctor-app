const mongoose = require("mongoose");

const appointmentBookSchema = new mongoose.Schema(
  {
    uniqueid: { type: String },
    symptoms:{ type: String,},
    appointmentdate: {
      type: Date,
    },
    appointmenttime: {
      type: Date,
    },
    //message-1,voice-2,video-3
    packgeid: { type: String },
    //amount
    paymentamount: { type: Number, default: 0 },
    //paid or pending or fail
    paymentstatus: { type: String, default: "0" },
    // upcomming or cancele or complete or  pending
    appointmentstatus: { type: String, default: "0" },
    cancelreason: { type: String, default: "null" },
    reschedulereason: { type: String, default: "null" },
    review: { type: String, default: "null" },
    rating: { type: Number },
    // yes no
    recommendStatus: { type: Boolean, default: false },
    patientid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
    },
    doctorid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Declaring model for plan
const AppointmentBook = mongoose.model(
  "appointmentbook",
  appointmentBookSchema
);
module.exports = AppointmentBook;
