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
    image:{ type: String},
    specialist:{type: mongoose.Schema.Types.ObjectId, ref: "specialist" },
    city: { type: String },
    //   specialty: { type: "array", items: { $ref: "#/components/schemas/Specialty" } },
    //   availableHours: {
    //     type: "array",
    //     items: {
    //       type: "object",
    //       properties: {
    //         day: { type: "number", enum: [0,1,2,3,4,5,6] }, // 0 - Domingo / 1 - Segunda-feira ... etc
    //         from: { type: "string", format: "HH:mm:ss" },
    //         to: { type: "string", format: "HH:mm:ss" }
    //       }
    //     }
    //   },
    //   patient:{type:"ObjectId", ref:"Patient"}
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Declaring model for plan
const Doctor = mongoose.model("doctor", doctorSchema);
module.exports = Doctor;
