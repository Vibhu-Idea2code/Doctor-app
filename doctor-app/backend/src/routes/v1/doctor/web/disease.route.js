const express = require("express");
const { diseaseController } = require("../../../../controllers");
const router = express.Router();

router.post("/create-disease", diseaseController.createDisease);

module.exports = router;
