const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema(
  {
    name: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Declaring model for plan
const Disease = mongoose.model("disease", diseaseSchema);
module.exports = Disease;
