const API_CONFIG = {
  backendApi: {
    baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth`,
    apiKey: import.meta.env.VITE_API_KEY,
  },
  metaApi: {
    baseURL: `${import.meta.env.VITE_META_END_POINT}`,
    apiKey: "",
  },
};

export default API_CONFIG;
