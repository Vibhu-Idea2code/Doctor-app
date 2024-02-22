const express = require("express");
const { faqDoctorController } = require("../../../../controllers");
const router = express.Router();

router.post("/create-help-doctor", faqDoctorController.createHelp);

module.exports = router;
