import React from 'react'

/**
 * Единый компонент IconButton (кнопка только с иконкой) для всего проекта
 * Обеспечивает консистентность UI
 */
const IconButton = ({
  children,
  icon,
  variant = 'default',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  ariaLabel,
  ...props
}) => {
  // Размеры иконочных кнопок (ЕДИНЫЕ для всего проекта)
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  // Варианты стилей
  const variants = {
    default: 'bg-transparent hover:bg-gray-light/20 text-dark',
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-white border-2 border-gray-light hover:border-primary text-dark',
    ghost: 'bg-transparent hover:bg-gray-light/10 text-gray-medium hover:text-primary',
  }

  // Базовые стили
  const baseStyles = `
    inline-flex 
    items-center 
    justify-center 
    rounded-[8px] 
    transition-all 
    duration-300 
    cursor-pointer
    disabled:opacity-50 
    disabled:cursor-not-allowed
    focus:outline-none 
    focus:ring-2 
    focus:ring-primary 
    focus:ring-offset-2
    ${sizes[size] || sizes.md}
    ${variants[variant] || variants.default}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
      aria-label={ariaLabel}
      {...props}
    >
      {icon || children}
    </button>
  )
}

export default IconButton
