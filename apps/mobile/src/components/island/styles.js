import { StyleSheet, Dimensions } from "react-native";
const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sky: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.55,
  },
  ocean: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
  },
  waves: {
    position: "absolute",
    bottom: height * 0.35,  // 바다 중간쯤으로 조정
    left: 0,
    right: 0,
    width: "100%",
    height: 250,  // 높이 증가
    zIndex: 5,
  },
});