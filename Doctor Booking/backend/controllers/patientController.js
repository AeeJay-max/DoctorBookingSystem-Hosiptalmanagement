import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import doctorModel from '../models/doctorModule.js'
import appointmentModel from '../models/appointmentModel.js'
import patientModel from '../models/patientModel.js'
import prescriptionModel from '../models/prescriptionModel.js'
import medicalRecordModel from '../models/medicalRecordModel.js'
import invoiceModel from '../models/invoiceModel.js'
import notificationModel from '../models/notificationModel.js'
import upload from "../utils/upload.js"

const registerPatient = async (req, res) => {
    try {
        const { name, email, idnumber, password, phone, gender, disease, dob, bloodGroup, address } = req.body

        if (!name || !email || !idnumber || !password) {
            return res.json({ success: false, message: "Missing Details" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password at least 8 characters" })
        }

        const existingPatient = await patientModel.findOne({ email })
        if (existingPatient) {
            return res.json({ success: false, message: "Patient already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const patientData = {
            name,
            email,
            idnumber,
            password: hashedPassword,
            phone: phone || "",
            condition: false,
            doctor: null,
            ward: null,
            roomnumber: null,
            disease: disease || "",
            gender: gender || "Other",
            dob: dob || "",
            bloodGroup: bloodGroup || "",
            address: address ? JSON.parse(address) : { line1: '', line2: '' },
            date: Date.now()
        }

        const newPatient = new patientModel(patientData)
        const patient = await newPatient.save()

        const token = jwt.sign({ id: patient._id }, process.env.JWT_Patient_SECRET)

        res.json({ success: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const PatientLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const patient = await patientModel.findOne({ email })

        if (!patient) {
            return res.json({ success: false, message: 'No Patient with the email found' })
        }

        const isMatch = await bcrypt.compare(password, patient.password)

        if (isMatch) {
            const token = jwt.sign({ id: patient._id }, process.env.JWT_Patient_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid Credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getPatientProfile = async (req, res) => {
    try {
        const { patientId } = req.body
        const patientData = await patientModel.findById(patientId)
            .select('-password')
            .populate('doctor', 'name speciality')
            .populate('ward', 'name type')
            .populate('roomnumber', 'roomNumber pricePerDay')

        res.json({ success: true, patientData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updatePatientProfile = async (req, res) => {
    try {
        const { patientId, phone, address, emergencyContact } = req.body
        const imageFile = req.file

        const updateData = { phone, address }

        if (address) {
            updateData.address = JSON.parse(address)
        }

        if (emergencyContact) {
            updateData.kin = JSON.parse(emergencyContact)
        }

        if (imageFile) {
            const imageUrl = await upload(imageFile.path)
            updateData.image = imageUrl
        }

        await patientModel.findByIdAndUpdate(patientId, updateData)
        res.json({ success: true, message: "Profile Updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const bookAappointment = async (req, res) => {
    try {
        const { patientId, docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor not Available' })
        }

        let slots_booked = docData.slots_booked || {}

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not Available' })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const patientData = await patientModel.findById(patientId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId: patientId,
            docId,
            userData: patientData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
            status: "pending"
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        await notificationModel.create({
            recipientId: docId,
            recipientType: "doctor",
            title: "New Appointment",
            message: `New appointment request from ${patientData.name}`,
            type: "appointment"
        })

        res.json({ success: true, message: 'Appointment Booked' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const listAppointment = async (req, res) => {
    try {
        const { patientId } = req.body
        const appointments = await appointmentModel.find({ userId: patientId })
            .populate('docId', 'name speciality image')
            .sort({ createdAt: -1 })

        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const cancelAppointment = async (req, res) => {
    try {
        const { patientId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData.userId.toString() !== patientId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true, status: "cancelled" })

        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        if (doctorData && doctorData.slots_booked && doctorData.slots_booked[slotDate]) {
            let slots_booked = doctorData.slots_booked
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
            await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        }

        res.json({ success: true, message: 'Appointment Cancelled' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getPrescriptions = async (req, res) => {
    try {
        const { patientId } = req.body
        const prescriptions = await prescriptionModel.find({ patientId })
            .populate('docId', 'name speciality')
            .populate('appointmentId', 'slotDate slotTime')

        res.json({ success: true, prescriptions })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getMedicalRecords = async (req, res) => {
    try {
        const { patientId } = req.body
        const records = await medicalRecordModel.find({ patientId })
            .populate('docId', 'name speciality')
            .sort({ createdAt: -1 })

        res.json({ success: true, records })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getInvoices = async (req, res) => {
    try {
        const { patientId } = req.body
        const invoices = await invoiceModel.find({ patientId }).sort({ createdAt: -1 })

        res.json({ success: true, invoices })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getNotifications = async (req, res) => {
    try {
        const { patientId } = req.body
        const notifications = await notificationModel.find({ recipientId: patientId, recipientType: "patient" })
            .sort({ createdAt: -1 })

        res.json({ success: true, notifications })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const markNotificationRead = async (req, res) => {
    try {
        const { notificationId } = req.body
        await notificationModel.findByIdAndUpdate(notificationId, { isRead: true })
        res.json({ success: true, message: "Notification marked as read" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const patientDashboard = async (req, res) => {
    try {
        const { patientId } = req.body

        const totalAppointments = await appointmentModel.countDocuments({ userId: patientId })
        const completedAppointments = await appointmentModel.countDocuments({ userId: patientId, isCompleted: true })
        const pendingAppointments = await appointmentModel.countDocuments({ userId: patientId, status: "pending" })
        const cancelledAppointments = await appointmentModel.countDocuments({ userId: patientId, cancelled: true })

        const totalInvoices = await invoiceModel.countDocuments({ patientId })
        const unpaidInvoices = await invoiceModel.countDocuments({ patientId, status: "unpaid" })

        const patient = await patientModel.findById(patientId).select('-password')
            .populate('doctor', 'name speciality')
            .populate('ward', 'name type')
            .populate('roomnumber', 'roomNumber')

        const dashData = {
            totalAppointments,
            completedAppointments,
            pendingAppointments,
            cancelledAppointments,
            totalInvoices,
            unpaidInvoices,
            patient
        }

        res.json({ success: true, dashData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
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
}