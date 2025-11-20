import React from "react";
import { 
  Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback 
} from "react-native";
import { MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function MusicTodayModal({ visible, onClose, musicData, onPressCreate }) {
  
  const hasMusic = !!musicData;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      {/* 배경 누르면 닫힘 */}
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        
        {/* 내용물 (클릭 시 닫힘 방지) */}
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            
            {/* 헤더 */}
            <View style={styles.headerRow}>
              <Text style={styles.label}>Today's BGM 🎵</Text>
            </View>

            {hasMusic ? (
              // --- 음악이 있을 때 (가데이터 sample_audio) ---
              <>
                <View style={styles.albumCover}>
                  <MaterialCommunityIcons name="music-circle" size={80} color="white" />
                </View>

                <Text style={styles.musicTitle}>{musicData.title}</Text>
                <Text style={styles.artist}>{musicData.artist}</Text>

                <Text style={styles.desc}>
                  {musicData.description || "오늘의 기분에 맞는 음악이 생성되었습니다."}
                </Text>

                <TouchableOpacity style={styles.btnPrimary}>
                  <Ionicons name="play" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.btnText}>재생하기</Text>
                </TouchableOpacity>
              </>
            ) : (
              // --- 음악이 없을 때 ---
              <>
                <View style={styles.emptyIconCircle}>
                  <Feather name="edit-3" size={50} color="#9CA3AF" />
                </View>
                <Text style={styles.emptyTitle}>아직 음악이 없어요</Text>
                <Text style={styles.emptyDesc}>
                  일기를 쓰면 AI가{"\n"}당신만의 음악을 만들어드려요.
                </Text>
                <TouchableOpacity style={styles.btnCreate} onPress={onPressCreate}>
                  <Text style={styles.btnCreateText}>일기 쓰고 음악 받기</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContainer: { 
    width: width * 0.85, backgroundColor: "white", borderRadius: 24, padding: 30, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5
  },
  headerRow: { width: "100%", alignItems: "center", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold", color: "#1E3A8A" },

  // 음악 있을 때
  albumCover: { 
    width: 140, height: 140, backgroundColor: "#1E3A8A", borderRadius: 20, 
    justifyContent: "center", alignItems: "center", marginBottom: 20,
    shadowColor: "#1E3A8A", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8
  },
  musicTitle: { fontSize: 22, fontWeight: "bold", color: "#111827", marginBottom: 6, textAlign: "center" },
  artist: { fontSize: 16, color: "#6B7280", marginBottom: 16 },
  desc: { fontSize: 14, color: "#4B5563", textAlign: "center", lineHeight: 20, marginBottom: 24 },
  btnPrimary: { 
    width: "100%", backgroundColor: "#1E3A8A", paddingVertical: 16, borderRadius: 16, 
    flexDirection: "row", justifyContent: "center", alignItems: "center" 
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },

  // 음악 없을 때
  emptyIconCircle: { 
    width: 100, height: 100, borderRadius: 50, backgroundColor: "#F3F4F6", 
    justifyContent: "center", alignItems: "center", marginBottom: 20 
  },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: "#374151", marginBottom: 10 },
  emptyDesc: { fontSize: 15, color: "#6B7280", textAlign: "center", lineHeight: 22, marginBottom: 24 },
  btnCreate: { 
    width: "100%", backgroundColor: "#EFF6FF", paddingVertical: 16, borderRadius: 16, 
    alignItems: "center", borderWidth: 1, borderColor: "#BFDBFE" 
  },
  btnCreateText: { color: "#1E3A8A", fontWeight: "bold", fontSize: 16 },
});