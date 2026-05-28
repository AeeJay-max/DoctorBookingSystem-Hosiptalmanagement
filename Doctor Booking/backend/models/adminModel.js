import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "superadmin", "manager"], default: "admin" },
    profileImage: { type: String, default: "" },
    phone: { type: String, default: "" },
    permissions: [{ type: String }],
    isSuperAdmin: { type: Boolean, default: false },
    department: { type: String, default: "General" }
}, { timestamps: true });

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default adminModel;
