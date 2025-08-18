import { Router } from "express";
import {
  listForms,
  createForm,
  getForm,
  updateForm,
  deleteForm,
  duplicateForm,
} from "../controllers/form.controller.js";
const router = Router();
router.get("/", listForms);
router.post("/", createForm);
router.get("/:id", getForm);
router.put("/:id", updateForm);
router.delete("/:id", deleteForm);
router.post("/:id/duplicate", duplicateForm);
export default router;
