const BASE = '/api'

function headers(extra = {}) {
  const h = { 'Content-Type': 'application/json', ...extra }
  const token = localStorage.getItem('adminToken')
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: headers(opts.headers)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'Request failed')
  }
  return res.json()
}

export const api = {
  products: {
    list: (params) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : ''
      return req(`/products${qs}`)
    },
    categories: () => req('/categories'),
    create: (data) => req('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => req(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => req(`/products/${id}`, { method: 'DELETE' })
  },
  admin: {
    login: (email, password) => req('/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  },
  orders: {
    create: (data) => req('/orders', { method: 'POST', body: JSON.stringify(data) }),
    list: () => req('/orders')
  }
}