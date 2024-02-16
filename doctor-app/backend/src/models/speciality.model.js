const mongoose = require("mongoose");

const specialistSchema = new mongoose.Schema(
  {
    name: { type: String },
    image:{type:String,},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Declaring model for plan
const Specialist = mongoose.model("specialist", specialistSchema);
module.exports = Specialist;
