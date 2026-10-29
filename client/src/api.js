// client/src/api.js
// Una sola función para hablar con la API: pone el token, el JSON y maneja errores.

const API = 'http://localhost:3000/api'

export async function apiFetch(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token')

  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    // Tu API responde el error en "mensaje", "message" o "error" según el controller
    throw new Error(data?.mensaje || data?.message || data?.error || 'Error en la petición')
  }
  return data
}
