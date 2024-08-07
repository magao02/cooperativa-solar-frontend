import { api } from "@/data/services/api";
import { FaturaCreateRequest } from "../../types/types-usuario";

export const createFatura = async (faturaBody: FaturaCreateRequest) => {
  const response = await api.post("/faturas", faturaBody);
  return response.data;
}

export const getUsersData = async (id: number) => {
  const response = await api.get(`/faturas/${id}`);
  return response.data;
}