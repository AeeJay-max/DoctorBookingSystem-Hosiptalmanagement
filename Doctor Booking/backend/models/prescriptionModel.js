import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "appointment", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patients", required: true },
    docId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
    medicines: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true }, // e.g. "1x3" or "5ml"
        duration: { type: String, required: true } // e.g. "5 days"
    }],
    instructions: { type: String, default: "" },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const prescriptionModel = mongoose.models.prescription || mongoose.model("prescription", prescriptionSchema);
export default prescriptionModel;
