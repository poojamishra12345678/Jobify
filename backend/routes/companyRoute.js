import express from "express"
import { addCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany, applyCompanies } from "../controllers/companyController.js"
import { verifyToken } from '../middleware/auth.js';
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post('/', verifyToken, isAdmin, addCompany)
router.get('/', getAllCompanies);
router.get("/:id", getCompanyById);
router.put("/", verifyToken, isAdmin, updateCompany);
router.delete("/", verifyToken, isAdmin, deleteCompany);
router.post('/apply/:id', verifyToken, applyCompanies)

export default router;
