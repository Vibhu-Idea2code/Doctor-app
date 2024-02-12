const express=require('express');
const { specialistController } = require('../../../../controllers');
const router=express.Router();

router.post('/create-specialist',
specialistController.createspecialist);

module.exports=router;

