import express from 'express'
import {
    appointmentsDoctor,
    cancelappointment,
    changeAvailability,
    doctorList,
    doctorProfile,
    loginDoctor,
    updateDoctorProfile,
    doctorDashboard,
    getPatientHistory,
    createMedicalRecord,
    createPrescription,
    getNotifications,
    changeDoctorSchedule
} from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'
import upload from '../middlewares/multer.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/completed', authDoctor, cancelappointment)
doctorRouter.post('/cancel', authDoctor, cancelappointment)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, upload.single('image'), updateDoctorProfile)
doctorRouter.post('/update-schedule', authDoctor, changeDoctorSchedule)
doctorRouter.get('/patient-history', authDoctor, getPatientHistory)
doctorRouter.post('/create-medical-record', authDoctor, createMedicalRecord)
doctorRouter.post('/create-prescription', authDoctor, createPrescription)
doctorRouter.get('/notifications', authDoctor, getNotifications)

export default doctorRouter