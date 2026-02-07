import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Checkbox } from '../../components/ui'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Введите email')
      return
    }
    if (!password) {
      setError('Введите пароль')
      return
    }
    // TODO: интеграция с бэкендом
    console.log('Login:', { email, password, remember })
    navigate('/')
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="bg-white rounded-xl shadow-lg border border-gray-light/30 p-6 sm:p-8">
        <h1 className="text-dark text-2xl font-rubik font-bold mb-1">Вход</h1>
        <p className="text-gray-medium text-sm font-rubik mb-6">
          Войдите в аккаунт, чтобы сохранять избранное и управлять заявками
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="px-3 py-2 rounded-lg bg-error/10 text-error text-sm font-rubik">
              {error}
            </div>
          )}

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
            className="h-12"
            autoComplete="email"
          />

          <div>
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="lg"
              className="h-12"
              autoComplete="current-password"
            />
            <Link
              to="/forgot-password"
              className="block mt-2 text-right text-primary text-sm font-rubik hover:underline"
            >
              Забыли пароль?
            </Link>
          </div>

          <Checkbox
            label="Запомнить меня"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth className="h-12 mt-2">
            Войти
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
