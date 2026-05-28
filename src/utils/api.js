import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    const pToken = localStorage.getItem('PToken')
    const aToken = localStorage.getItem('aToken')
    
    if (token) config.headers.token = token
    if (pToken) config.headers.PToken = pToken
    if (aToken) config.headers.atoken = aToken
    
    return config
})

export default api