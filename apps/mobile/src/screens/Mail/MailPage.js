// src/screens/Mail/MailPage.js
// 알림 목록 화면
// 읽음 처리, 선택/삭제, 전체삭제, 상세 보기 지원

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { useNotification } from "./hooks/useNotification";
import NotificationDetailModal from "./NotificationDetailModal";
import { useBackExit } from "../../hooks/useBackExit";
import { formatMailDate } from "../../utils/formatMailDate";

// 임시 체크 아이콘 (선택 UI)
const CheckIcon = ({ isSelected }) => (
  <View
    style={[
      styles.checkIcon,
      isSelected ? styles.checkSelected : styles.checkUnselected,
    ]}
  >
    {isSelected && <Text style={{ color: "white", fontSize: 10 }}>✓</Text>}
  </View>
);

export default function MailPage() {
  const {
    list, // 알림 목록
    selectedIds,
    isEditMode,
    isLoading,
    detailItem,
    setDetailItem,
    toggleSelect,
    setIsEditMode,
    handleDeleteSelected,
    handleMarkAsRead,
    toggleSelectAll,
    handleSelectAllDelete,
  } = useNotification();

  // 뒤로가기 앱 종료 (홈화면이 아닌 경우)
  useBackExit();

  const isAllSelected = selectedIds.length === list.length && list.length > 0;
  const isAnySelected = selectedIds.length > 0;

  const renderNotification = ({ item }) => {
    const isSelected = selectedIds.includes(item.notify_id);

    return (
      <TouchableOpacity
        style={[styles.card, isEditMode && styles.cardEdit]}
        onPress={() =>
          isEditMode ? toggleSelect(item.notify_id) : setDetailItem(item)
        }
        onLongPress={() => setIsEditMode(true)}
      >
        {isEditMode && <CheckIcon isSelected={isSelected} />}

        <View style={styles.content}>
          <Text
            style={[styles.title, item.is_read && styles.titleRead]}
            numberOfLines={1}
          >
            {item.title}
          </Text>

          <Text style={styles.date}>
            {formatMailDate(item.created_date)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // 로딩 중 화면
  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 상단 제목 + 편집 버튼 */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>알림</Text>

        <TouchableOpacity onPress={() => setIsEditMode(!isEditMode)}>
          <Text style={styles.actionText}>
            {isEditMode ? "나가기" : "편집"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 알림 없는 경우 */}
      {list.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>아직 도착한 알림이 없어요.</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          renderItem={renderNotification}
          keyExtractor={(item) => String(item.notify_id)}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* 삭제 ActionBar */}
      {isEditMode && (
        <View style={styles.deleteActionBar}>
          <TouchableOpacity onPress={toggleSelectAll} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>
              {isAllSelected ? "전체 해제" : "전체 선택"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteSelected}
            style={[styles.deleteBtn, !isAnySelected && styles.deleteBtnDisabled]}
            disabled={!isAnySelected}
          >
            <Text style={styles.deleteText}>
              선택 삭제 ({selectedIds.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSelectAllDelete}
            style={styles.deleteBtn}
          >
            <Text style={styles.deleteText}>모두 삭제</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 상세 모달 */}
      <NotificationDetailModal
        visible={!!detailItem}
        notification={detailItem}
        onClose={() => setDetailItem(null)}
        onMarkAsRead={handleMarkAsRead}
      />
    </View>
  );
}

// ------------------------------------------------
// 스타일
// ------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A7D8FF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  center: { justifyContent: "center", alignItems: "center" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  actionText: {
    fontSize: 16,
    color: "#1E3A8A",
    fontWeight: "600",
  },
  listContent: { paddingBottom: 20 },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  cardEdit: {
    paddingLeft: 10,
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  titleRead: {
    color: "#6B7280",
    fontWeight: "400",
  },
  date: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkSelected: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
  },
  checkUnselected: { backgroundColor: "white" },
  emptyBox: {
    marginTop: 60,
    backgroundColor: "rgba(255,255,255,0.5)",
    paddingVertical: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#4B5563",
    fontWeight: "500",
  },
  deleteActionBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1E3A8A",
    paddingVertical: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  deleteBtn: { paddingVertical: 8, paddingHorizontal: 15 },
  deleteBtnDisabled: { opacity: 0.5 },
  deleteText: {
    color: "white",
    fontWeight: "700",
    fontSize: 20,
  },
});
