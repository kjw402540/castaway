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
    bottom: "50%",
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
    bottom: height * 0.29,
    width: 330,
    height: 150,
    opacity: 0.9,
    zIndex: 4,
  },

  islandWrapper: {
    position: "absolute",
    bottom: height * 0.2,
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
    bottom: 180,
    left: (ISLAND_WIDTH - 180) / 2,
    zIndex: 9,
  },

  /* ===== CHEST ===== */
  chestWrapper: {
    position: "absolute",
    bottom: 110,
    left: ISLAND_WIDTH - 375,
    zIndex: 10,
  },

  chest: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },

  /* ===== TURNTABLE ===== */
  turntableWrapper: {
    position: "absolute",
    bottom: 90,
    right: (ISLAND_WIDTH - 400) / 2,
    zIndex: 10,
  },

  turntable: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },

  /* ===== MOVE EFFECT ===== */
  moveEffect: {
    position: "absolute",
    bottom: 120,
    right: ISLAND_WIDTH * 0.08 + 40,
    width: 60,
    height: 20,
    opacity: 0.9,
    zIndex: 20,
  },
});