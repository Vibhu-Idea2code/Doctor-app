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
    })
      .populate({
        path: "patientid",
        select: "name image", // Select the fields you want to populate
      })
      .select("rating review doctorid patientid");

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

// const Doctor = require('./doctorModel'); // Assuming you have a Doctor model defined
// const AppointmentBook = require('./appointmentBookModel');

const doctorByIdDetails = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const appointments = await AppointmentBook.find({
      doctorid: doctorId,
    }).populate("doctorid", "name specialist review rating");
    // .select('review rating');

    if (!appointments) {
      throw new Error("No appointments found for this doctor!");
    }

    res.status(200).json({
      success: true,
      message: "Doctor details retrieved successfully!",
      data: appointments.map((appointment) => ({
        name: appointment.doctorid.name,
        specialist: appointment.doctorid.specialist,
        review: appointment.review,
        rating: appointment.rating,
      })),
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  allDoctorListById,
  doctorByIdDetails,
};
