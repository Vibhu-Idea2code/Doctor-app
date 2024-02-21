/* --------------------------- PATIENT HOME SCREEN -------------------------- */

const {
  Doctor,
  Specialist,
  AppointmentBook,
  Patient,
} = require("../../../models");
// const {successResponse}=require("../../../helpers/sendresponse")

/* ----------------------------- All Doctor List Rating Wise Filter ----------------------------- */

const allPatientAppointmentList = async (req, res) => {
  try {
    const { doctorid, appointmentdate } = req.body;

    // Check if both doctorid and appointmentdate are provided in the request body
    if (!doctorid || !appointmentdate) {
      return res.status(400).json({
        message:
          "Both doctorid and appointmentdate are required in the request body",
      });
    }

    // Query the AppointmentBook model based on the provided doctorid and appointmentdate
    const userData = await AppointmentBook.find({ doctorid, appointmentdate })
      .populate({
        path: "doctorid",
        select: "name image", // Specify the fields you want to populate
      })
      .populate({
        path: "patientid",
        select:
          "name age image weight bloodgroup city phoneNumber symptoms gender", // Specify the fields you want to populate
      });

    if (!userData || userData.length === 0) {
      return res.status(404).json({
        message:
          "User data not found for the provided doctorid and appointmentdate",
      });
    }

    res.status(200).json({
      success: true,
      message: "List of User Data successfully ",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const PatientAppointmentList = async (req, res) => {
  try {
    const { doctorid } = req.body;

    // Check if both doctorid and appointmentdate are provided in the request body
    if (!doctorid) {
      return res.status(400).json({
        message:
          "Both doctorid and appointmentdate are required in the request body",
      });
    }

    // Query the AppointmentBook model based on the provided doctorid and appointmentdate
    const userData = await AppointmentBook.find({ doctorid })
      .populate({
        path: "doctorid",
        select: "name image", // Specify the fields you want to populate
      })
      .populate({
        path: "patientid",
        select:
          "name age image weight bloodgroup city phoneNumber symptoms gender", // Specify the fields you want to populate
      });

    if (!userData || userData.length === 0) {
      return res.status(404).json({
        message:
          "User data not found for the provided doctorid and appointmentdate",
      });
    }

    res.status(200).json({
      success: true,
      message: "List of User Data successfully ",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const allPatientAppointmentListReview = async (req, res) => {
  try {
    const { doctorid } = req.body;

    // Check if both doctorid and appointmentdate are provided in the request body
    if (!doctorid) {
      return res.status(400).json({
        message:
          "Both doctorid and appointmentdate are required in the request body",
      });
    }

    // Query the AppointmentBook model based on the provided doctorid and appointmentdate
    const userData = await AppointmentBook.find({ doctorid })
      .populate({
        path: "doctorid",
        select: "name", // Specify the fields you want to populate
      })
      .populate({
        path: "patientid",
        select: "name  image", // Specify the fields you want to populate
      })
      .select("review rating");

    if (!userData || userData.length === 0) {
      return res.status(404).json({
        message:
          "User data not found for the provided doctorid and appointmentdate",
      });
    }

    res.status(200).json({
      success: true,
      message: "List of User Data successfully ",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* --------------  reschedule appointment of pateint  by doctor  ------------- */
// Update appointment by ID
const updateAppointmentByDoctor = async (req, res) => {
  try {
    const appointment = await AppointmentBook.findByIdAndUpdate(
      req.body.id,
      req.body,
      { new: true }
    );
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, error: "Appointment not found" });
    }
    res.status(200).json({
      success: true,
      status: 200,
      message: "update review and rating done",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
/* --------------  reschedule appointment of pateint  by doctor  ------------- */
// Update appointment by ID
const updateAppointmentStatusByDoctor = async (req, res) => {
  try {
    const appointment = await AppointmentBook.findByIdAndUpdate(
      req.body.id,
      req.body,
      { new: true }
    );
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, error: "Appointment not found" });
    }
    res.status(200).json({
      success: true,
      status: 200,
      message: "update status done",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ----------------------------- Get particuler News search data ----------------------------- */
const searchDoctorSpecialist = async (req, res) => {
  try {
    const { query } = req.query;

    // Check if query parameter is provided
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is missing.",
      });
    }

    // Use a regular expression for case-insensitive search
    const regex = new RegExp(query, "i");

    // Search in Doctor model
    const doctorResults = await Doctor.find({
      city: regex, // Adjust to match the field you are searching against
    });

    // Search in Specialist model
    const specialistResults = await Specialist.find({
      name: regex, // Adjust to match the field you are searching against
    });

    // Combine the results from both models
    const combinedResults = [...doctorResults, ...specialistResults];

    if (combinedResults.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No matching doctors or specialists found for the given query.",
      });
    }

    // If results are found, return a success response with the combined search results
    res.status(200).json({
      success: true,
      message: "Search data retrieved successfully.",
      searchResults: combinedResults,
    });
  } catch (error) {
    console.error("Error in searchDoctorSpecialist:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// const Patient = require('./models/Patient'); // Import your Patient model

const searchPatientlist = async (req, res) => {
  try {
    const { query } = req.query;

    // Check if query parameter is provided
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is missing.",
      });
    }

    // Use regular expression for case-insensitive search
    const regex = new RegExp(query, "i");

    // Search for patients based on the provided query
    const patients = await Patient.find({ name: regex });

    if (patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No patients found matching the query.",
      });
    }

    // Return the found patients
    return res.status(200).json({
      success: true,
      message: "Patients found.",
      data: patients,
    });
  } catch (error) {
    // Handle any errors that occur during the search
    console.error("Error searching patients:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  //   allDoctorList,
  allPatientAppointmentList,
  updateAppointmentByDoctor,
  searchDoctorSpecialist,
  updateAppointmentStatusByDoctor,
  PatientAppointmentList,
  allPatientAppointmentListReview,
  searchPatientlist,
};
