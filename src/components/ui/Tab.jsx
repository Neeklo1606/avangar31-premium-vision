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
  // Размеры (компактнее: меньший font-size, тоньше weight, меньше padding)
  const sizes = {
    xs: 'h-8 px-3 text-xs font-normal',  // компактный
    sm: 'h-8 px-3 text-xs font-normal',  // 32px, компактный
    md: 'h-9 px-4 text-sm font-normal',
    lg: 'h-10 px-5 text-sm font-medium',
  }

  const baseStyles = `
    inline-flex items-center justify-center
    rounded-md font-rubik
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
 * Компонент группы табов.
 * layout="distribute" — табы равномерно по ширине контейнера с минимальным gap
 */
export const TabGroup = ({ children, className = '', layout = 'default' }) => {
  const isDistribute = layout === 'distribute'
  return (
    <div
      className={
        isDistribute
          ? `grid grid-cols-5 gap-1 ${className}`.trim()
          : `flex flex-wrap gap-2 ${className}`.trim()
      }
    >
      {children}
    </div>
  )
}

export default Tab
