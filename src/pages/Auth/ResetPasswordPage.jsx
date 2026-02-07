import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Button, Input } from '../../components/ui'

const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      return
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }
    // TODO: интеграция с бэкендом (token в URL)
    console.log('Reset password:', { token, password })
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-xl shadow-lg border border-gray-light/30 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-dark text-2xl font-rubik font-bold mb-2">Пароль изменён</h1>
          <p className="text-gray-medium text-sm font-rubik mb-6">
            Теперь вы можете войти с новым паролем
          </p>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="h-12"
            onClick={() => navigate('/login')}
          >
            Войти
          </Button>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-xl shadow-lg border border-gray-light/30 p-6 sm:p-8 text-center">
          <h1 className="text-dark text-2xl font-rubik font-bold mb-2">Недействительная ссылка</h1>
          <p className="text-gray-medium text-sm font-rubik mb-6">
            Ссылка для сброса пароля устарела или неверна. Запросите новую.
          </p>
          <Link to="/forgot-password">
            <Button variant="primary" size="lg" fullWidth className="h-12">
              Восстановить пароль
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="bg-white rounded-xl shadow-lg border border-gray-light/30 p-6 sm:p-8">
        <h1 className="text-dark text-2xl font-rubik font-bold mb-1">Новый пароль</h1>
        <p className="text-gray-medium text-sm font-rubik mb-6">
          Придумайте новый пароль для входа в аккаунт
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="px-3 py-2 rounded-lg bg-error/10 text-error text-sm font-rubik">
              {error}
            </div>
          )}

          <Input
            type="password"
            placeholder="Новый пароль (мин. 6 символов)"
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

          <Button type="submit" variant="primary" size="lg" fullWidth className="h-12 mt-2">
            Сохранить пароль
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-medium text-sm font-rubik">
          <Link to="/login" className="text-primary font-semibold hover:underline">
            ← Вернуться к входу
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPasswordPage
