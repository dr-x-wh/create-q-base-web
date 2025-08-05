import axios from "axios";

const request = axios.create({
    baseURL: '/api', timeout: 30000,
})

request.interceptors.request.use(async (config) => {
    return config
}, async (error) => {
    return Promise.reject(error)
})
request.interceptors.response.use(async (response) => {
    return response
}, async (error) => {
    return Promise.reject(error)
})

export default request
