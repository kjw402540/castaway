import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

/**
 * 공통 헤더 컴포넌트
 *
 * props:
 *  - title: 페이지 타이틀
 *  - rightIcon: 오른쪽 아이콘 이름 (FontAwesome)
 *  - onRightPress: 오른쪽 아이콘 클릭 핸들러
 *  - showBack: 뒤로가기 버튼 표시 여부
 */
export default function Header({ title, rightIcon, onRightPress, showBack = true }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <FontAwesome name="arrow-left" size={20} color="#1E3A8A" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 32 }} />
      )}

      <Text style={styles.title}>{title}</Text>

      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.iconBtn}>
          <FontAwesome name={rightIcon} size={20} color="#1E3A8A" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 32 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  iconBtn: {
    padding: 6,
  },
});
