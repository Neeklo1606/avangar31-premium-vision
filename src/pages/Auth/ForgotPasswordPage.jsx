import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from '../../components/ui'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Введите email')
      return
    }
    // TODO: интеграция с бэкендом
    console.log('Forgot password:', { email })
    setSent(true)
  }

  if (sent) {
    return (
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-xl shadow-lg border border-gray-light/30 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-dark text-2xl font-rubik font-bold mb-2">Письмо отправлено</h1>
          <p className="text-gray-medium text-sm font-rubik mb-6">
            Инструкции по восстановлению пароля отправлены на <strong className="text-dark">{email}</strong>
          </p>
          <Link to="/login">
            <Button variant="primary" size="lg" fullWidth className="h-12">
              Вернуться к входу
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="bg-white rounded-xl shadow-lg border border-gray-light/30 p-6 sm:p-8">
        <h1 className="text-dark text-2xl font-rubik font-bold mb-1">Восстановление пароля</h1>
        <p className="text-gray-medium text-sm font-rubik mb-6">
          Укажите email, указанный при регистрации. Мы отправим ссылку для сброса пароля.
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

          <Button type="submit" variant="primary" size="lg" fullWidth className="h-12 mt-2">
            Отправить ссылку
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

export default ForgotPasswordPage
