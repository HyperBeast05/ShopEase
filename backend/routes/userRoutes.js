import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import {
  getAllCustomers,
  getCustomerById,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/admin/all", protect, adminOnly, getAllCustomers);
router.get("/admin/:id", protect, adminOnly, getCustomerById);
router.put("/profile", protect, updateProfile);

export default router;
