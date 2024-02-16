const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    token: { type: String },
    phoneNumber: { type: Number },
    refreshToken: { type: String },
    otp: { type: String },
    otpExpiry: { type: String },
    expiration: { type: Date },
    gender: {
      type: String,
    },
    // video,voice,message all are required
    videocallPrice: { type: String },
    messagecallPrice: { type: String },
    voicecallPrice: { type: String },
    image: { type: String },
    specialist: { type: mongoose.Schema.Types.ObjectId, ref: "specialist" },
    city: { type: String },
    rating: { type: mongoose.Schema.Types.ObjectId, ref: "appointmentbook" },
  
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Declaring model for plan
const Doctor = mongoose.model("doctor", doctorSchema);
module.exports = Doctor;
