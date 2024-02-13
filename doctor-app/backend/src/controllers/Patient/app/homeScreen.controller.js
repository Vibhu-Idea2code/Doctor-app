const { Doctor, Specialist } = require("../../../models");

/* ----------------------------- Get USER data ----------------------------- */
const allDoctorList = async (req, res) => {
  try {
    const userData = await Doctor.find();

    if (!userData) {
      return res.status(404).json({ message: "User list ata not found" });
    }

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_PROFILE_PATH;

    res.status(200).json({
      success: true,
      message: "user data get successfully ",
      user: userData,
      baseUrl: baseUrl,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const allSpecialList = async (req, res) => {
  try {
    const userData = await Specialist.find();

    if (!userData) {
      return res.status(404).json({ message: "User list ata not found" });
    }

    //   const baseUrl =
    //     req.protocol +
    //     "://" +
    //     req.get("host") +
    //     process.env.BASE_URL_PROFILE_PATH;

    res.status(200).json({
      success: true,
      message: "user data get successfully ",
      user: userData,
      // baseUrl: baseUrl,
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
