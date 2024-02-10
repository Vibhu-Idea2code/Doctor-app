const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const jwtSecrectKey = "cdccsvavsvfssbtybnjnuki";
// const otpGenerator = require("otp-generator");
const { doctorService } = require("../../../services");
const { Doctor } = require("../../../models");

/* -------------------------- REGISTER/CREATE USER -------------------------- */
const register = async (req, res) => {
  // const { email, password, role } = req.body;
  try {
    const { email, password, name, phoneNumber } = req.body;
    const reqBody = req.body;
    const existingUser = await doctorService.findDoctorByEmail(reqBody.email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }
    const hashPassword = await bcrypt.hash(password, 8);

    let option = {
      email,

      exp: moment().add(1, "days").unix(),
    };

    const token = await jwt.sign(option, jwtSecrectKey);

    const filter = {
      email,

      name,
      phoneNumber,
      password: hashPassword,
      token,
    };
    const data = await doctorService.createDoctor(filter);
    res.status(200).json({ success: true, data: data });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

/* -------------------------- LOGIN/SIGNIN USER  0-new 1-already -------------------------- */
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // Assuming "identifier" can be either email or name
    const doctor = await Doctor.findOne({
      $or: [{ email: identifier }, { name: identifier }],
    });
    if (!doctor) throw Error("User not found");

    const successPassword = await bcrypt.compare(password, doctor.password);
    if (!successPassword) throw Error("Incorrect password");

    const payload = {
      _id: doctor._id,
      email: doctor.email,
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1m",
    });

    doctor.token = token;
    const refreshToken = await jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET_KEY
    );
    const output = await doctor.save();
    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_PROFILE_PATH;

    res.status(200).json({
      data: output,
      token: token,
      refreshToken: refreshToken,
      baseUrl: baseUrl,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

//   /* -------------------------- LOGIN WITH PHONE NUMBER WITH OTP  -------------------------- */
const forgotPass = async (req, res, next) => {
    try {
      const { phoneNumber } = req.body;
      const findDoctor = await doctorService.findDoctorByPhone(phoneNumber);
  
      if (!findDoctor) throw Error("0");
  
//       const otpExpiry = new Date();
//       otpExpiry.setMinutes(otpExpiry.getMinutes() + 2); // Expiry set to 2 minutes instead of 5
//       const otp = Math.floor(1000 + Math.random() * 3000);
//       findDoctor.otp = otp;
//       findDoctor.expireOtpTime = otpExpiry; // Set expiry time to the calculated time
//   console.log(otpExpiry)
//       await findDoctor.save();

      const otp = Math.floor(100000 + Math.random() * 900000);
      const expirationTime = new Date(Date.now() + 5  *60 * 1000); // 5 minutes expiration
  
      findDoctor.otp = {
        value: otp,
        expiration: expirationTime,
      };
  
      // Save the OTP in the user document
      findDoctor.otp = otp; //otp is user model key name
      await findDoctor.save();
      
  
      res.status(200).json({
        status: 200,
        success: true,
        message: `OTP sent successfully ${otp}`,
      });
    } catch (err) {
      res.json({ message: err.message });
    }
  };
  
  const verifyOtp = async (req, res) => {
    try {
      const { otp, phoneNumber } = req.body;
  
      const doctor = await Doctor.findOne(phoneNumber);
  
      // Check if user exists
      if (!doctor) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Doctor not found",
        });
      }
  
      // Compare OTP
      if (doctor.otp === otp) {
        return res.status(200).json({
          status: 200,
          success: true,
          message: "OTP verification successful",
        });
      }
       else {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Invalid OTP",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  

// const resendOtp=async(req,res)=>{
//     const doctor = await Doctor.findOne({ email: req.body.email });

// }

const resetPassword = async (req, res) => {
    try {
      const {  newPassword, confirmPassword, id } = req.body;
  
      console.log(id);
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "New password and confirm password do not match.",
        });
      }
      const doctor = await Doctor.findOne(otp);
  
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "doctor not found.",
        });
      }
  
      // Verify OTP
      const checkotp = await Doctor.findOne({
        _id: req.body.id,
      });
      if (!checkotp)
        return queryErrorRelatedResponse(req, res, 401, { otp: "Invalid OTP!" });
  
      const hashPassword = await bcrypt.hash(newPassword, 8);
      await doctorService.updatePassword(doctor._id, hashPassword);

      // Optionally, you can add more password validation logic here.
      res.status(200).json({
        success: true,
        message: "Password reset successfully!",
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

module.exports = {
  register,
  forgotPass,
  verifyOtp,
  login,
  resetPassword
//   resendOtp,
};
