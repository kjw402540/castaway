// src/screens/Mail/NotificationDetailModal.js
// 알림 상세 보기 모달
// 읽음 처리 포함 (handleMarkAsRead로 서버+프론트 동기화)

import React, { useEffect } from "react";
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from "react-native";
import { formatMailDate } from "../../utils/formatMailDate";

export default function NotificationDetailModal({
  visible,
  notification,
  onClose,
  onMarkAsRead,
}) {
  
  // ----------------------------------------------
  // 모달 열릴 때 자동으로 읽음 처리
  // (이미 읽은 알림은 skip)
  // ----------------------------------------------
  useEffect(() => {
    if (visible && notification && !notification.is_read) {
      onMarkAsRead(notification.notify_id);
    }
  }, [visible, notification]);

  if (!notification) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          
          {/* 헤더 */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>알림 상세</Text>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>

          {/* 내용 */}
          <ScrollView style={styles.contentBox}>
            <Text style={styles.title}>{notification.title}</Text>

            {/* 생성 날짜 */}
            <Text style={styles.date}>
              {formatMailDate(notification.created_date)}
            </Text>

            {/* 내용 (줄바꿈 유지) */}
            <Text style={styles.message}>
              {notification.message || "내용 없음"}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ------------------------------------------------
// 스타일
// ------------------------------------------------
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "86%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 22,
    maxHeight: "70%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  closeText: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "600",
  },
  contentBox: {
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 20,
  },
});
