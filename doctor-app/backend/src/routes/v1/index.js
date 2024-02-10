const express = require("express");

const authRoute = require("./doctor/app/auth.route");
const router = express.Router();

router.use("/doctor", authRoute);

module.exports = router;

