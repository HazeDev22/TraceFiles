// axiosConfig.js - Updated version
import axios from 'axios'

const DefaultAPIRoute = "http://20.0.0.222:8000";
const api = `${DefaultAPIRoute}/api/`;

const clearAccessToken = () => {
    localStorage.removeItem("access_token"); // Fix: should match the key used below
};

axios.defaults.baseURL = api;

axios.interceptors.request.use(
    (config) => {
        // Fix: Use consistent key name
        config.headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;
        
        // Fix: Don't override headers multiple times, combine them
        config.headers["Access-Control-Allow-Origin"] = "*";
        config.headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, OPTIONS, DELETE";
        config.headers["Access-Control-Allow-Headers"] = "Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type, Authorization";
        
        // Fix: Don't force Accept header for file uploads
        if (!config.headers["Content-Type"]) {
            config.headers["Accept"] = "application/json";
        }

        return config;
    },
    (error) => {
        return Promise.reject(error); // Fix: add return
    }
);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        console.log(error);

        if (error.response && error.response.status === 401) {
            clearAccessToken();
            return Promise.reject(error);
        }
        if (error.response && error.response.status === 403) {
            clearAccessToken();
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);
