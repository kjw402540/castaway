import React from "react";
import { 
  Modal, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, TouchableWithoutFeedback 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ObjectTodayModal({ visible, onClose, data }) {
  
  // 데이터가 없으면 기본값 (방어 코드)
  const item = data || { name: "알 수 없는 물건", description: "물건을 식별할 수 없습니다." };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      {/* 1. 배경 (TouchableWithoutFeedback으로 감싸서 닫기 기능 구현) */}
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose} // 배경 누르면 닫힘
      >
        {/* 2. 모달 컨텐츠 (이 안을 누를 땐 닫히지 않도록 stopPropagation 역할) */}
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            
            <Text style={styles.subTitle}>Today's Discovery</Text>
            <Text style={styles.title}>오늘의 오브제 발견! ✨</Text>

            {/* 이미지 영역 */}
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image source={item.image} style={styles.realImage} resizeMode="contain" />
              ) : (
                <Ionicons name="gift" size={80} color="#1E3A8A" />
              )}
            </View>

            {/* 텍스트 */}
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>

            {/* 버튼 */}
            <TouchableOpacity style={styles.btn} onPress={onClose}>
              <Text style={styles.btnText}>보관함에 담기</Text>
            </TouchableOpacity>

          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContainer: { 
    width: width * 0.8, backgroundColor: "white", borderRadius: 24, padding: 30, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5
  },
  subTitle: { fontSize: 14, color: "#6B7280", marginBottom: 4, fontWeight: "600" },
  title: { fontSize: 22, fontWeight: "bold", color: "#1E3A8A", marginBottom: 24 },
  
  imageContainer: { 
    width: 140, height: 140, backgroundColor: "#EFF6FF", borderRadius: 70, 
    justifyContent: "center", alignItems: "center", marginBottom: 20,
    borderWidth: 2, borderColor: "#DBEAFE", overflow: "hidden"
  },
  realImage: { width: "80%", height: "80%" }, // 이미지 크기 조절

  itemName: { fontSize: 20, fontWeight: "bold", color: "#111827", marginBottom: 10 },
  description: { fontSize: 15, color: "#4B5563", textAlign: "center", lineHeight: 22, marginBottom: 24 },
  btn: { width: "100%", backgroundColor: "#1E3A8A", paddingVertical: 16, borderRadius: 16, alignItems: "center" },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});