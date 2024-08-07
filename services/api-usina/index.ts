import { api } from "@/data/services/api";
import { UserCreateRequest } from "../../types/types-usina";

export const createUser = async (userBody: UserCreateRequest) => {
  const response = await api.post("/users", userBody);
  return response.data;
}

export const findUsersByUsinaId = async (id: number) => {
  const response = await api.get(`/users/usina/${id}`);
  return response.data;
}

export const getUsinaById = async (id: number) => {
  const response = await api.get(`/usinas/${id}`);
  return response.data;
}