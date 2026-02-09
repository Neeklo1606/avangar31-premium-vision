import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '../../components/ui'
import FormField from '../../components/ui/FormField'
import { register, setToken } from '../../services/api'

const RegisterPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setGeneralError('')
    if (!agreeTerms) {
      setGeneralError('Необходимо согласие с политикой конфиденциальности')
      return
    }
    setLoading(true)

    try {
      const data = await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      setToken(data.token)
      navigate('/')
      window.location.reload()
    } catch (err) {
      setLoading(false)
      if (err.errors) {
        setErrors(err.errors)
      } else if (err.message) {
        setGeneralError(err.message)
      } else {
        setGeneralError('Ошибка регистрации. Попробуйте позже.')
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
        <h1 className="text-dark text-2xl font-rubik font-bold mb-1">Регистрация</h1>
        <p className="text-gray-medium text-sm font-rubik mb-6">
          Создайте аккаунт для сохранения избранного и подачи заявок
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {generalError && (
            <div className="px-3 py-2 rounded-lg bg-error/10 text-error text-sm font-rubik" role="alert">
              {generalError}
            </div>
          )}

          <FormField error={getFieldError('name')}>
            <Input
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: null })) }}
              size="lg"
              className={`h-12 ${getFieldError('name') ? 'border-error' : ''}`}
              autoComplete="name"
              error={!!getFieldError('name')}
            />
          </FormField>

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
              placeholder="Пароль (мин. 6 символов)"
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="h-12 mt-2"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
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
