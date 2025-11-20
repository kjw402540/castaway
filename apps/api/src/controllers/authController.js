import * as authService from "../services/authService.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    return res.json({
      ok: true,
      ...result,
    });
  } catch (err) {
    return res.status(400).json({ ok: false, error: err.message });
  }
}
