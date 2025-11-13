// 더미 소켓 훅 — 실시간 연결용 placeholder
import { useEffect } from "react";

export default function useSocket() {
  useEffect(() => {
    console.log("🔌 Socket initialized (dummy)");
    return () => console.log("❌ Socket disconnected");
  }, []);

  const emit = (event, data) => {
    console.log(`📡 emit: ${event}`, data);
  };

  const on = (event, callback) => {
    console.log(`🎧 listening to ${event}`);
    // 실제 연결 시 socket.on으로 교체
  };

  return { emit, on };
}
