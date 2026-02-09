import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from '../../components/ui'
import FormField from '../../components/ui/FormField'
import { forgotPassword } from '../../services/api'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setGeneralError('')
    setLoading(true)

    try {
      const data = await forgotPassword({ email })
      setSent(true)
      // В режиме отладки API может вернуть reset_url — редирект для теста
      if (data?.reset_url) {
        window.location.href = data.reset_url
        return
      }
    } catch (err) {
      setLoading(false)
      if (err.errors) {
        setErrors(err.errors)
      } else if (err.message) {
        setGeneralError(err.message)
      } else {
        setGeneralError('Ошибка запроса. Попробуйте позже.')
      }
    }
  }

  const getFieldError = (field) => {
    const arr = errors[field]
    return Array.isArray(arr) ? arr[0] : null
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="h-12 mt-2"
            disabled={loading}
          >
            {loading ? 'Отправка...' : 'Отправить ссылку'}
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
