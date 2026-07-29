import Company from "../models/company.js";
import Student from "../models/student.js";

export const addCompany = async (req, res) => {
    try {
        const { companyName, salaryPackage, role, location } = req.body;
        if (!companyName) {
            return res.status(400).json({ success: false, message: "Please provide company name" });
        }
        if (!salaryPackage) {
            return res.status(400).json({ success: false, message: "Please provide salary package" });
        }
        if (!role) {
            return res.status(400).json({ success: false, message: "Please provide role" });
        }
        if (!location) {
            return res.status(400).json({ success: false, message: "Please provide location" });
        }

        const company = await Company.create({ companyName, salaryPackage, role, location });

        return res.status(200).json({
            success: true,
            message: "company added successfully",
            company: company
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        return res.status(200).json({
            success: true,
            message: "companies fetched successfully",
            companies: companies,
            Number_of_companies: companies.length
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findById(id);
        if (!company) {
            return res.status(400).json({ success: false, message: "No company found" });
        }
        return res.status(200).json({
            success: true,
            message: "Company fetched successfully",
            company: company
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { id, ...rest } = req.body;
        const company = await Company.findByIdAndUpdate(id, rest, { new: true });
        if (!company) {
            return res.status(400).json({ success: false, message: "No company found" });
        }
        return res.status(200).json({
            success: true,
            message: "Company updated successfully",
            company: company
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const { id } = req.body;
        const company = await Company.findByIdAndDelete(id);
        if (!company) {
            return res.status(400).json({ success: false, message: "No company found" });
        }
        return res.status(200).json({ success: true, message: "Company deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const applyCompanies = async (req, res) => {
    try {
        const { id } = req.user;
        const { id: compId } = req.params;

        const student = await Student.findById(id);
        const company = await Company.findById(compId);

        if (!student || !company) {
            return res.status(400).json({ success: false, message: "No user or company found" });
        }

        if (student.appliedCompnaies?.includes(compId)) {
            return res.status(400).json({ success: false, message: "Already applied to this company" });
        }

        student.appliedCompnaies.push(compId);
        company.appliedStudents.push(id);
        await student.save();
        await company.save();

        return res.status(200).json({ success: true, message: "Applied successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};