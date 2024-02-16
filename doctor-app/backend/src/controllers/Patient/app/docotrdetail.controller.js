const path = require("path");
const fs = require("fs");
const { doctorService } = require("../../../services");
const { Doctor, AppointmentBook } = require("../../../models");

const allDoctorListById = async (req, res) => {
  try {
    const reqbody = req.body;

    const doctorDetails = await Doctor.findById(reqbody.doctorId)
      .populate("specialist", "name")
      .select("name");

    if (!doctorDetails) {
      throw new Error("Doctor not found!");
    }

    const appointmentDetails = await AppointmentBook.find({
      doctorid: reqbody.doctorId,
    }).populate({
      path: "patientid",
      select: "name image", // Select the fields you want to populate
    }) .select("rating review doctorid patientid");;

    res.status(200).json({
      success: true,
      message: "Doctor details and appointments retrieved successfully!",
      data: {
        doctor: doctorDetails,
        appointments: appointmentDetails,
      },
    });
  } catch (error) {
    res.status(error?.statusCode || 400).json({
      success: false,
      message:
        error?.message || "Something went wrong, please try again or later!",
    });
  }
};

module.exports = {
  allDoctorListById,
};
