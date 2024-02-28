const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const jwtSecrectKey = "cdccsvavsvfssbtybnjnuki";
// const otpGenerator = require("otp-generator");
const { patientService,emailService } = require("../../../services");
const { patient, Patient } = require("../../../models");
const ejs = require("ejs");
const path = require("path");

/* -------------------------- REGISTER/CREATE PATIENT -------------------------- */
const register = async (req, res) => {
  try {
    const { email, password, name, confirmPassword, phoneNumber } = req.body;
    
    // Validate email format
    if (!isValidEmail(email)) {
      throw new Error("Invalid email format.");
    }
    
    // Validate password strength
    if (!isValidPassword(password)) {
      throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
    }
    
    // Validate name length
    if (!isValidNameLength(name)) {
      throw new Error("Name must be between 2 and 50 characters long.");
    }
    
    // Validate phone number format
    if (!isValidPhoneNumber(phoneNumber)) {
      throw new Error("Invalid phone number format.");
    }
    
    const existingUser = await patientService.findPatientByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 8);
    
    let option = {
      email,
      exp: moment().add(1, "days").unix(),
    };

    const token = await jwt.sign(option, jwtSecrectKey);
    
    // Generating refresh token
    const refreshToken = await jwt.sign(
      { email: email },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: '7d' }
    );

    const filter = {
      email,
      name,
      password: hashPassword,
      token,
      refreshToken, // Include refresh token in the registration
      phoneNumber,
    };
    
    const data = await patientService.createPatient(filter);
    res.status(200).json({status: 200, success: true, data: data });
  } catch (err) {
    res.status(500).json({ status: 500, success: false, error: err.message });
  }
};


// Validate email format
function isValidEmail(email) {
  // Basic email format validation using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function isValidPassword(password) {
  // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,]).{8,}$/;
  return passwordRegex.test(password);
}

// Validate name length
function isValidNameLength(name) {
  // Name must be between 2 and 50 characters long
  return name.length >= 2 && name.length <= 50;
}

// Validate phone number format
function isValidPhoneNumber(phoneNumber) {
  // Simple phone number format validation using regex
  const phoneRegex = /^\d{10}$/; // Assumes a 10-digit phone number format
  return phoneRegex.test(phoneNumber);
}

/* -------------------------- LOGIN/SIGNIN USER  0-new 1-already -------------------------- */
const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Assuming "identifier" can be either email or name
    const patient = await Patient.findOne({ email });
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
      status: 200,
      success: true,
      message:"create patient successfully",
      data: output,
      token: token,
      refreshToken: refreshToken,
      baseUrl: baseUrl,
    });
  } catch (error) {
    res.status(404).json({status:404,sucess:false, error: error.message });
  }
};

/* --------------------- FORGOT PASSWORD SEND WITH EMAIL -------------------- */
const forgotPass = async (req, res) => {
  try {
    const { email, name } = req.body;
    const findUser = await patientService.findPatientByEmail(email);
    // console.log(findUser);
    if (!findUser) throw Error("User not found");
    const otp = ("0".repeat(4) + Math.floor(Math.random() * 10 ** 4)).slice(-4);
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
          let userCreated = await patientService.findPatientByEmail(email);
          if (userCreated) {
            // await  patient.findOne({email});
          }
          // throw new Error("Something went wrong, please try again.");
        } else {
          emailService.sendMail(email, data, "Verify Email");
        }
      }
    );
    res.status(200).json({
      status: 200,
      success: true,
      message: "User login successfully!",
      // data: { data },
      data: `user otp is stored ${otp}`,
    });
  } catch (error) {
    res.status(400).json({status:400, success: false, message: error.message });
  }
};
/* ----------------------- VERIFICATION OTP WITH EMAIL ---------------------- */
const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const patient = await Patient.findOne({ email });

    // Check if user exists
    if (!patient) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "patient not found",
      });
    }

    // Compare OTP
    if (patient.otp === otp) {
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
    res.status(500).json({status:500, error: error.message });
  }
};
/* ----------------------------- reset password ----------------------------- */
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
    let patient = await Patient.findById(id);
    // Checking if the user is in the database or not
    if (!patient) {
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
      data: patient,
    });
  } catch (error) {
    res.status(400).json({status:400, success: false, message: error.message });
  }
};

/* ----------------------------- CHANGE PASSWORD ---------------------------- */

const changePassword = async (req, res) => {
  try {
    const { oldpass, newpass, confirmpass, patientId } = req.body; // assuming patientId is provided in the request body
    // console.log(req.body, "++++++++++++++");

    // Find the patient by their ID
    const patient = await Patient.findById(patientId);
    // console.log(patient, "++++++++++++++++++++++++++++++++");
    if (!patient) {
      return res.status(404).json({status:404,success:false, error: "Patient not found" });
    }

    // Verify the old password
    const isPasswordCorrect = await bcrypt.compare(oldpass, patient.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({status:401,success:false, error: "Incorrect old password" });
    }

    // Check if the new password and confirm password match
    if (newpass !== confirmpass) {
      return res
        .status(400)
        .json({status:400,success:false, error: "New password and confirm password do not match" });
    }

    // Hash the new password and update it in the database
    const hashedPassword = await bcrypt.hash(newpass, 8);
    patient.password = hashedPassword;
    await patient.save();

    return res
      .status(200)
      .json({ status:200,success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({status:500,success: false, error: error.message });
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
