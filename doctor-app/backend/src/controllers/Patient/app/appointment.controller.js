const AppointmentBook = require('../../../models/appointmentbook.model');

// Create a new appointment
const createAppointment = async (req, res) => {
    try {
        const reqBody = req.body;
        // Generate a 6-digit random number
        const appointmentId = Math.floor(100000 + Math.random() * 900000);
        
        // Add the appointmentId to the request body
        reqBody.appointmentId = appointmentId;
    
        const appointment = await AppointmentBook.create(reqBody);
        if (!appointment) {
          throw new Error("no such appointment");
        }
        res.status(200).json({
          message: "Successfully created a new appointment",
          success: true,
          data: appointment,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
  };
  

// Get all appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentBook.find().populate('patientid').populate('doctorid');
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await AppointmentBook.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update appointment by ID
const updateAppointment = async (req, res) => {
  try {
    const appointment = await AppointmentBook.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete appointment by ID
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await AppointmentBook.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
};
