import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const uploadDir = process.env.UPLOAD_DIR || "src/uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const MAX = Number(process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024;
const allowed = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const fileFilter = (req, file, cb) => {
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Unsupported file type"));
};

export const uploader = multer({
  storage,
  limits: { fileSize: MAX },
  fileFilter,
});
