const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. 워크스페이스 루트의 모듈도 볼 수 있게 함
config.watchFolders = [workspaceRoot];

// 2. node_modules 찾는 순서: [내 폴더] -> [루트 폴더]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. 🚨 [핵심] React와 React Native는 무조건 '내 폴더(mobile)'에 있는 것만 쓰도록 강제
config.resolver.extraNodeModules = {
  "react": path.resolve(projectRoot, "node_modules/react"),
  "react-native": path.resolve(projectRoot, "node_modules/react-native"),
  "@expo/vector-icons": path.resolve(projectRoot, "node_modules/@expo/vector-icons"),
  "expo": path.resolve(projectRoot, "node_modules/expo"),
};

module.exports = config;