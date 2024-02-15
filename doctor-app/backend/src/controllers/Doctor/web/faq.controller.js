const mongoose = require("mongoose");

// const Disease  = require("../../../models");
// Import the Disease model
const Faq = require('../../../models/faq.model');

// Define the createDisease function
const createFaq = async (req, res) => {
  try {
    const reqBody = req.body;
    console.log(reqBody, "++++++Disease");
    const faq = await Faq.create(reqBody); // Using the create function
    if (!faq) {
      throw new Error("No such faq");
    }
    res.status(200).json({
      message: "Successfully created a new faq",
      success: true,
      data: faq,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// module.exports = createfaq;


module.exports = { createFaq };
