const path = require("path");
const fs = require("fs");
const { patientService } = require("../../../services");
const { Patient } = require("../../../models");
const userHelper = require("../../../helpers/userHelper");
const deleteFiles = require("../../../helpers/deletefile");

/* ----------------------------- update user profile ----------------------------- */
const updatepatientProfile = async (req, res) => {
  try {
    const reqbody = req.body;
  // If there's a file uploaded, remove any existing image first
  if (req.file) {
    const user = await Patient.findById(reqbody.patientId);
    if (user && user.image) {
      // Delete the existing image
      const imagePath = path.join(__dirname, "/../../../public/patientImag", user.image);
      console.log("imagePath:", imagePath); // Debug log
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Existing image deleted successfully."); // Debug log
      } else {
        console.log("Existing image not found at path:", imagePath); // Debug log
      }
    }
    reqbody.image = req.file.filename;
  }

    const patient = await Patient.findById(reqbody.patientId);

    if (!patient) {
      throw new Error(` patientId ${reqbody.patientId} not found`);
    }
    // Concatenate first name and last name
    const fullName = reqbody.first_name + " " + reqbody.last_name;
    reqbody.name = fullName;

    const age = userHelper.calculateAge(reqbody.birthDate);
    reqbody.age = age;
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
/* -------------------------- DLETE PATIENT PROFILE ------------------------- */
const deletePatient = async (req, res) => {
  try {
    const userData = await Patient.findById(req.params.patientId);

    if (!userData) {
      return res.status(404).json({ message: "User Data not found" });
    }
    const DeletedData = await Patient.findByIdAndDelete(
      req.params.patientId,
      req.body,
      {
        new: true,
      }
    );

    deleteFiles("patientImag/" + userData.image);

    res.status(200).json({
      success: true,
      message: "List of User Data successfully ",
      user: DeletedData,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  updatepatientProfile,
  deletePatient,
};
