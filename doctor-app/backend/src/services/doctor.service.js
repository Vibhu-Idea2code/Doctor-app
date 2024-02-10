// const Category = require("../models/category.model");
const Doctor = require("../models/doctor.model");

/**
 * Create user
 * @param {object} reqBody
 * @returns {Promise<User>}
 */
const createDoctor = async (reqBody) => {
  return Doctor.create(reqBody);
};

const findDoctorByEmail = async (email) => {
    return  Doctor.findOne({ email });
};

const findDoctorByPhone = async (phoneNumber) => {
    return  Doctor.findOne({ phoneNumber });
  };

  const updatePassword = async (doctorId, newPassword) => {
    return Doctor.findByIdAndUpdate(doctorId, { password: newPassword });
  };
module.exports = {
    createDoctor,
    findDoctorByEmail,findDoctorByPhone,updatePassword
};
