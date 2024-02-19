const mongoose = require("mongoose");

const helpSchema = new mongoose.Schema(
  {
    help: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Declaring model for plan
const Help = mongoose.model("help", helpSchema);
module.exports = Help;

// STATUS MANGE ::: TRUE-0-doctorId AND FALSE-1-patientId
