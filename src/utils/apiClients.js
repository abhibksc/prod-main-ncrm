import axios from "axios";
import API_CONFIG from "./apiConfig.js";

// Create Axios instance for backend api
export const backendApi = axios.create({
  baseURL: API_CONFIG.backendApi.baseURL,
  headers: {
    "x-api-key": API_CONFIG.backendApi.apiKey, // Attach API key to headers
  },
});
// Create Axios instance for meta api
export const metaApi = axios.create({
  baseURL: API_CONFIG.metaApi.baseURL,
});
