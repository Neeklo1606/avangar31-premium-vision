import React from 'react'

/**
 * Унифицированный компонент Tab
 * Единые размеры, стили для всех табов проекта
 */
const Tab = ({ 
  active = false, 
  onClick, 
  children, 
  size = 'md',
  className = '' 
}) => {
  // Размеры (СТРОГО УНИФИЦИРОВАННЫЕ)
  const sizes = {
    sm: 'h-9 px-4 text-sm',    // 36px
    md: 'h-10 px-5 text-sm',   // 40px
    lg: 'h-11 px-6 text-base', // 44px
  }

  const baseStyles = `
    inline-flex items-center justify-center
    rounded-md font-rubik font-medium
    transition-all duration-200
    cursor-pointer whitespace-nowrap
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    ${sizes[size] || sizes.md}
  `.trim().replace(/\s+/g, ' ')

  const stateStyles = active
    ? 'bg-primary text-white shadow-sm'
    : 'bg-white border border-gray-light text-gray-medium hover:border-primary hover:text-primary'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyles} ${stateStyles} ${className}`.trim()}
    >
      {children}
    </button>
  )
}

/**
 * Компонент группы табов
 */
export const TabGroup = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {children}
    </div>
  )
}

export default Tab
