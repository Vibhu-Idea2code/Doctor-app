const express=require('express');
const {  faqController } = require('../../../../controllers');
const router=express.Router();

// NOTE:- status:- false then doctorid and true then patientid

/* ----------------- CREATE FAQ BOTH PATEINT AND DOCTOR SIDE ---------------- */
router.post('/create-faq',
faqController.createFaq);

/* -------------------------------- LIST FAQ -------------------------------- */
router.get('/list',
faqController.getFaqList);

module.exports=router;

