const mongoose = require("mongoose");

// const Disease  = require("../../../models");
// Import the Disease model
const Disease = require('../../../models/disease.model');

// Define the createDisease function
const createDisease = async (req, res) => {
  try {
    const reqBody = req.body;
    console.log(reqBody, "++++++Disease");
    const disease = await Disease.create(reqBody); // Using the create function
    if (!disease) {
      throw new Error("No such Disease");
    }
    res.status(200).json({
      message: "Successfully created a new Disease",
      success: true,
      data: disease,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// module.exports = createDisease;


module.exports = { createDisease };
