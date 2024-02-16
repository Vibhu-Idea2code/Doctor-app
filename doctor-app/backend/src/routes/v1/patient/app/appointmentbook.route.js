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


router.get(
  "/list",
  appointmentController.getAppointments
);


router.get(
  "/list-doctor-id",
  appointmentController.getAppointmentById
);
  

module.exports = router;
