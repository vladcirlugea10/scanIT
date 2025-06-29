import axios from "axios";
import { getExpoServerIP } from "@/utils/expo_server";

const localIP = "26.8.223.162";
const API_URL = `http://${localIP}:5000/api`;

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

//POST
export const _post = (url: string, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
}
//GET
export const _get = (url: string, config = {}) => {
    return apiClient.get(url, config);
}
//PUT
export const _put = (url: string, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
}
//DELETE
export const _delete = (url: string, data = {}, config = {}) => {
    return apiClient.delete(url, { ...config, data });
}