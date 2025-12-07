// src/screens/Mail/NotificationDetailModal.js
// 알림 상세 보기 모달
// 읽음 처리 포함 (handleMarkAsRead로 서버+프론트 동기화)

import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { formatMailDate } from "../../utils/formatMailDate";
// ▼ 방금 만든 서비스 함수 import
import { getLatestSharedObject } from "../../services/objectService";

export default function NotificationDetailModal({
  visible,
  notification,
  onClose,
  onMarkAsRead,
}) {
  const [objectData, setObjectData] = useState(null); // 오브제 이미지, 키워드 저장
  const [loadingObj, setLoadingObj] = useState(false);

  // ----------------------------------------------
  // 모달 열릴 때: 읽음 처리 & 오브제 정보 로드
  // ----------------------------------------------
  useEffect(() => {
    if (visible && notification) {
      // 1. 읽음 처리
      if (!notification.is_read) {
        onMarkAsRead(notification.notify_id);
      }

      // 2. 공유 알림(type === 2)이면 오브제 정보 가져오기
      if (notification.type === 2) {
        fetchSharedObject();
      } else {
        setObjectData(null); // 다른 알림이면 초기화
      }
    }
  }, [visible, notification]);

  const fetchSharedObject = async () => {
    setLoadingObj(true);
    // 실제 서버에서 가져오는 함수 호출
    const data = await getLatestSharedObject();
    
    // [임시] 서버 연결 전 테스트용 더미 데이터 (서버 연결되면 제거하세요)
    // const dummyData = {
    //   object_image: "https://via.placeholder.com/150", // 테스트 이미지 URL
    //   keywords: ["편안함", "새벽", "따뜻한 차"],
    // };
    
    setObjectData(data); // or dummyData
    setLoadingObj(false);
  };

  if (!notification) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* 헤더 */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>
              {notification.type === 2 ? "🎁 선물 도착" : "알림 상세"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentBox}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.date}>
              {formatMailDate(notification.created_date)}
            </Text>
            <Text style={styles.message}>
              {notification.message || "내용 없음"}
            </Text>

            {/* ▼ [NEW] 공유 오브제 데이터 표시 영역 */}
            {notification.type === 2 && (
              <View style={styles.objectContainer}>
                {loadingObj ? (
                  <ActivityIndicator color="#1E3A8A" size="small" />
                ) : objectData ? (
                  <>
                    {/* 1. 오브제 이미지 */}
                    <View style={styles.imageWrapper}>
                      <Image
                        source={{ uri: objectData.object_image }}
                        style={styles.objectImage}
                        resizeMode="contain"
                      />
                    </View>

                    {/* 2. 키워드 태그 */}
                    {objectData.keywords && objectData.keywords.length > 0 && (
                      <View style={styles.tagContainer}>
                        {objectData.keywords.map((k, i) => (
                          <View key={i} style={styles.tagBadge}>
                            <Text style={styles.tagText}>#{k}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    
                    <Text style={styles.guideText}>
                      이 오브제가 보관함에 추가되었습니다.
                    </Text>
                  </>
                ) : (
                  // 데이터 로드 실패 시
                  <Text style={styles.errorText}>
                    오브제 정보를 불러올 수 없습니다.
                  </Text>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ------------------------------------------------
// 스타일 추가
// ------------------------------------------------
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "86%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 24,
    maxHeight: "80%",
    // 그림자 효과
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  closeText: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "500",
  },
  contentBox: {
    marginTop: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  message: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 20,
  },
  // ▼ 오브제 관련 스타일
  objectContainer: {
    marginTop: 10,
    padding: 16,
    backgroundColor: "#F0F9FF", // 연한 하늘색 배경
    borderRadius: 16,
    alignItems: "center",
  },
  imageWrapper: {
    width: 120,
    height: 120,
    marginBottom: 12,
    backgroundColor: "white",
    borderRadius: 60, // 원형 배경
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  objectImage: {
    width: "100%",
    height: "100%",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    marginBottom: 10,
  },
  tagBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  tagText: {
    fontSize: 12,
    color: "#1E40AF",
    fontWeight: "600",
  },
  guideText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  errorText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});