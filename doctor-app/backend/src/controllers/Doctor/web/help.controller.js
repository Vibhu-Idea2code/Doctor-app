const mongoose = require("mongoose");
const Help = require("../../../models/help.model");

const createHelp = async (req, res) => {
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

    const help = await Help.create(reqBody);

    if (!help) {
      throw new Error("Failed to create help");
    }
    ejs.renderFile(
      path.join(__dirname, "../../../views/otp-template.ejs"),
      {
        email: email,
        help: help,
      },
      async (err, data) => {
        if (err) {
          let userCreated = await Help.findOne(email)
          if (userCreated) {
            // await  Doctor.findOne({email});
          }
          // throw new Error("Something went wrong, please try again.");
        } else {
          emailService.sendMail(email, data, "Verify Email");
        }
      }
    );
    res.status(200).json({
      message: "Successfully created a new help",
      success: true,
      data: help,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { createHelp };


