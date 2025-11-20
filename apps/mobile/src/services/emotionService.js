// src/services/emotionService.js
import { USE_API } from "../config/apiConfig";
import { emotionApi } from "../api/emotionApi";
import { emotionMock } from "../mocks/emotionMock";

export const analyzeEmotion = (text) =>
  USE_API ? emotionApi.analyze(text) : emotionMock.analyze(text);
