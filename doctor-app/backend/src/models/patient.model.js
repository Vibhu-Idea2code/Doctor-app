const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    token: { type: String },
    phoneNumber: { type: Number },
    refreshToken: { type: String },
    otp: { type: String, default: null },
    otpExpiry: { type: String },
    expiration: { type: Date },
    gender: {
      type: String,
    },
    patirntImag: { type: String },
    age: { type: Number },

    image: { type: String },
    specialist: { type: mongoose.Schema.Types.ObjectId, ref: "specialist" },
    city: { type: String },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "country" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Declaring model for plan
const Patient = mongoose.model("patient", doctorSchema);
module.exports = Patient;
