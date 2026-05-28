import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config) => {
    const aToken = localStorage.getItem('aToken')
    const dToken = localStorage.getItem('dToken')
    
    if (aToken) config.headers.atoken = aToken
    if (dToken) config.headers.dtoken = dToken
    
    return config
})

export default api