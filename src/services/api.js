/**
 * API сервис для Laravel backend
 * Автоматически добавляет Bearer токен и обрабатывает ошибки валидации
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function getToken() {
  return localStorage.getItem('auth_token')
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

function getHeaders(includeAuth = false) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  const token = getToken()
  if (includeAuth && token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

/**
 * Обработка ответа API
 * @returns {Promise<object>}
 */
async function handleResponse(response) {
  const text = await response.text()
  const data = text ? JSON.parse(text) : {}

  if (!response.ok) {
    const err = new Error(data.message || 'Ошибка запроса')
    err.status = response.status
    err.errors = data.errors || null
    err.data = data
    throw err
  }

  return data
}

/**
 * POST /api/register
 */
export async function register({ name, email, password, password_confirmation }) {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password, password_confirmation }),
  })
  return handleResponse(response)
}

/**
 * POST /api/login
 */
export async function login({ email, password }) {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  })
  return handleResponse(response)
}

/**
 * POST /api/logout
 */
export async function logout() {
  const response = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    headers: getHeaders(true),
  })
  await handleResponse(response)
  setToken(null)
}

/**
 * GET /api/user
 */
export async function getMe() {
  const response = await fetch(`${API_BASE}/user`, {
    headers: getHeaders(true),
  })
  return handleResponse(response)
}

/**
 * POST /api/forgot-password
 */
export async function forgotPassword({ email }) {
  const response = await fetch(`${API_BASE}/forgot-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email }),
  })
  return handleResponse(response)
}

/**
 * POST /api/reset-password
 */
export async function resetPassword({ email, token, password, password_confirmation }) {
  const response = await fetch(`${API_BASE}/reset-password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, token, password, password_confirmation }),
  })
  return handleResponse(response)
}
