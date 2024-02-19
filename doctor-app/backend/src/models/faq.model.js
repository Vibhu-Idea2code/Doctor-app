const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    name: { type: String },
    ans:{type:String},
    status:{type:Boolean,default:0}
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Declaring model for plan
const Faq = mongoose.model("faq", faqSchema);
module.exports = Faq;

    // STATUS MANGE ::: TRUE-0-doctorId AND FALSE-1-patientId
