import mongoose from "mongoose";

const wardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["ICU", "General", "Emergency", "Maternity", "Pediatric", "Surgery"], required: true },
    totalRooms: { type: Number, default: 0 },
    occupiedRooms: { type: Number, default: 0 },
    floor: { type: String, default: "" },
    description: { type: String, default: "" },
    nurseInCharge: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

wardSchema.index({ name: 1 });
wardSchema.index({ type: 1 });

const wardModel = mongoose.models.ward || mongoose.model("ward", wardSchema);
export default wardModel;
