const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
  
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
const Favorite = mongoose.model(
  "favorite",
  favoriteSchema
);
module.exports = Favorite;
