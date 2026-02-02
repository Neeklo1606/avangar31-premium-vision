import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Унифицированный компонент Button
 * Единые размеры, стили, радиусы для всего проекта
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
  // Базовые стили
  const baseStyles = `
    inline-flex items-center justify-center
    font-rubik font-semibold
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    whitespace-nowrap
  `.trim().replace(/\s+/g, ' ')

  // Варианты стилей
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md active:scale-[0.98]',
    secondary: 'bg-white text-dark border-2 border-gray-light hover:border-primary hover:text-primary',
    outline: 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white',
    ghost: 'bg-transparent text-dark hover:bg-gray-100',
    danger: 'bg-error text-white hover:opacity-90 shadow-sm',
  }

  // Размеры (СТРОГО УНИФИЦИРОВАННЫЕ)
  const sizes = {
    sm: 'h-10 px-4 text-sm rounded-md gap-1.5',      // 40px
    md: 'h-11 px-5 text-base rounded-md gap-2',      // 44px
    lg: 'h-12 px-6 text-lg rounded-lg gap-2',        // 48px
  }

  const buttonClasses = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  const renderIcon = () => icon ? <span className="flex-shrink-0">{icon}</span> : null

  const content = (
    <>
      {icon && iconPosition === 'left' && renderIcon()}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && renderIcon()}
    </>
  )

  if (to) {
    return <Link to={to} className={buttonClasses} {...props}>{content}</Link>
  }

  if (href) {
    return <a href={href} className={buttonClasses} {...props}>{content}</a>
  }

  if (as === 'div') {
    return <div className={buttonClasses} {...props}>{content}</div>
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
