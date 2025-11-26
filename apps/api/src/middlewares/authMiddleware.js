// (API) src/middlewares/authMiddleware.js
import { verifyToken } from "../lib/jwt.js";

export function authRequired(req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "인증이 필요합니다." });
    }

    const token = auth.split(" ")[1];
    const payload = verifyToken(token);

    // 이후 컨트롤러에서 req.user.id 이렇게 쓸 수 있게
    req.user = {
      id: payload.id,
      kakaoId: payload.kakaoId,
    };

    next();
  } catch (err) {
    console.error("authRequired error:", err);
    return res.status(401).json({ message: "토큰이 유효하지 않습니다." });
  }
}
