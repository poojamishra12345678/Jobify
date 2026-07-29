import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  register,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
  findUsersById,
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getAllUser", verifyToken,getAllUsers);
router.put("/updateUser/:id",verifyToken, updateUser);
router.delete("/deleteUser/:id", verifyToken,isAdmin,deleteUser);
router.get("/findUsersById/:id", verifyToken,findUsersById);

export default router;