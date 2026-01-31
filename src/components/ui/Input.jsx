import React from 'react'

/**
 * Единый компонент поля ввода для всего проекта
 * Обеспечивает консистентность UI
 */
const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
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
  // Размеры полей (ЕДИНЫЕ для всего проекта)
  const sizes = {
    sm: 'h-[40px] px-4 text-[13px]',
    md: 'h-[48px] px-5 text-[14px]',
    lg: 'h-[56px] px-5 text-[16px]',
  }

  // Отступы для иконок
  const iconPadding = {
    left: icon ? 'pl-12' : '',
    right: rightElement ? 'pr-12' : '',
  }

  // Базовые стили
  const baseStyles = `
    bg-white 
    border-2 border-gray-light 
    rounded-[8px] 
    font-rubik 
    placeholder:text-gray-medium 
    focus:outline-none 
    focus:border-primary 
    transition-colors
    disabled:bg-gray-50 
    disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:border-red-500' : ''}
    ${sizes[size] || sizes.md}
    ${icon && iconPosition === 'left' ? iconPadding.left : ''}
    ${rightElement ? iconPadding.right : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {/* Иконка слева */}
      {icon && iconPosition === 'left' && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-40 pointer-events-none">
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
        disabled={disabled}
        className={baseStyles}
        {...props}
      />

      {/* Правый элемент (например, кнопка) */}
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
          {rightElement}
        </div>
      )}

      {/* Иконка справа */}
      {icon && iconPosition === 'right' && !rightElement && (
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-40 pointer-events-none">
          {icon}
        </div>
      )}

      {/* Сообщение об ошибке */}
      {error && errorMessage && (
        <p className="mt-1.5 text-red-500 text-[12px] font-rubik">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default Input
