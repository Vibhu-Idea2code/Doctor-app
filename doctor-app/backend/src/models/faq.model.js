const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    name: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Declaring model for plan
const Faq = mongoose.model("faq", faqSchema);
module.exports = Faq;
