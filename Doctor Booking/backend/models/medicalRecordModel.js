import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patients", required: true },
    docId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
    diagnosis: { type: String, required: true },
    treatment: { type: String, default: "" },
    labResults: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    vitals: {
        bp: { type: String, default: "" },
        hr: { type: String, default: "" },
        temp: { type: String, default: "" }
    },
    notes: { type: String, default: "" },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const medicalRecordModel = mongoose.models.medicalRecord || mongoose.model("medicalRecord", medicalRecordSchema);
export default medicalRecordModel;
