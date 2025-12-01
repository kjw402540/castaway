// src/api/notificationApi.js
import { httpClient } from "./client";

export const notificationApi = {
  getAll: (type) =>
    httpClient.get(
      type !== undefined ? `/notification?type=${type}` : `/notification`
    ),
  getById: (id) => httpClient.get(`/notification/${id}`),
  create: (payload) => httpClient.post(`/notification`, payload),
  markAsRead: (id) => httpClient.patch(`/notification/${id}/read`),
  delete: (id) => httpClient.delete(`/notification/${id}`),
};
