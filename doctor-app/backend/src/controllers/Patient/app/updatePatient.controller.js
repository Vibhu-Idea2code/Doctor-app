const path = require("path");
const fs = require("fs");
const { patientService } = require("../../../services");
const { Patient } = require("../../../models");

/* ----------------------------- Get admin list ------------*/
/* ----------------------------- update user profile ----------------------------- */
const updateDocProfile = async (req, res) => {
    try {
        const reqbody = req.body;

        if (req.file) {
            reqbody.patientImag = req.file.filename;
        }

        const patient= await Patient.findById(reqbody.patientId);

        if (!patient) {
            throw new Error(` patientId ${reqbody.patientId} not found`);
        }

        // Update user data in the database
        const isUpdate = await Patient.findByIdAndUpdate(
            reqbody.patientId,
            {
                $set: reqbody,
            },
            { new: true }
        );
        res.status(200).json({
            success: true,
            updateData: isUpdate,
            message: "update successfully",
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = {
    updateDocProfile,
};
