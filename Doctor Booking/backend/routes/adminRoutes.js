import express from 'express'
import {
    addDoctor,
    registerAdmin,
    loginAdmin,
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
    allDoctors,
    appointmentAdmin,
    appointmentcancel,
    adminDashboard,
    approveAppointment,
    rejectAppointment,
    rescheduleAppointment,
    getAllPatients,
    addPatient,
    updatePatient,
    dischargePatient,
    getAllWards,
    addWard,
    getAllRooms,
    addRoom,
    assignRoom,
    getAllPrescriptions,
    getAllMedicalRecords,
    generateInvoice,
    getInvoices,
    getPayments,
    getReports,
    getDoctorPerformance
} from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/register', registerAdmin)
adminRouter.post('/login', loginAdmin)
adminRouter.get('/profile', authAdmin, getAdminProfile)
adminRouter.post('/update-profile', authAdmin, upload.single('image'), updateAdminProfile)
adminRouter.post('/change-password', authAdmin, changeAdminPassword)
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.get('/appointments', authAdmin, appointmentAdmin)
adminRouter.post('/appointment-cancel', authAdmin, appointmentcancel)
adminRouter.post('/appointment-approve', authAdmin, approveAppointment)
adminRouter.post('/appointment-reject', authAdmin, rejectAppointment)
adminRouter.post('/appointment-reschedule', authAdmin, rescheduleAppointment)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

// Patient Management
adminRouter.get('/patients', authAdmin, getAllPatients)
adminRouter.post('/add-patient', authAdmin, addPatient)
adminRouter.post('/update-patient', authAdmin, updatePatient)
adminRouter.post('/discharge-patient', authAdmin, dischargePatient)

// Ward & Room Management
adminRouter.get('/wards', authAdmin, getAllWards)
adminRouter.post('/add-ward', authAdmin, addWard)
adminRouter.get('/rooms', authAdmin, getAllRooms)
adminRouter.post('/add-room', authAdmin, addRoom)
adminRouter.post('/assign-room', authAdmin, assignRoom)

// Medical Records & Prescriptions
adminRouter.get('/prescriptions', authAdmin, getAllPrescriptions)
adminRouter.get('/medical-records', authAdmin, getAllMedicalRecords)

// Billing & Payments
adminRouter.post('/generate-invoice', authAdmin, generateInvoice)
adminRouter.get('/invoices', authAdmin, getInvoices)
adminRouter.get('/payments', authAdmin, getPayments)

// Reports
adminRouter.get('/reports', authAdmin, getReports)
adminRouter.get('/doctor-performance', authAdmin, getDoctorPerformance)

export default adminRouter