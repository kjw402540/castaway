import * as userService from "../services/userService.js";

/* 기본 기존 기능 --------------------------------------- */
export async function register(req, res) {
  try {
    const { email, password, nickname } = req.body;
    const user = await userService.register({ email, password, nickname });

    return res.json({
      ok: true,
      user: {
        user_id: user.user_id,
        email: user.email,
        nickname: user.nickname,
      },
    });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userService.login({ email, password });

    return res.json({
      ok: true,
      user: {
        user_id: user.user_id,
        email: user.email,
        nickname: user.nickname,
      },
    });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
}

export async function me(req, res) {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id 필요" });

    const user = await userService.getById(user_id);
    res.json({ ok: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateSettings(req, res) {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: "user_id 필요" });

    const updated = await userService.updateSettings(user_id, req.body);
    res.json({ ok: true, user: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/* 새 기능 --------------------------------------------- */

// GET /user/profile
export async function getProfile(req, res) {
  try {
    const user_id = req.query.user_id;
    if (!user_id) return res.status(400).json({ error: "user_id 필요" });

    const profile = await userService.getProfile(user_id);
    res.json({ ok: true, profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PATCH /user/profile
export async function updateProfile(req, res) {
  try {
    const { user_id, nickname, profile_image } = req.body;

    if (!user_id) return res.status(400).json({ error: "user_id 필요" });

    const updated = await userService.updateProfile(user_id, {
      nickname,
      profile_image,
    });

    res.json({ ok: true, profile: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE /user/delete
export async function deleteAccount(req, res) {
  try {
    const { user_id } = req.body;

    if (!user_id) return res.status(400).json({ error: "user_id 필요" });

    await userService.deleteAccount(user_id);
    res.json({ ok: true, message: "계정 삭제 완료" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// POST /user/cluster-sync
export async function syncCluster(req, res) {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: "user_id 필요" });

    const cluster = await userService.syncCluster(user_id);
    res.json({ ok: true, cluster });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// GET /user/noti
export async function getNotificationSettings(req, res) {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id 필요" });

    const noti = await userService.getNotificationSettings(user_id);
    res.json({ ok: true, noti });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PATCH /user/noti
export async function updateNotificationSettings(req, res) {
  try {
    const { user_id, ...settings } = req.body;
    if (!user_id) return res.status(400).json({ error: "user_id 필요" });

    const updated = await userService.updateNotificationSettings(
      user_id,
      settings
    );
    res.json({ ok: true, noti: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// GET /user/report
export async function getReport(req, res) {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id 필요" });

    const report = await userService.getReport(user_id);
    res.json({ ok: true, report });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
