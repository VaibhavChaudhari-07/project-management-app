import express from "express";
import {
  createTicket,
  getTicketsByProject,
  updateTicketStatus,
  assignUser,
  deleteTicket,
} from "../controllers/ticketController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/:projectId", protect, getTicketsByProject);
router.put("/:id/status", protect, updateTicketStatus);
router.put("/:id/assign", protect, assignUser);
router.delete("/:id", protect, deleteTicket);


export default router;
