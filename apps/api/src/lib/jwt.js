// (API) src/lib/jwt.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * 우리 user 레코드 기준으로 JWT 발급
 * user.user_id / user.kakao_id 사용
 */
export function signToken(user) {
  const payload = {
    id: user.user_id,               // 🔥 DB 컬럼 user_id → JWT payload.id
    kakaoId: user.kakao_id ?? null,
  };

  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * JWT 검증
 */
export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
