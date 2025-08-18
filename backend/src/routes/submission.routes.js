import { Router } from "express";
import {
  createSubmission,
  listSubmissions,
} from "../controllers/submission.controller.js";
import { uploader } from "../controllers/upload.controller.js";
const router = Router({ mergeParams: true });
router.post("/:id/submissions", uploader.array("files", 10), createSubmission);
router.get("/:id/submissions", listSubmissions);
export default router;
