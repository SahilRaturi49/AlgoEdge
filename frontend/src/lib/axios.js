import axios from 'axios';



export const axiosInstance = axios.create({
    // baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api/v1" : "/api/v1",
    baseURL: import.meta.env.VITE_API_URL,

    withCredentials: true,
})
