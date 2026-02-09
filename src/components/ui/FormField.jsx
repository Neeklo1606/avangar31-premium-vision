import React from 'react'
import Input from './Input'

/**
 * Поле формы с выводом ошибки валидации
 */
const FormField = ({ label, error, children, className = '' }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-dark text-sm font-rubik font-medium">{label}</label>
      )}
      {children}
      {error && (
        <p className="text-error text-xs font-rubik" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
