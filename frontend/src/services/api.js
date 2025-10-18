import axios from "axios";

// 🔹 Automatically picks correct backend (Render for live, localhost for dev)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:5001/api";
  
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" } 
});

export const getOverlays = () => api.get("/overlays");
export const createOverlay = (data) => api.post("/overlays", data);
export const updateOverlay = (id, data) => api.put(`/overlays/${id}`, data);
export const deleteOverlay = (id) => api.delete(`/overlays/${id}`);
