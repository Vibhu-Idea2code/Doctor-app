/* ------------------------------- DEFINE AREA ------------------------------ */
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const jwtSecrectKey = "cdccsvavsvfssbtybnjnuki";
// const otpGenerator = require("otp-generator");
const { doctorService, emailService } = require("../../../services");
const { Doctor } = require("../../../models");
const ejs = require("ejs");
const path = require("path");

/* ---------------------- NOTE :ALL DETAIL ABOUT ONLY DOCTOR --------------------- */
/* -------------------------- REGISTER/CREATE DOCTOR -------------------------- */
const register = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      phoneNumber,
      confirmPassword,
      city,
      fcm_token,
    } = req.body;

    // Check if required fields are missing
    if (
      !email ||
      !password ||
      !name ||
      !phoneNumber ||
      !confirmPassword ||
      !city
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    // Check if user with the same email already exists
    const existingUser = await doctorService.findDoctorByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 8);

    // JWT token creation
    let option = {
      email,
      exp: moment().add(1, "days").unix(),
    };
    const token = await jwt.sign(option, process.env.JWT_SECRET_KEY);

    // Generate refresh token
    const refreshToken = await jwt.sign(option, process.env.JWT_REFRESH_SECRET_KEY);

    // Prepare data for creating doctor
    const filter = {
      email,
      name,
      phoneNumber,
      password: hashPassword,
      token,
      refreshToken, // Include refresh token in the data
      city,
      fcm_token,
    };

    // Create doctor
    const data = await doctorService.createDoctor(filter);

    // Respond with success message
    res.status(200).json({
      success: true,
      message: "Doctor registered successfully",
      status: 200,
      data: data,
      refreshToken: refreshToken, // Include refresh token in the response
    });
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: err.message });
  }
};


/* -------------------------- LOGIN/SIGNIN DOCTOR  0-new 1-already -------------------------- */
const login = async (req, res) => {
  try {
    const { email, password, fcm_token } = req.body; // Assuming "identifier" can be either email or name
    // const doctor = await Doctor.findOne({
    //   $or: [{ email: identifier }, { name: identifier }],
    // });
    const doctor = await Doctor.findOne({ email });
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
    doctor.fcm_token = fcm_token;
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
      message: "login successful",
      status: 200,
      success: true,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

//   /* -------------------------- LOGIN WITH PHONE NUMBER WITH OTP  -------------------------- */
const forgotPass = async (req, res) => {
  try {
    const { email, name } = req.body;
    const findUser = await doctorService.findDoctorByEmail(email);
    // console.log(findUser);
    if (!findUser) throw Error("User not found");
    const otp = ("0".repeat(4) + Math.floor(Math.random() * 20 ** 5)).slice(-4);
    findUser.otp = otp;
    await findUser.save();
    ejs.renderFile(
      path.join(__dirname, "../../../views/otp-template.ejs"),
      {
        email: email,
        otp: otp,
        name: name,
      },
      async (err, data) => {
        if (err) {
          let userCreated = await doctorService.findDoctorByEmail(email);
          if (userCreated) {
            // await  Doctor.findOne({email});
          }
          // throw new Error("Something went wrong, please try again.");
        } else {
          emailService.sendMail(email, data, "Verify Email");
        }
      }
    );
    res.status(200).json({
      success: true,
      message: "User login successfully!",
      // data: { data },
      data: `user otp is stored ${otp}`,
      status: 200,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
/* ------------------------------- VERIFY OTP ------------------------------- */
const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const doctor = await Doctor.findOne({ email });

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
    // console.error(error);
    res.status(500).json({ error: error.message });
  }
};
/* ----------------------------- RESET PASSWORD ----------------------------- */
const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, id } = req.body;

    // console.log(id);

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "New password and confirm password do not match.",
      });
    }
    let doctor = await Doctor.findById(id);
    // Checking if the user is in the database or not
    if (!doctor) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User does not exist!",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Password reset successfully!",
      data: doctor,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
/* ----------------------------- CHANGE PASSWORD ---------------------------- */
const changePassword = async (req, res) => {
  try {
    const { oldpass, newpass, confirmpass, doctorId } = req.body; // assuming patientId is provided in the request body
    // console.log(req.body, "++++++++++++++");

    // Find the patient by their ID
    const doctor = await Doctor.findById(doctorId);
    // console.log(doctor, "++++++++++++++++++++++++++++++++");
    if (!doctor) {
      return res
        .status(404)
        .json({ status: 404, success: false, error: "doctor not found" });
    }

    // Verify the old password
    const isPasswordCorrect = await bcrypt.compare(oldpass, doctor.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ status: 401, success: false, error: "Incorrect old password" });
    }

    // Check if the new password and confirm password match
    if (newpass !== confirmpass) {
      return res.status(400).json({
        status: 400,
        success: false,
        error: "New password and confirm password do not match",
      });
    }

    // Hash the new password and update it in the database
    const hashedPassword = await bcrypt.hash(newpass, 8);
    doctor.password = hashedPassword;
    await doctor.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  forgotPass,
  verifyOtp,
  login,
  resetPassword,
  changePassword,
};
