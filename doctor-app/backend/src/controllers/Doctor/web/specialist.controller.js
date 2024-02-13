const mongoose = require("mongoose");
const Specialist = require("../../../models/speciality.model");

const createspecialist = async (req, res) => {
  try {
    const reqBody = req.body;
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
module.exports = { createspecialist };
