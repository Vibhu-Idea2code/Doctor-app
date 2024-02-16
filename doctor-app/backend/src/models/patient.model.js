const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: { type: String ,trim:true},
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
    // patientImag: { type: String },
    age: { type: Number,default: null },
    weight: { type: Number,default: null },
    image: { type: String },
    specialist: { type: mongoose.Schema.Types.ObjectId, ref: "specialist" },
    city: { type: String },
    bloodgroup:{ type: String},
    country: { type: mongoose.Schema.Types.ObjectId, ref: "country" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Declaring model for plan
const Patient = mongoose.model("patient", patientSchema);
module.exports = Patient;
