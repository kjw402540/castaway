export function validateRegister(data) {
  if (!data.nickname) throw new Error("nickname은 필수입니다.");
  if (!data.email) throw new Error("email은 필수입니다.");
  if (!data.password_hash) throw new Error("password는 필수입니다.");
  if (!data.cluster_id) throw new Error("cluster_id는 필수입니다.");
}

export function validateLogin(email, password) {
  if (!email) throw new Error("email이 필요합니다.");
  if (!password) throw new Error("password가 필요합니다.");
}

export function validateUpdate(data) {
  const allowed = [
    "nickname",
    "bgm_volume",
    "sfx_volume",
    "diary_reminder",
    "used_flag",
  ];

  Object.keys(data).forEach((key) => {
    if (!allowed.includes(key)) {
      throw new Error(`업데이트할 수 없는 필드입니다: ${key}`);
    }
  });
}
