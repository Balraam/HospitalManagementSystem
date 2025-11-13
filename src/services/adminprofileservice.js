import axios from "axios";
import { API_BASE } from "./apiConfig";

export const getAdminById = async (id) => {
  const res = await axios.get(`${API_BASE}/admins/${id}`);
  return res.data;
};

export const updateAdmin = async (id, updatedData) => {
  const res = await axios.put(`${API_BASE}/admins/${id}`, updatedData);
  return res.data;
};
