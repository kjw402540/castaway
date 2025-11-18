// src/components/NoticeModal.js

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import BaseModal from "../common/BaseModal"; // 경로 수정 필요
import useNotice from "./useNotice"; // 경로 수정 필요
import { MaterialCommunityIcons } from "@expo/vector-icons"; // 아이콘 예시

export default function NoticeModal({ visible, onClose }) {
  const { notices, isLoading, error, handleCheck } = useNotice(visible, onClose);

  if (!visible) return null; // invisible일 때 렌더링 차단

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="small" color="#111827" />
          <Text style={styles.statusText}>알림을 불러오는 중...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#EF4444" />
          <Text style={[styles.statusText, { color: "#EF4444" }]}>{error}</Text>
        </View>
      );
    }

    if (notices.length === 0) {
      return (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>새로운 알림이 없습니다.</Text>
        </View>
      );
    }

    // 알림 목록 렌더링
    return (
      <View>
        {notices.map((notice) => (
          <View key={notice.id}>
            <View style={styles.itemRow}>
              {/* isNew 값에 따라 닷 표시 */}
              {notice.isNew && <View style={styles.dot} />}
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{notice.title}</Text>
                <Text style={styles.itemDesc}>{notice.description}</Text>
              </View>

              {/* 리포트 타입에만 '확인' 버튼을 보여주는 로직 추가 가능 */}
              {notice.type === 'report' && (
                <TouchableOpacity 
                  style={styles.checkBtn} 
                  onPress={() => handleCheck(notice)}
                >
                  <Text style={styles.checkText}>확인</Text>
                </TouchableOpacity>
              )}
              
            </View>
            <View style={styles.divider} />
          </View>
        ))}
      </View>
    );
  };

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.box}>
        <Text style={styles.title}>알림</Text>
        {renderContent()}
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    paddingTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  statusText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  itemDesc: {
    fontSize: 13,
    color: "#6B7280",
  },
  checkBtn: {
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },
  checkText: { color: "white", fontWeight: "600" },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 12,
  },
});