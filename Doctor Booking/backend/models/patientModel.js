import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    idnumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    condition: { type: Boolean, default: false },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", default: null },
    ward: { type: mongoose.Schema.Types.ObjectId, ref: "ward", default: null },
    roomnumber: { type: mongoose.Schema.Types.ObjectId, ref: "room", default: null },
    phone: { type: String, default: "" },
    kin: {
        name: { type: String, default: "" },
        phone: { type: String, default: "" },
        relationship: { type: String, default: "" }
    },
    address: { type: Object, default: { line1: '', line2: '' } },
    date: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
    dob: { type: String, default: "" },
    bloodGroup: { type: String, default: "" },
    disease: { type: String, default: "" },
    status: { type: String, enum: ["admitted", "discharged", "outpatient"], default: "outpatient" },
    image: { type: String, default: "" }
}, { minimize: false });

const patientModel = mongoose.models.patients || mongoose.model('patients', patientSchema)

export default patientModel