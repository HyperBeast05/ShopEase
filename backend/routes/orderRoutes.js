import express from "express";
import {
  cancelOrder,
  createOrder,
  getAdminOrderById,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getMyOrders);
router.get("/admin/all", protect, adminOnly, getAllOrders);
router.get("/admin/:id", protect, adminOnly, getAdminOrderById);
router.put("/admin/:id/status", protect, adminOnly, updateOrderStatus);
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);

export default router;
