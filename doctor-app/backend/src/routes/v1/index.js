const express = require("express");

const authRoute = require("./doctor/app/auth.route");

const specialistRoute = require("./doctor/web/specialist.route");

const diseasetRoute = require("./doctor/web/disease.route");

const countryRoute = require("./patient/web/country.route");

const patientRoute = require("./patient/app/auth.route");

const appointmentRoute = require("./patient/app/appointmentbook.route");





const router = express.Router();

router.use("/doctor", authRoute);
router.use("/specialist", specialistRoute);
router.use("/disease", diseasetRoute);
router.use("/country", countryRoute);
router.use("/patient", patientRoute);
router.use("/appointment", appointmentRoute);






module.exports = router;

