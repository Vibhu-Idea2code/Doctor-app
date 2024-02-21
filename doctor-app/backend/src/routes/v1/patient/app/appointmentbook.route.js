const express = require("express");

const router = express.Router();
const {
  refreshToken,
  accessToken,
} = require("../../../../middleware/doctorAuth");
const { appointmentController } = require("../../../../controllers");
// const { singleFileUpload } = require("../../../../helpers/upload");

router.post("/add-appointment", appointmentController.createAppointment);

router.get("/list", appointmentController.getAppointments);

router.get("/list-upcomming", appointmentController.getAppointmentstatus);

router.get("/list-completed", appointmentController.getAppointmentstatusComplete);


router.get("/list-doctor-id", appointmentController.getAppointmentById);

router.put("/update-review-rating", appointmentController.updateAppointment);
router.put(
  "/update-reschedule-appointment",
  appointmentController.updateAppointment
);

module.exports = router;
