// src/services/userService.js
import { USE_API } from "../config/apiConfig";
import { userApi } from "../api/userApi";
import { userMock } from "../mocks/userMock";

export const getUser = () =>
  USE_API ? userApi.get() : userMock.get();

export const updateUser = (data) =>
  USE_API ? userApi.update(data) : userMock.update(data);

export const logoutUser = () =>
  USE_API ? userApi.logout() : userMock.logout();

export const deleteUser = () =>
  USE_API ? userApi.delete() : userMock.delete();
