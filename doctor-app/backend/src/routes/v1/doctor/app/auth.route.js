const express=require('express');

const router=express.Router();
const {
    refreshToken,
    accessToken,
  } = require("../../../../middleware/doctorAuth");
const { doctorController } = require('../../../../controllers');


router.post('/create-doctor',
doctorController.register);


router.post('/login',
doctorController.login);

router.post('/forgotpass',
doctorController.forgotPass);

router.post('/verify-otp',
doctorController.verifyOtp);


router.put(
    "/resetPassword",
    //  accessToken(),
    doctorController.resetPassword
  );
// router.get('/list',accessToken(),
// petController.getPetsList);

// router.get('/id/:petsId',
// petController.getPetsId);

// router.delete('/delete/:petsId',
// petController.deletePets);

// router.put('/update/:petsId',
// petController.updatePets);

// router.delete("/delete-many", petController.multipleDelete);

// router.put("/updatePetStatus/:id",petController.updatePetStatus);


module.exports=router;