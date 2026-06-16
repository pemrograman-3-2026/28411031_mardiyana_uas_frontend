import axios from "axios";

export const baseURL = 'http://localhost:3100'

export const api = axios.create({
    baseURL
})