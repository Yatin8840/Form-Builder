import { Router } from "express";
import {
  getAnalytics,
  exportCSV,
} from "../controllers/analytics.controller.js";
const router = Router({ mergeParams: true });
router.get("/:id/analytics", getAnalytics);
router.get("/:id/analytics/export", exportCSV);
export default router;
