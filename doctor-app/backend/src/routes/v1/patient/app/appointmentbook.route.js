;
const express = require("express");

const router = express.Router();
const {
  refreshToken,
  accessToken,
} = require("../../../../middleware/doctorAuth");
const {  appointmentController } = require("../../../../controllers");
// const { singleFileUpload } = require("../../../../helpers/upload");

router.post(
    "/add-appointment",
    appointmentController.createAppointment
  );
  

module.exports = router;
