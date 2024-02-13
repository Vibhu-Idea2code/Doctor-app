module.exports.authController = require("./Doctor/App/auth");
module.exports.doctorController = require("./Doctor/App/doctor.controller");

module.exports.specialistController = require("./Doctor/web/specialist.controller");
module.exports.diseaseController = require("./Doctor/web/disease.controller");

/* --------------------------------- PATIRNT -------------------------------- */

module.exports.countryController = require("./Patient/web/country.controller");
module.exports.authPatientController = require("./Patient/app/auth.controller");
module.exports.updatePatientController = require("./Patient/app/updatePatient.controller");
module.exports.homeScreenPatientController = require("./Patient/app/homeScreen.controller");



