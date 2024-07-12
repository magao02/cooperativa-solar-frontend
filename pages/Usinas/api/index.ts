import { api } from "@/data/services/api"
import { EditUsinaRequest, UsinaCreateRequest } from "../types/types";

export const getAllUsersData = async () => {
  const response = await api.get("/users");
  return response.data;
}

export const getAllUsinasData = async () => {
  const response = await api.get("/usinas");
  return response.data;
}

export const usinaCreate = async (usinaBody: UsinaCreateRequest) => {
  const response = await api.post("/usinas", usinaBody);
  return response.data;
}

export const deleteUsina = async(id: number) => {
  const response = await api.delete(`/usinas/${id}`);
  return response.data;
}

export const getUsinaById = async(id: number) => {
  const response = await api.get(`/usinas/${id}`);
  return response.data;
}

export const updateUsina = async(id: number, usinaBody: EditUsinaRequest) => {
  const response = await api.put(`/usinas/${id}`, usinaBody);
  return response.data;
}