const express=require('express');
const { specialistController } = require('../../../../controllers');
const { singleFileUpload } = require("../../../../helpers/upload");

const router=express.Router();

router.post('/create-specialist',
singleFileUpload("/specialistImg", "image"),
specialistController.createspecialist);

router.put(
    "/update-specialist-profile",
    singleFileUpload("/specialistImg", "image"),
    specialistController.updatespecialistProfile
  );

module.exports=router;

