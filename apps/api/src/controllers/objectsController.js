// src/controllers/objectsController.js
import * as objectsService from "../services/objectsService.js";

export async function getAll(req, res) {
  try {
    const list = await objectsService.getAll();
    res.json({ ok: true, objects: list });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

export async function getByDate(req, res) {
  try {
    const { diary_id } = req.params;
    const object = await objectsService.getByDiaryId(diary_id);
    res.json({ ok: true, object });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const { object_id } = req.params;
    await objectsService.remove(object_id);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
