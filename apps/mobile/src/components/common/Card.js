import React from "react";
import { View, StyleSheet } from "react-native";

/**
 * Card 컴포넌트
 * 공통으로 쓰이는 박스 레이아웃 (ReportPage, ProfilePage 등)
 * 
 * props:
 *  - children: 내부 콘텐츠
 *  - style: 추가 스타일
 *  - shadow: 그림자 여부 (기본 true)
 */
export default function Card({ children, style, shadow = true }) {
  return (
    <View style={[styles.card, shadow && styles.shadow, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
});
