const express=require('express');
const {  helpController } = require('../../../../controllers');
const router=express.Router();

router.post('/create-help',
helpController.createHelp);

module.exports=router;

