import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    wardId: { type: mongoose.Schema.Types.ObjectId, ref: "ward", required: true },
    type: { type: String, enum: ["Single", "Shared", "VIP", "Emergency"], required: true },
    pricePerDay: { type: Number, required: true },
    available: { type: Boolean, default: true },
    occupiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "patients", default: null },
    occupiedDate: { type: Date, default: null },
    amenities: [{ type: String }],
    floor: { type: String, default: "" }
}, { timestamps: true });

const roomModel = mongoose.models.room || mongoose.model("room", roomSchema);
export default roomModel;
