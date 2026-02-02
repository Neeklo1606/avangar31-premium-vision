import React from 'react'

/**
 * Унифицированный компонент Input
 * Единые размеры, стили для всех полей ввода
 */
const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyPress,
  disabled = false,
  error = false,
  errorMessage,
  icon,
  iconPosition = 'left',
  rightElement,
  className = '',
  size = 'md',
  fullWidth = true,
  ...props
}) => {
  // Размеры (СТРОГО УНИФИЦИРОВАННЫЕ - равны размерам кнопок)
  const sizes = {
    sm: 'h-10 px-4 text-sm',    // 40px
    md: 'h-11 px-4 text-base',  // 44px
    lg: 'h-12 px-5 text-lg',    // 48px
  }

  // Отступы для иконок
  const iconPadding = {
    left: icon && iconPosition === 'left' ? 'pl-11' : '',
    right: rightElement ? 'pr-12' : '',
  }

  const baseStyles = `
    bg-white border border-gray-light rounded-md
    font-rubik placeholder:text-gray-medium
    focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
    transition-all duration-200
    disabled:bg-gray-50 disabled:cursor-not-allowed
    ${error ? 'border-error focus:border-error focus:ring-error' : ''}
    ${sizes[size] || sizes.md}
    ${iconPadding.left}
    ${iconPadding.right}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {/* Иконка слева */}
      {icon && iconPosition === 'left' && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-50 pointer-events-none">
          {icon}
        </div>
      )}

      {/* Поле ввода */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        disabled={disabled}
        className={baseStyles}
        {...props}
      />

      {/* Правый элемент */}
      {rightElement && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
          {rightElement}
        </div>
      )}

      {/* Иконка справа */}
      {icon && iconPosition === 'right' && !rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-50 pointer-events-none">
          {icon}
        </div>
      )}

      {/* Сообщение об ошибке */}
      {error && errorMessage && (
        <p className="mt-1.5 text-error text-xs font-rubik">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default Input
