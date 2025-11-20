// src/services/objectsService.js
import { USE_API } from "../config/apiConfig";
import { objectsApi } from "../api/objectsApi";
import { objectsMock } from "../mocks/objectsMock";

export const getAllObjects = () =>
  USE_API ? objectsApi.getAll() : objectsMock.getAll();

export const getObjectsByDate = async (date) =>
  USE_API
    ? objectsApi.getByDate(date)
    : (await objectsMock.getAll()).filter((obj) => obj.date === date);

export const createObject = (item) =>
  USE_API ? objectsApi.create(item) : objectsMock.create(item);

export const deleteObject = (id) =>
  USE_API ? objectsApi.delete(id) : objectsMock.delete(id);
