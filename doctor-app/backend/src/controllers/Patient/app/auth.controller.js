const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const jwtSecrectKey = "cdccsvavsvfssbtybnjnuki";
// const otpGenerator = require("otp-generator");
const { patientService } = require("../../../services");
const { Doctor, Patient } = require("../../../models");

/* -------------------------- REGISTER/CREATE USER -------------------------- */
const register = async (req, res) => {
  // const { email, password, role } = req.body;
  try {
    const { email, password, name, confirmPassword, phoneNumber } = req.body;
    const reqBody = req.body;
    const existingUser = await patientService.findPatientByEmail(reqBody.email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }
    const hashPassword = await bcrypt.hash(password, 8);
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }
    let option = {
      email,

      exp: moment().add(1, "days").unix(),
    };

    const token = await jwt.sign(option, jwtSecrectKey);

    const filter = {
      email,
      name,
      password: hashPassword,
      token,
      phoneNumber,
    };
    const data = await patientService.createPatient(filter);
    res.status(200).json({ success: true, data: data });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

/* -------------------------- LOGIN/SIGNIN USER  0-new 1-already -------------------------- */
const login = async (req, res) => {
  try {
    const { name, password } = req.body; // Assuming "identifier" can be either email or name
    const patient = await Patient.findOne({ name });
    if (!patient) throw Error("User not found");

    const successPassword = await bcrypt.compare(password, patient.password);
    if (!successPassword) throw Error("Incorrect password");

    const payload = {
      _id: patient._id,
      email: patient.email,
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1m",
    });
    
    patient.token = token;
    const refreshToken = await jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET_KEY
    );
    const output = await patient.save();
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
    const findpatient = await patientService.findPatientByPhone(phoneNumber);

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    findpatient.otp = {
      value: otp,
      expiration: expirationTime,
    };

    // Save the OTP in the user document
    findpatient.otp = otp; //otp is user model key name
    await findpatient.save();

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

    const doctor = await Patient.findOne({ phoneNumber });

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
    } else {
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

const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, id } = req.body;

    console.log(id);

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }
    let patient = await Patient.findById(id);
    // Checking if the user is in the database or not
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "User does not exist!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset successfully!",
      data: patient,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const country = async (req, res) => {
  try {
    const { id} = req.body;

    console.log(id);

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }
    let patient = await Patient.findById(id);
    // Checking if the user is in the database or not
    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "User does not exist!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset successfully!",
      data: patient,
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
  resetPassword,country
};
