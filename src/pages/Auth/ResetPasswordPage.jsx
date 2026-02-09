import React, { useState } from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Button, Input } from '../../components/ui'
import FormField from '../../components/ui/FormField'
import { resetPassword } from '../../services/api'

const ResetPasswordPage = () => {
  const { token } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const emailFromQuery = searchParams.get('email') || ''

  const [email, setEmail] = useState(emailFromQuery)
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setGeneralError('')
    setLoading(true)

    try {
      await resetPassword({
        email,
        token: token || '',
        password,
        password_confirmation: passwordConfirmation,
      })
      setSuccess(true)
    } catch (err) {
      setLoading(false)
      if (err.errors) {
        setErrors(err.errors)
      } else if (err.message) {
        setGeneralError(err.message)
      } else {
        setGeneralError('Ошибка сброса пароля. Попробуйте позже.')
      }
    }
  }

  const getFieldError = (field) => {
    const arr = errors[field]
    return Array.isArray(arr) ? arr[0] : null
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
            <Input
              type="password"
              placeholder="Новый пароль (мин. 6 символов)"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: null })) }}
              size="lg"
              className={`h-12 ${getFieldError('password') ? 'border-error' : ''}`}
              autoComplete="new-password"
              error={!!getFieldError('password')}
            />
          </FormField>

          <FormField error={getFieldError('password_confirmation')}>
            <Input
              type="password"
              placeholder="Повторите пароль"
              value={passwordConfirmation}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value)
                setErrors((p) => ({ ...p, password_confirmation: null }))
              }}
              size="lg"
              className={`h-12 ${getFieldError('password_confirmation') ? 'border-error' : ''}`}
              autoComplete="new-password"
              error={!!getFieldError('password_confirmation')}
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
            {loading ? 'Сохранение...' : 'Сохранить пароль'}
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
