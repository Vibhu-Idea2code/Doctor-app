const mongoose = require("mongoose");
const Faq = require('../../../models/faq.model');

const createFaq = async (req, res) => {
  try {
    const reqBody = req.body;


    // STATUS MANGE ::: TRUE-0-doctorId AND FALSE-1-patientId


    // Determine the ID type and set status accordingly
    let status;
    if (reqBody.doctorId) {
      status = 0; // Assuming doctorId is present
    } else if (reqBody.patientId) {
      status = 1; // Assuming patientId is present
    } else {
      throw new Error("Either doctorId or patientId must be provided");
    }
    
    // Add the status to the request body
    reqBody.status = status;

    const faq = await Faq.create(reqBody);
    if (!faq) {
      throw new Error("Failed to create faq");
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

module.exports = { createFaq };
