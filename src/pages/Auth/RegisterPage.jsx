import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '../../components/ui'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Введите имя')
      return
    }
    if (!email.trim()) {
      setError('Введите email')
      return
    }
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      return
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }
    if (!agreeTerms) {
      setError('Необходимо согласие с политикой конфиденциальности')
      return
    }
    // TODO: интеграция с бэкендом
    console.log('Register:', { name, email, password })
    navigate('/login')
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="bg-white rounded-xl shadow-lg border border-gray-light/30 p-6 sm:p-8">
        <h1 className="text-dark text-2xl font-rubik font-bold mb-1">Регистрация</h1>
        <p className="text-gray-medium text-sm font-rubik mb-6">
          Создайте аккаунт для сохранения избранного и подачи заявок
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="px-3 py-2 rounded-lg bg-error/10 text-error text-sm font-rubik">
              {error}
            </div>
          )}

          <Input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="lg"
            className="h-12"
            autoComplete="name"
          />

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
            className="h-12"
            autoComplete="email"
          />

          <Input
            type="password"
            placeholder="Пароль (мин. 6 символов)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="lg"
            className="h-12"
            autoComplete="new-password"
          />

          <Input
            type="password"
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            size="lg"
            className="h-12"
            autoComplete="new-password"
          />

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-light text-primary focus:ring-primary"
            />
            <span className="text-dark text-sm font-rubik leading-relaxed">
              Я согласен с{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                политикой конфиденциальности
              </Link>{' '}
              и условиями использования
            </span>
          </label>

          <Button type="submit" variant="primary" size="lg" fullWidth className="h-12 mt-2">
            Зарегистрироваться
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-medium text-sm font-rubik">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
