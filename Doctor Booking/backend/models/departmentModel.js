import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    head: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", default: null },
    headName: { type: String, default: "" },
    headEmail: { type: String, default: "" },
    budget: { type: Number, default: 0 },
    contact: { type: String, default: "" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const departmentModel = mongoose.models.department || mongoose.model("department", departmentSchema);
export default departmentModel;