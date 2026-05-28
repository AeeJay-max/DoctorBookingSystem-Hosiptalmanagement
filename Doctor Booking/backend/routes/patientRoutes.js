import express from 'express'
import upload from '../middlewares/multer.js'
import {
    registerPatient,
    getPatientProfile,
    PatientLogin,
    updatePatientProfile,
    bookAappointment,
    listAppointment,
    cancelAppointment,
    getPrescriptions,
    getMedicalRecords,
    getInvoices,
    getNotifications,
    markNotificationRead,
    patientDashboard
} from '../controllers/patientController.js'
import authPatient from '../middlewares/authPatient.js'

const patRouter = express.Router()

patRouter.post('/register', registerPatient)
patRouter.post('/login', PatientLogin)

patRouter.get('/profile', authPatient, getPatientProfile)
patRouter.post('/update-profile', upload.single('image'), authPatient, updatePatientProfile)
patRouter.post('/book-appointment', authPatient, bookAappointment)
patRouter.get('/appointments', authPatient, listAppointment)
patRouter.post('/cancel-appointment', authPatient, cancelAppointment)

patRouter.get('/prescriptions', authPatient, getPrescriptions)
patRouter.get('/medical-records', authPatient, getMedicalRecords)
patRouter.get('/invoices', authPatient, getInvoices)

patRouter.get('/notifications', authPatient, getNotifications)
patRouter.post('/mark-notification-read', authPatient, markNotificationRead)

patRouter.get('/dashboard', authPatient, patientDashboard)

export default patRouter