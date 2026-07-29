import mongoose from "mongoose";
const companySchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    salaryPackage: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, required: true },
    jobType: { type: String, default: "Full-time" },
    experience: { type: String, default: "Not specified" },
    category: { type: String, default: "Engineering" },
    description: { type: String, default: "" },
    requirements: [{ type: String }],
    appliedStudents: [
        { type: mongoose.Schema.Types.ObjectId, ref: "student" }
    ]
}, { timestamps: true })

export default mongoose.model('company', companySchema);
