import doctorModel from "../models/doctorModule.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import prescriptionModel from "../models/prescriptionModel.js"
import medicalRecordModel from "../models/medicalRecordModel.js"
import notificationModel from "../models/notificationModel.js"
import upload from "../utils/upload.js"

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availability Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_DOCTOR_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available, schedule, emergencyContact } = req.body

        const updateData = { fees, address, available, schedule, emergencyContact }
        if (address) updateData.address = JSON.parse(address)
        if (schedule) updateData.schedule = JSON.parse(schedule)

        const imageFile = req.file
        if (imageFile) {
            const imageUrl = await upload(imageFile.path)
            updateData.image = imageUrl
        }

        await doctorModel.findByIdAndUpdate(docId, updateData)
        res.json({ success: true, message: 'Profile Updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })
            .populate('userId', 'name email image')
            .sort({ createdAt: -1 })

        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId.toString() === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true, status: "completed" })
            return res.json({ success: true, message: 'Appointment Completed' })
        } else {
            return res.json({ success: false, message: 'Mark Failed' })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const cancelappointment = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId.toString() === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true, status: "cancelled" })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        } else {
            return res.json({ success: false, message: 'Cancellation Failed' })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0
        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        const patients = [...new Set(appointments.map(item => item.userId.toString()))]
        const completedAppointments = appointments.filter(a => a.isCompleted || a.status === "completed").length
        const pendingAppointments = appointments.filter(a => a.status === "pending").length
        const cancelledAppointments = appointments.filter(a => a.cancelled || a.status === "cancelled").length

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            completedAppointments,
            pendingAppointments,
            cancelledAppointments,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getPatientHistory = async (req, res) => {
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId, isCompleted: true })
            .populate('userId', 'name email image')

        const patientIds = [...new Set(appointments.map(a => a.userId._id))]
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const createMedicalRecord = async (req, res) => {
    try {
        const { patientId, docId, diagnosis, treatment, labResults, allergies, vitals, notes } = req.body

        const medicalRecord = new medicalRecordModel({
            patientId,
            docId,
            diagnosis,
            treatment,
            labResults: labResults || [],
            allergies: allergies || [],
            vitals: vitals || {},
            notes
        })

        await medicalRecord.save()

        await notificationModel.create({
            recipientId: patientId,
            recipientType: "patient",
            title: "Medical Record Updated",
            message: "Your medical record has been updated by your doctor",
            type: "medical"
        })

        res.json({ success: true, message: "Medical Record Created", record: medicalRecord })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const createPrescription = async (req, res) => {
    try {
        const { appointmentId, patientId, docId, medicines, instructions } = req.body

        const prescription = new prescriptionModel({
            appointmentId,
            patientId,
            docId,
            medicines: medicines || [],
            instructions
        })

        await prescription.save()

        await appointmentModel.findByIdAndUpdate(appointmentId, { prescription: prescription._id })

        await notificationModel.create({
            recipientId: patientId,
            recipientType: "patient",
            title: "New Prescription",
            message: "You have a new prescription from your doctor",
            type: "medical"
        })

        res.json({ success: true, message: "Prescription Created", prescription })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getNotifications = async (req, res) => {
    try {
        const { recipientId } = req.body
        const notifications = await notificationModel.find({ recipientId, isRead: false })

        res.json({ success: true, notifications })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const changeDoctorSchedule = async (req, res) => {
    try {
        const { docId, schedule } = req.body
        await doctorModel.findByIdAndUpdate(docId, { schedule: JSON.parse(schedule) })
        res.json({ success: true, message: "Schedule Updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    cancelappointment,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    getPatientHistory,
    createMedicalRecord,
    createPrescription,
    getNotifications,
    changeDoctorSchedule
}