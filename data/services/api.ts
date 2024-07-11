import axios from "axios";

export const api = axios.create({
  // prod
  baseURL: "https://cooperativa-solar-backend.onrender.com",
  // dev
  // baseURL: "localhost:8080"
  // headers: {
  //   Authorization: `Bearer ${cookies["sstAuth.token"]}`,
  // },
});