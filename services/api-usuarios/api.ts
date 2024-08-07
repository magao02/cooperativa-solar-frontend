import { api } from "@/data/services/api";
import { UserCreateRequest } from "../../types/types-usuarios";

export const getAllUsersData = async () => {
  const response = await api.get("/users");
  return response.data;
}

export const createUser = async (userBody: UserCreateRequest) => {
  const response = await api.post("/users", userBody);
  return response.data;
}