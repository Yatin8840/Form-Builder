import { Router } from "express";
import { uploader } from "../controllers/upload.controller.js";
const router = Router();
router.post("/upload", uploader.array("files", 10), (req, res) => {
  const files = (req.files || []).map((f) => ({
    filename: f.filename,
    url: `/uploads/${f.filename}`,
    mimetype: f.mimetype,
    size: f.size,
  }));
  res.json({ files });
});
export default router;
