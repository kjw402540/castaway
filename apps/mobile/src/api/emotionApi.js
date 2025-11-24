// src/api/emotionApi.js
import { httpClient } from "./client";

export const emotionApi = {
  analyze: (text) => httpClient.post("/api/emotion", { text }),

};
