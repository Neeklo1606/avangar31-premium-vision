import React from 'react'

/**
 * Унифицированный компонент IconButton
 * Единые размеры для всех иконочных кнопок
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
  // Размеры (КВАДРАТНЫЕ, унифицированные)
  const sizes = {
    sm: 'w-9 h-9',   // 36px
    md: 'w-10 h-10', // 40px
    lg: 'w-11 h-11', // 44px
  }

  // Варианты стилей
  const variants = {
    default: 'bg-transparent hover:bg-gray-100 text-dark',
    primary: 'bg-primary hover:bg-primary-hover text-white',
    secondary: 'bg-white border border-gray-light hover:border-primary text-dark',
    ghost: 'bg-transparent hover:bg-gray-50 text-gray-medium hover:text-primary',
  }

  const baseStyles = `
    inline-flex items-center justify-center
    rounded-md transition-all duration-200
    cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
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
