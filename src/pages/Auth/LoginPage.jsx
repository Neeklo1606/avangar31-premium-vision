import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Checkbox } from '../../components/ui'
import FormField from '../../components/ui/FormField'
import { login, setToken } from '../../services/api'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setGeneralError('')
    setLoading(true)

    try {
      const data = await login({ email, password })
      setToken(data.token)
      if (remember && data.token) {
        localStorage.setItem('auth_remember', '1')
      }
      navigate('/')
      window.location.reload()
    } catch (err) {
      setLoading(false)
      if (err.errors) {
        setErrors(err.errors)
      } else if (err.message) {
        setGeneralError(err.message)
      } else {
        setGeneralError('Ошибка входа. Попробуйте позже.')
      }
    }
  }

  const getFieldError = (field) => {
    const arr = errors[field]
    return Array.isArray(arr) ? arr[0] : null
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="bg-white rounded-xl shadow-lg border border-gray-light/30 p-6 sm:p-8">
        <h1 className="text-dark text-2xl font-rubik font-bold mb-1">Вход</h1>
        <p className="text-gray-medium text-sm font-rubik mb-6">
          Войдите в аккаунт, чтобы сохранять избранное и управлять заявками
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {generalError && (
            <div className="px-3 py-2 rounded-lg bg-error/10 text-error text-sm font-rubik" role="alert">
              {generalError}
            </div>
          )}

          <FormField error={getFieldError('email')}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: null })) }}
              size="lg"
              className={`h-12 ${getFieldError('email') ? 'border-error' : ''}`}
              autoComplete="email"
              error={!!getFieldError('email')}
            />
          </FormField>

          <FormField error={getFieldError('password')}>
            <div>
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: null })) }}
                size="lg"
                className={`h-12 ${getFieldError('password') ? 'border-error' : ''}`}
                autoComplete="current-password"
                error={!!getFieldError('password')}
              />
              <Link
                to="/forgot-password"
                className="block mt-2 text-right text-primary text-sm font-rubik hover:underline"
              >
                Забыли пароль?
              </Link>
            </div>
          </FormField>

          <Checkbox
            label="Запомнить меня"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="h-12 mt-2"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-medium text-sm font-rubik">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
