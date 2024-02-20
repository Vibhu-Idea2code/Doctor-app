module.exports.authController = require("./Doctor/App/auth");
module.exports.doctorController = require("./Doctor/App/doctor.controller");
module.exports.doctorDetailController = require("./Patient/app/docotrdetail.controller");


module.exports.specialistController = require("./Doctor/web/specialist.controller");
module.exports.diseaseController = require("./Doctor/web/disease.controller");
module.exports.helpController = require("./Doctor/web/help.controller");


/* --------------------------------- PATIRNT -------------------------------- */

module.exports.countryController = require("./Patient/web/country.controller");
module.exports.authPatientController = require("./Patient/app/auth.controller");
module.exports.updatePatientController = require("./Patient/app/updatePatient.controller");
module.exports.notificationController = require("./Patient/app/notificationController");

module.exports.homeScreenPatientController = require("./Patient/app/homeScreen.controller");
module.exports.appointmentController = require("./Patient/app/appointment.controller");
module.exports.faqController = require("./Doctor/web/faq.controller");
module.exports.helpDoctorController = require("./Doctor/web/helpDoctor");

module.exports.favoriteDoctorController = require("./Patient/app/favoritedoctor.controller");






