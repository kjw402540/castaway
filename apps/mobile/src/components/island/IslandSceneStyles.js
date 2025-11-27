import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

// 섬 기준 anchor (섬 중앙에 고정)
const ISLAND_WIDTH = 370;
const ISLAND_HEIGHT = 300;

export const islandStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  skyContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: "10%",
  },

  seaContainer: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    bottom: 0,
  },

  wave: {
    position: "absolute",
    bottom: height * 0.22,
    width: 330,
    height: 150,
    opacity: 0.9,
    zIndex: 4,
  },

  islandWrapper: {
    position: "absolute",
    bottom: height * 0.1,     // ★ 가장 중요한 부분
    width: ISLAND_WIDTH,
    height: ISLAND_HEIGHT,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 5,
  },


  /* ===== GROUND ===== */
  ground: {
    width: ISLAND_WIDTH,
    height: ISLAND_HEIGHT,
    resizeMode: "contain",
  },

  /* ===== 돌 ===== */
  rock: {
    width: 170,
    height: 90,
    resizeMode: "contain",
    position: "absolute",
    bottom: 165,
    left: (ISLAND_WIDTH - 180) / 2,
    zIndex: 9,
  },

  /* ===== CHEST ===== */
  chestWrapper: {
    position: "absolute",
    bottom: 100,                // ★ 섬 위치에 맞춰 내려줌
    left: ISLAND_WIDTH - 365,
    zIndex: 10,
  },


  chest: {
    width: 130,
    height: 130,
    resizeMode: "contain",
  },

  /* ===== TURNTABLE ===== */
  turntableWrapper: {
    position: "absolute",
    bottom: 80,                // ★ 동일하게 보정
    right: (ISLAND_WIDTH - 380) / 2,
    zIndex: 10,
  },

  turntable: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },

  /* ===== MOVE EFFECT ===== */
  moveEffect: {
    position: "absolute",
    bottom: 115,
    right: ISLAND_WIDTH * 0.08 + 21,
    width: 75,
    height: 50,
    opacity: 0.9,
    zIndex: 20,
  },
});