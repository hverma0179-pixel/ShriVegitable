import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const api = {
  products: {
    list: (params) => API.get('/products', { params }),
    categories: () => API.get('/categories'),
    create: (data) => API.post('/products', data),
    update: (id, data) => API.put(`/products/${id}`, data),
    delete: (id) => API.delete(`/products/${id}`)
  },
  admin: {
    login: (email, password) => API.post('/admin/login', { email, password })
  },
  orders: {
    create: (data) => API.post('/orders', data),
    list: () => API.get('/orders')
  }
}

export default API