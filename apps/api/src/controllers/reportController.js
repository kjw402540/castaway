// src/controllers/reportController.js
import * as reportService from "../services/reportService.js";

export async function getAll(req, res) {
  const { user_id } = req.query;
  const list = await reportService.getReportsByUser(user_id);
  res.json({ ok: true, reports: list });
}

export async function getByPeriod(req, res) {
  const { user_id, start, end } = req.query;
  const report = await reportService.getReportByPeriod(user_id, start, end);
  res.json({ ok: true, report });
}

export async function create(req, res) {
  const report = await reportService.createReport(req.body);
  res.json({ ok: true, report });
}

export async function remove(req, res) {
  const { report_id } = req.params;
  await reportService.deleteReport(report_id);
  res.json({ ok: true });
}
