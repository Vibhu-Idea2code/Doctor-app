const express = require("express");

const router = express.Router();
const {
  refreshToken,
  accessToken,
} = require("../../../../middleware/doctorAuth");

const { singleFileUpload } = require("../../../../helpers/upload");
const { homeScreenDoctorController } = require("../../../../controllers");

router.get("/search-pateint", homeScreenDoctorController.searchPatientlist);

router.get('/list-patient-review',
homeScreenDoctorController.allPatientAppointmentListReview);
router.get('/list-patient-date-wise',
homeScreenDoctorController.allPatientAppointmentList);
router.get('/list-patient',
homeScreenDoctorController.PatientAppointmentList);
router.put(
    "/reschedule-appointment-patient-by-doctor",
    homeScreenDoctorController.updateAppointmentByDoctor
  );

  router.put(
    "/complete-appointment-patient-by-doctor-status",
    homeScreenDoctorController.updateAppointmentStatusByDoctor
  );
  

// router.get('/id/:petsId',
// petController.getPetsId);

// router.delete('/delete/:petsId',
// petController.deletePets);

// router.put('/update/:petsId',
// petController.updatePets);

// router.delete("/delete-many", petController.multipleDelete);

// router.put("/updatePetStatus/:id",petController.updatePetStatus);

module.exports = router;


