import { StyleSheet } from "react-native";

// 섬 기준 anchor
const ISLAND_WIDTH = 370;

export const treeStyles = StyleSheet.create({
  treeContainer: {
    position: "absolute",
    width: ISLAND_WIDTH,
    height: 500,
    bottom: 0,
    right: ISLAND_WIDTH - 315,
    alignItems: "center",
    zIndex: 8,
  },

  /* ===== TREE ===== */
  tree: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    position: "absolute",
    bottom: 165,
    left: (ISLAND_WIDTH - 285) / 2,
    zIndex: 2,
  },

  /* ===== LEAVES (나무 꼭대기에 야자수처럼) ===== */
  // 오른쪽 가장 하단
  leaf1: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    position: "absolute",
    bottom: 353,
    left: (ISLAND_WIDTH - 120) / 2 + 40,
    zIndex: 10,
  },
  // 오른쪽 두번째
  leaf2: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    position: "absolute",
    bottom: 370,
    left: ISLAND_WIDTH - 385 / 2,
    zIndex: 9,
  },
  // 왼쪽 제일 하단
  leaf3: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    position: "absolute",
    bottom: 330,
    left: (ISLAND_WIDTH - 185) / 2,
    zIndex: 10,
  },
  // 왼쪽 두 번째
  leaf4: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    position: "absolute",
    bottom: 366,
    left: (ISLAND_WIDTH - 270) / 2,
    zIndex: 9,
  },
  // 오른쪽 제일 상단
  leaf5: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    position: "absolute",
    bottom: 408,
    left: (ISLAND_WIDTH - 25) / 2,
    zIndex: 4,
  },
  // 왼쪽 가장 첫번째
  leaf6: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    position: "absolute",
    bottom: 410,
    left: (ISLAND_WIDTH - 205) / 2,
    zIndex: 4,
  },
  // 왼쪽 세 번째
  leaf7: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    position: "absolute",
    bottom: 360,
    left: (ISLAND_WIDTH - 200) / 2,
    zIndex: 3,
  },
});