// src/services/objectService.js
import { USE_API } from "../config/apiConfig";
import { objectApi } from "../api/objectApi";
import { objectsMock } from "../mocks/objectsMock";

export const getAllObjects = () =>
  USE_API ? objectApi.getAll() : objectsMock.getAll();

export const getObjectsByDate = async (date) =>
  USE_API
    ? objectApi.getByDate(date)
    : (await objectsMock.getAll()).filter((obj) => obj.date === date);

export const createObject = (item) =>
  USE_API ? objectApi.create(item) : objectsMock.create(item);

export const deleteObject = (id) =>
  USE_API ? objectApi.delete(id) : objectsMock.delete(id);
