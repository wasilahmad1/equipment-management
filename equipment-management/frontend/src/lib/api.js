const BASE_URL = 'http://localhost:8080/api'

async function request(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw error
  }
  if (response.status === 204) return null
  return response.json()
}

export const equipmentApi = {
  getAll: (status) => request(`/equipment${status ? `?status=${status}` : ''}`),
  create: (data) => request('/equipment', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/equipment/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/equipment/${id}`, { method: 'DELETE' }),
}

export const equipmentTypeApi = {
  getAll: () => request('/equipment-types'),
}

export const maintenanceApi = {
  create: (data) => request('/maintenance', { method: 'POST', body: JSON.stringify(data) }),
  getByEquipment: (equipmentId) => request(`/equipment/${equipmentId}/maintenance`),
}
