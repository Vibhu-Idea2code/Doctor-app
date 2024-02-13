const path = require("path");
const fs = require("fs");
const { patientService } = require("../../../services");
const { Patient } = require("../../../models");

/* ----------------------------- update user profile ----------------------------- */
const updatepatientProfile = async (req, res) => {
  try {
    const reqbody = req.body;

    if (req.file) {
      reqbody.image = req.file.filename;
    }

    const patient = await Patient.findById(reqbody.patientId);

    if (!patient) {
      throw new Error(` patientId ${reqbody.patientId} not found`);
    }
       // Concatenate first name and last name
       const fullName = reqbody.first_name + ' ' + reqbody.last_name;
       reqbody.name = fullName;
   

    // Update user data in the database
    const isUpdate = await Patient.findByIdAndUpdate(
      reqbody.patientId,
      {
        $set: reqbody,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      updateData: isUpdate,
      message: "update successfully",
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  updatepatientProfile,
};
