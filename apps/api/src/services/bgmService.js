export const getByDiary = async (req, res, next) => {
  try {
    const list = await bgmService.getByDiary(Number(req.params.diaryId));
    res.json(list);
  } catch (err) { next(err); }
};

export const getAll = async (req, res, next) => {
  try {
    const list = await bgmService.getAll(1);
    res.json(list);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    res.json({ ok: true });
  } catch (err) { next(err); }
};
