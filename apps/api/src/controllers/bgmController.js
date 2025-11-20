import * as service from "../services/bgmService.js";

export async function getByDiary(req, res) {
  const { diary_id } = req.params;
  const list = await service.getByDiary(diary_id);
  res.json(list);
}
