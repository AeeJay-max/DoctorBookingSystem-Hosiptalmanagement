import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true },
    recipientType: { type: String, enum: ["user", "patient", "doctor", "admin"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: ["appointment", "payment", "medical", "general"], default: "general" },
    link: { type: String, default: "" }
}, { timestamps: true });

const notificationModel = mongoose.models.notification || mongoose.model("notification", notificationSchema);
export default notificationModel;
