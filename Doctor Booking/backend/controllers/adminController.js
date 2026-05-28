import validator from "validator"
import bcrypt from 'bcrypt'
import doctorModel from "../models/doctorModule.js"
import adminModel from "../models/adminModel.js"
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"
import patientModel from "../models/patientModel.js"
import wardModel from "../models/wardModel.js"
import roomModel from "../models/roomModel.js"
import prescriptionModel from "../models/prescriptionModel.js"
import medicalRecordModel from "../models/medicalRecordModel.js"
import invoiceModel from "../models/invoiceModel.js"
import paymentModel from "../models/paymentModel.js"
import notificationModel from "../models/notificationModel.js"
import departmentModel from "../models/departmentModel.js"
import jwt from 'jsonwebtoken'
import upload from "../utils/upload.js"

const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address, department, licenseNumber } = req.body
        const imageFile = req.file

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter strong password at Least 8 characters" })
        }

        const existingDoctor = await doctorModel.findOne({ email })
        if (existingDoctor) {
            return res.json({ success: false, message: "Doctor already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        let imageUrl = ""
        if (imageFile) {
            imageUrl = await upload(imageFile.path)
        }

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
            department: department || "General",
            licenseNumber: licenseNumber || ""
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({ success: true, message: "Doctor Added" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, phone, role, department, permissions } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password at least 8 characters" })
        }

        const existingAdmin = await adminModel.findOne({ email })
        if (existingAdmin) {
            return res.json({ success: false, message: "Admin already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const adminData = {
            name,
            email,
            password: hashedPassword,
            phone: phone || "",
            role: role || "admin",
            department: department || "General",
            permissions: permissions || ["all"],
            isSuperAdmin: false
        }

        const newAdmin = new adminModel(adminData)
        await newAdmin.save()

        const token = jwt.sign({ id: newAdmin._id, role: 'admin' }, process.env.JWT_SECRET)

        res.json({ success: true, token, message: "Admin Registered Successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body

        let admin = await adminModel.findOne({ email })

        if (!admin) {
            if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
                admin = new adminModel({
                    name: "System Admin",
                    email: email,
                    password: hashedPassword,
                    role: "admin",
                    isSuperAdmin: true,
                    permissions: ["all"]
                })
                await admin.save()
            } else {
                return res.json({ success: false, message: "Invalid Credentials" })
            }
        } else {
            const isMatch = await bcrypt.compare(password, admin.password)
            if (!isMatch) {
                return res.json({ success: false, message: "Invalid Credentials" })
            }
        }

        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getAdminProfile = async (req, res) => {
    try {
        const { adminId } = req.body
        const adminData = await adminModel.findById(adminId).select("-password")
        res.json({ success: true, adminData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateAdminProfile = async (req, res) => {
    try {
        const { adminId, name, phone, department, permissions } = req.body
        const imageFile = req.file

        const updateData = { name, phone, department, permissions }

        if (imageFile) {
            const imageUrl = await upload(imageFile.path)
            updateData.profileImage = imageUrl
        }

        await adminModel.findByIdAndUpdate(adminId, updateData)
        res.json({ success: true, message: "Profile Updated Successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const changeAdminPassword = async (req, res) => {
    try {
        const { adminId, oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return res.json({ success: false, message: "Passwords Missing" })
        }

        const admin = await adminModel.findById(adminId)
        const isMatch = await bcrypt.compare(oldPassword, admin.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect Old Password" })
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: "New password must be at least 8 characters" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await adminModel.findByIdAndUpdate(adminId, { password: hashedPassword })
        res.json({ success: true, message: "Password Changed Successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const appointmentAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({}).populate('docId', 'name speciality').populate('userId', 'name email')
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const appointmentcancel = async (req, res) => {
    try {
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

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

const approveAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { status: "approved" })
        res.json({ success: true, message: "Appointment Approved" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const rejectAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { status: "rejected", cancelled: true })
        res.json({ success: true, message: "Appointment Rejected" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const rescheduleAppointment = async (req, res) => {
    try {
        const { appointmentId, slotDate, slotTime } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { slotDate, slotTime, status: "approved" })
        res.json({ success: true, message: "Appointment Rescheduled" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.countDocuments()
        const patients = await patientModel.countDocuments()
        const users = await userModel.countDocuments()
        const appointments = await appointmentModel.countDocuments()
        const wards = await wardModel.countDocuments()
        const rooms = await roomModel.countDocuments()

        const totalRevenue = await appointmentModel.aggregate([
            { $match: { payment: true } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])

        const activeAdmissions = await patientModel.countDocuments({ status: "admitted" })
        const availableRooms = await roomModel.countDocuments({ available: true })
        const cancelledAppointments = await appointmentModel.countDocuments({ cancelled: true })
        const completedAppointments = await appointmentModel.countDocuments({ isCompleted: true })

        const latestAppointments = await appointmentModel.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('docId', 'name speciality')
            .populate('userId', 'name')

        const dashData = {
            doctors,
            patients: patients + users,
            appointments,
            totalRevenue: totalRevenue[0]?.total || 0,
            activeAdmissions,
            availableRooms,
            totalWards: wards,
            totalRooms: rooms,
            cancelledAppointments,
            completedAppointments,
            latestAppointments
        }

        res.json({ success: true, dashData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getAllPatients = async (req, res) => {
    try {
        const patients = await patientModel.find({}).populate('ward', 'name').populate('roomnumber', 'roomNumber')
        res.json({ success: true, patients })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const addPatient = async (req, res) => {
    try {
        const { name, email, idnumber, password, phone, gender, disease, dob, bloodGroup, address } = req.body

        if (!name || !email || !idnumber || !password) {
            return res.json({ success: false, message: "Missing Details" })
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
            gender: gender || "Other",
            disease: disease || "",
            dob: dob || "",
            bloodGroup: bloodGroup || "",
            address: address ? JSON.parse(address) : { line1: '', line2: '' },
            date: Date.now()
        }

        const newPatient = new patientModel(patientData)
        await newPatient.save()

        res.json({ success: true, message: "Patient Added Successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updatePatient = async (req, res) => {
    try {
        const { patientId, name, phone, ward, roomnumber, doctor, status } = req.body

        const updateData = { name, phone, ward, roomnumber, doctor, status }

        if (ward) {
            const wardData = await wardModel.findById(ward)
            if (wardData) updateData.ward = ward
        }

        if (roomnumber) {
            const roomData = await roomModel.findById(roomnumber)
            if (roomData) updateData.roomnumber = roomnumber
        }

        await patientModel.findByIdAndUpdate(patientId, updateData)
        res.json({ success: true, message: "Patient Updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const dischargePatient = async (req, res) => {
    try {
        const { patientId } = req.body

        const patient = await patientModel.findById(patientId)
        
        if (patient.roomnumber) {
            await roomModel.findByIdAndUpdate(patient.roomnumber, { available: true, occupiedBy: null, occupiedDate: null })
        }

        await patientModel.findByIdAndUpdate(patientId, { 
            status: "discharged", 
            ward: null, 
            roomnumber: null,
            doctor: null 
        })

        res.json({ success: true, message: "Patient Discharged" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getAllWards = async (req, res) => {
    try {
        const wards = await wardModel.find({})
        res.json({ success: true, wards })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const addWard = async (req, res) => {
    try {
        const { name, type, totalRooms, floor, description, nurseInCharge } = req.body

        const existingWard = await wardModel.findOne({ name })
        if (existingWard) {
            return res.json({ success: false, message: "Ward already exists" })
        }

        const wardData = {
            name,
            type,
            totalRooms: totalRooms || 0,
            floor: floor || "",
            description: description || "",
            nurseInCharge: nurseInCharge || ""
        }

        const newWard = new wardModel(wardData)
        await newWard.save()

        res.json({ success: true, message: "Ward Added Successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getAllRooms = async (req, res) => {
    try {
        const rooms = await roomModel.find({}).populate('wardId', 'name type')
        res.json({ success: true, rooms })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const addRoom = async (req, res) => {
    try {
        const { roomNumber, wardId, type, pricePerDay, floor, amenities } = req.body

        const existingRoom = await roomModel.findOne({ roomNumber })
        if (existingRoom) {
            return res.json({ success: false, message: "Room already exists" })
        }

        const roomData = {
            roomNumber,
            wardId,
            type: type || "Single",
            pricePerDay: pricePerDay || 0,
            floor: floor || "",
            amenities: amenities ? JSON.parse(amenities) : []
        }

        const newRoom = new roomModel(roomData)
        await newRoom.save()

        await wardModel.findByIdAndUpdate(wardId, { $inc: { totalRooms: 1 } })

        res.json({ success: true, message: "Room Added Successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const assignRoom = async (req, res) => {
    try {
        const { patientId, roomId } = req.body

        const room = await roomModel.findById(roomId)
        if (!room || !room.available) {
            return res.json({ success: false, message: "Room not available" })
        }

        await roomModel.findByIdAndUpdate(roomId, { 
            available: false, 
            occupiedBy: patientId, 
            occupiedDate: Date.now() 
        })

        await patientModel.findByIdAndUpdate(patientId, { 
            roomnumber: roomId,
            status: "admitted"
        })

        await wardModel.findByIdAndUpdate(room.wardId, { $inc: { occupiedRooms: 1 } })

        res.json({ success: true, message: "Room Assigned Successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getAllPrescriptions = async (req, res) => {
    try {
        const prescriptions = await prescriptionModel.find({})
            .populate('patientId', 'name email')
            .populate('docId', 'name speciality')
        res.json({ success: true, prescriptions })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getAllMedicalRecords = async (req, res) => {
    try {
        const records = await medicalRecordModel.find({})
            .populate('patientId', 'name email')
            .populate('docId', 'name speciality')
        res.json({ success: true, records })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const generateInvoice = async (req, res) => {
    try {
        const { patientId, appointmentId, items } = req.body

        let totalAmount = 0
        const invoiceItems = items.map(item => {
            totalAmount += item.price
            return { desc: item.desc, price: item.price }
        })

        const invoiceData = {
            patientId,
            appointmentId,
            items: invoiceItems,
            totalAmount
        }

        const newInvoice = new invoiceModel(invoiceData)
        await newInvoice.save()

        res.json({ success: true, message: "Invoice Generated Successfully", invoice: newInvoice })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getInvoices = async (req, res) => {
    try {
        const invoices = await invoiceModel.find({})
            .populate('patientId', 'name email')
            .populate('appointmentId', 'slotDate slotTime')
        res.json({ success: true, invoices })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getPayments = async (req, res) => {
    try {
        const payments = await paymentModel.find({})
            .populate('invoiceId')
        res.json({ success: true, payments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getReports = async (req, res) => {
    try {
        const totalAppointments = await appointmentModel.countDocuments()
        const completedAppointments = await appointmentModel.countDocuments({ status: "completed" })
        const cancelledAppointments = await appointmentModel.countDocuments({ cancelled: true })

        const totalRevenue = await appointmentModel.aggregate([
            { $match: { payment: true } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])

        const totalInvoices = await invoiceModel.countDocuments()
        const paidInvoices = await invoiceModel.countDocuments({ status: "paid" })

        const monthlyAppointments = await appointmentModel.aggregate([
            {
                $group: {
                    _id: { $month: { $toLong: "$date" } },
                    count: { $sum: 1 }
                }
            }
        ])

        const reports = {
            totalAppointments,
            completedAppointments,
            cancelledAppointments,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalInvoices,
            paidInvoices,
            monthlyAppointments
        }

        res.json({ success: true, reports })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const getDoctorPerformance = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        const performance = []

        for (const doctor of doctors) {
            const appointments = await appointmentModel.find({ docId: doctor._id })
            const completed = appointments.filter(a => a.isCompleted).length
            const earnings = appointments.reduce((sum, a) => sum + (a.isCompleted || a.payment ? a.amount : 0), 0)

            performance.push({
                name: doctor.name,
                speciality: doctor.speciality,
                totalAppointments: appointments.length,
                completedAppointments: completed,
                earnings
            })
        }

        res.json({ success: true, performance })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
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
}