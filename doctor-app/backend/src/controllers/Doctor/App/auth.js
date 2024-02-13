const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const jwtSecrectKey = "cdccsvavsvfssbtybnjnuki";
// const otpGenerator = require("otp-generator");
const { doctorService,emailService } = require("../../../services");
const { Doctor } = require("../../../models");
const ejs = require("ejs");
const path = require("path");
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
const forgotPass = async (req, res) => {
  try {
    const { email, name } = req.body;
    const findUser = await  doctorService.findDoctorByEmail(email);
    console.log(findUser);
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
          let userCreated = await  doctorService.findDoctorByEmail(email);
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
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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
      const {newPassword, confirmPassword, id} = req.body;
  
      console.log(id);
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "New password and confirm password do not match.",
        });
      }
      let doctor = await Doctor.findById(id);
      // Checking if the user is in the database or not
      if (!doctor) {
        return res.status(400).json({
          success: false,
          message: "User does not exist!",
        })

      }

      res.status(200).json({
        success: true,
        message: "Password reset successfully!",
        data:doctor,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  const changePassword = async (req, res) => {
    try {
      const { oldpass, newpass, confirmpass, doctorId } = req.body; // assuming patientId is provided in the request body
      console.log(req.body, "++++++++++++++");
      
      // Find the patient by their ID
      const doctor = await Doctor.findById(doctorId);
      console.log(doctor, "++++++++++++++++++++++++++++++++");
      if (!doctor) {
        return res.status(404).json({ error: "doctor not found" });
      }
  
      // Verify the old password
      const isPasswordCorrect = await bcrypt.compare(oldpass, doctor.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Incorrect old password" });
      }
  
      // Check if the new password and confirm password match
      if (newpass !== confirmpass) {
        return res
          .status(400)
          .json({ error: "New password and confirm password do not match" });
      }
  
      // Hash the new password and update it in the database
      const hashedPassword = await bcrypt.hash(newpass, 8);
      doctor.password = hashedPassword;
      await doctor.save();
      
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  register,
  forgotPass,
  verifyOtp,
  login,
  resetPassword,changePassword
};
