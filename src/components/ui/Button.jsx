import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Единый компонент кнопки для всего проекта
 * Обеспечивает консистентность UI
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  as = 'button',
  to,
  href,
  onClick,
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  ...props
}) => {
  // Базовые стили (всегда применяются)
  const baseStyles = 'inline-flex items-center justify-center font-rubik font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'

  // Варианты стилей кнопок
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg',
    secondary: 'bg-white text-dark border-2 border-gray-light hover:border-primary hover:text-primary',
    outline: 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white',
    ghost: 'bg-transparent text-dark hover:bg-gray-light/20',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg',
  }

  // Размеры кнопок (ЕДИНЫЕ для всего проекта)
  const sizes = {
    sm: 'h-[40px] px-4 text-[13px] rounded-[6px] gap-1.5',
    md: 'h-[48px] px-6 text-[14px] rounded-[8px] gap-2',
    lg: 'h-[56px] px-8 text-[16px] rounded-[8px] gap-2',
  }

  // Собираем все классы
  const buttonClasses = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  // Рендер иконки
  const renderIcon = () => {
    if (!icon) return null
    return <span className="flex-shrink-0">{icon}</span>
  }

  // Содержимое кнопки
  const content = (
    <>
      {icon && iconPosition === 'left' && renderIcon()}
      <span className="whitespace-nowrap">{children}</span>
      {icon && iconPosition === 'right' && renderIcon()}
    </>
  )

  // Определяем тип элемента
  if (to) {
    return (
      <Link to={to} className={buttonClasses} {...props}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={buttonClasses} {...props}>
        {content}
      </a>
    )
  }

  if (as === 'div') {
    return (
      <div className={buttonClasses} {...props}>
        {content}
      </div>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {content}
    </button>
  )
}

export default Button
