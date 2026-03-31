import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL,
//   withCredentials: false, // JWT is via header, not cookies
// });
// const baseURI = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // JWT is via header, not cookies


});



api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
    const token = localStorage.getItem("jwt_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;