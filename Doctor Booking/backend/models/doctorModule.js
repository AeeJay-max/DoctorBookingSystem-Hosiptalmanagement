import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    department: { type: String, default: "General" },
    certificates: [{ type: String }],
    licenseNumber: { type: String, default: "" },
    emergencyContact: {
        name: { type: String, default: "" },
        phone: { type: String, default: "" }
    },
    schedule: {
        monday: { type: String, default: "" },
        tuesday: { type: String, default: "" },
        wednesday: { type: String, default: "" },
        thursday: { type: String, default: "" },
        friday: { type: String, default: "" },
        saturday: { type: String, default: "" },
        sunday: { type: String, default: "" }
    }
}, { minimize: false });

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema)

export default doctorModel