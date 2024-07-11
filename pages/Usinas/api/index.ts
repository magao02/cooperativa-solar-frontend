import { api } from "@/data/services/api"
import { UsinaCreateRequest } from "../types/types";

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