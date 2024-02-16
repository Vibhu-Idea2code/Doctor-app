const mongoose = require("mongoose");
const Specialist = require("../../../models/speciality.model");

const createspecialist = async (req, res) => {
  try {
    const reqBody = req.body;
    if (req.file) {
      reqBody.image = req.file.filename;
    }
    console.log(reqBody, "++++++specilalist");
    const specialist = await Specialist.create(reqBody);
    if (!specialist) { 
      throw new Error("no such specialist");
    }
    res.status(200).json({
      message: "Successfully created a new specialist",
      success: true,
      data: specialist,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
  
const updatespecialistProfile = async (req, res) => {
  try {
    const reqbody = req.body;

    if (req.file) {
      reqbody.image = req.file.filename;
    }

    const specialist = await Specialist.findById(reqbody.specialistId);

    if (!specialist) {
      throw new Error(` specialistId ${reqbody.specialistId} not found`);
    }
  
    // Update user data in the database
    const isUpdate = await Specialist.findByIdAndUpdate(
      reqbody.specialistId,
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

// const getPetsList = async (req, res) => {
//   try {
//     let pets = await petsService.getPetsList(req, res);
//     res.status(200).json({
//       message: "successfully fetched all Pets",
//       status: true,
//       data: pets,
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };
module.exports = { createspecialist,updatespecialistProfile };
