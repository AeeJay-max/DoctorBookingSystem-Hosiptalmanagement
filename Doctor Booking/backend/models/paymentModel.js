import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "invoice", required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true }, // Paynow, Cash, Card
    status: { type: String, default: "pending" }, // pending, successful, failed
    transactionId: { type: String, default: "" },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

const paymentModel = mongoose.models.payment || mongoose.model("payment", paymentSchema);
export default paymentModel;
