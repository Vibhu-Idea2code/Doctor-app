const path = require("path");
const fs = require("fs");
const { doctorService } = require("../../../services");
const { Doctor } = require("../../../models");

/* ----------------------------- Get admin list ------------*/
/* ----------------------------- update user profile ----------------------------- */
const updateDocProfile = async (req, res) => {
  try {
    const reqbody = req.body;

    if (req.file) {
      reqbody.image = req.file.filename;
    }

    const user = await Doctor.findById(reqbody.doctorId);

    if (!user) {
      throw new Error(`User with doctorId ${reqbody.doctorId} not found`);
    }
    // Concatenate first name and last name
    const fullName = reqbody.first_name + " " + reqbody.last_name;
    reqbody.name = fullName;

    // Update user data in the database
    const isUpdate = await Doctor.findByIdAndUpdate(
      reqbody.doctorId,
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
  updateDocProfile,
  
};
