import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5001/api"; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" } 
});

export const getOverlays = () => api.get("/overlays");
export const createOverlay = (data) => api.post("/overlays", data);
export const updateOverlay = (id, data) => api.put(`/overlays/${id}`, data);
export const deleteOverlay = (id) => api.delete(`/overlays/${id}`);
