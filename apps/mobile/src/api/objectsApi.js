// src/api/objectApi.js
import { httpClient } from "./client";

export const objectsApi = {
  getAll: () => httpClient.get("/object"),

  getByDate: (date) => httpClient.get(`/object/${date}`),

  delete: (id) => httpClient.delete(`/object/item/${id}`),
};
