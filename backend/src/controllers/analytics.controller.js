import { Submission } from "../models/submission.model.js";
import { createObjectCsvWriter } from "csv-writer";
import path from "path";
import fs from "fs";

export const getAnalytics = async (req, res, next) => {
  try {
    const formId = req.params.id;
    const submissions = await Submission.find({ formId });
    const total = submissions.length;
    const byDay = {};
    submissions.forEach((s) => {
      const d = new Date(s.createdAt).toISOString().slice(0, 10);
      byDay[d] = (byDay[d] || 0) + 1;
    });
    res.json({ total, byDay });
  } catch (err) {
    next(err);
  }
};

export const exportCSV = async (req, res, next) => {
  try {
    const formId = req.params.id;
    const submissions = await Submission.find({ formId });
    const records = submissions.map((s) => ({
      createdAt: s.createdAt.toISOString(),
      ...s.data,
    }));
    const outDir = "src/uploads/exports";
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const filePath = path.join(outDir, `submissions_${formId}.csv`);
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: Object.keys(records[0] || { createdAt: "" }).map((k) => ({
        id: k,
        title: k,
      })),
    });
    await csvWriter.writeRecords(records);
    res.download(filePath);
  } catch (err) {
    next(err);
  }
};
