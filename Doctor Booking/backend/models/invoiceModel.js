import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patients", required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "appointment" },
    items: [{
        desc: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    status: { type: String, default: "unpaid" }, // unpaid, paid, partially-paid
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const invoiceModel = mongoose.models.invoice || mongoose.model("invoice", invoiceSchema);
export default invoiceModel;
