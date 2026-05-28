import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userType: { type: String, enum: ["admin", "doctor", "user", "patient"], required: true },
    token: { type: String, required: true },
    type: { type: String, enum: ["refresh", "reset"], required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

const tokenModel = mongoose.models.token || mongoose.model("token", tokenSchema);
export default tokenModel;