const mongoose = require("mongoose");
const Help = require("../../../models/help.model");
const ejs = require("ejs");
const path = require("path");
const { emailService, doctorService, patientService } = require("../../../services");
const { Patient, Doctor } = require("../../../models");

const createHelp = async (req, res) => {
  try {
    // Retrieve patient details using patientId
    const user = await Patient.findById(req.body.pateintId);
    if (!user) {
      throw new Error("Patient not found.");
    }

    // Log the user object to see its contents
    console.log("User:", user);

    // Create a new help record
    const newHelp = await new Help({
      pateintId: req.body.pateintId,
      question: req.body.question,
    }).save();

    // Render email template
    ejs.renderFile(
      path.join(__dirname, "../../../views/help.ejs"),
      {
        name: user.name,
        email: user.email, // Pass the email variable
        question: req.body.question,
      },
      async (err, data) => {
        if (err) {
          console.error("Error rendering EJS template:", err);
          // Handle error
        } else {
          try {
            // Assuming you have user.email
            const email = user.email;
            // Send email
            await emailService.sendMail(email, data, "Verify Email");
          } catch (error) {
            console.error("Error sending email:", error);
            // Handle error
          }
        }
      }
    );

    res.status(200).json({
      message: "Successfully created a new help",
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


module.exports = { createHelp };
