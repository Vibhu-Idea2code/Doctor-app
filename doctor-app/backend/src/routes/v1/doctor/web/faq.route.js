const express=require('express');
const {  faqController } = require('../../../../controllers');
const router=express.Router();

router.post('/create-faq',
faqController.createFaq);

module.exports=router;

