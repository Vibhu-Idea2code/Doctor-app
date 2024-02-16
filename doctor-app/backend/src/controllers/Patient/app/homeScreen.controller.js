/* --------------------------- PATIENT HOME SCREEN -------------------------- */

const { Doctor, Specialist, AppointmentBook, Patient } = require("../../../models");
// const {successResponse}=require("../../../helpers/sendresponse")


/* ----------------------------- All Doctor List Rating Wise Filter ----------------------------- */
const allDoctorList = async (req, res) => {
  try {
    // Fetch all doctors along with their ratings and specialities
    const doctorsData = await Doctor.aggregate([
      {
        $lookup: {
          from: "appointmentbooks",
          localField: "_id",
          foreignField: "doctorid",
          as: "appointments",
        },
      },
      {
        $lookup: {
          from: "specialists",
          localField: "specialist",
          foreignField: "_id",
          as: "specialistInfo",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          speciality: "$specialistInfo.name",
          // Calculate average rating
          averageRating: {
            $avg: "$appointments.rating",
          },
        },
      },
      {
        // Sort by rating in descending order
        $sort: {
          averageRating: -1,
        },
      },
    ]);

    // If no doctors found, return 404
    if (!doctorsData || doctorsData.length === 0) {
      return res.status(404).json({ message: "Doctor list not found" });
    }

    // Add sorting for doctors with no ratings
    const doctorsWithRatings = doctorsData.filter((doctor) => doctor.averageRating !== null);
    const doctorsWithoutRatings = doctorsData.filter((doctor) => doctor.averageRating === null);

    const sortedDoctors = [...doctorsWithRatings, ...doctorsWithoutRatings];

    const baseUrl =
      req.protocol +"://" +req.get("host") +process.env.BASE_URL_PROFILE_PATH;

    res.status(200).json({
      success: true,
      message: "Doctor data fetched successfully",
      doctors: sortedDoctors,
      baseUrl: baseUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -------------- All Specilaist List At Home Screen Of Patient ------------- */

const allSpecialList = async (req, res) => {
  try {
    const userData = await Specialist.find();

    if (!userData) {
      return res.status(404).json({ message: "User list ata not found" });
    }

    res.status(200).json({
      success: true,
      message: "user data get successfully ",
      user: userData,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
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
          message: "No matching doctors or specialists found for the given query.",
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
  

module.exports = {
  allDoctorList,
  allSpecialList,
  searchDoctorSpecialist,
};
