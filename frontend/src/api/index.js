import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

// 请求拦截器 - 添加 token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 登录
export const login = (data) => api.post('/login', data)

// 注册
export const register = (data) => api.post('/register', data)

// 获取笔记列表
export const getNotes = () => api.get('/notes')

// 获取单个笔记
export const getNote = (id) => api.get(`/notes/${id}`)

// 创建笔记
export const createNote = (data) => api.post('/notes', data)

// 更新笔记
export const updateNote = (id, data) => api.put(`/notes/${id}`, data)

// 删除笔记
export const deleteNote = (id) => api.delete(`/notes/${id}`)

export default api
