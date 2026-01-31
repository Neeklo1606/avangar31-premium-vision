import React from 'react'

/**
 * Единый компонент Tab (переключатель) для всего проекта
 * Обеспечивает консистентность UI
 */
const Tab = ({ 
  active = false, 
  onClick, 
  children, 
  size = 'md',
  className = '' 
}) => {
  // Размеры табов (ЕДИНЫЕ для всего проекта)
  const sizes = {
    sm: 'px-4 py-2 text-[13px]',
    md: 'px-6 py-3 text-[14px]',
    lg: 'px-8 py-4 text-[16px]',
  }

  // Базовые стили
  const baseStyles = `
    inline-flex 
    items-center 
    justify-center 
    rounded-[8px] 
    font-rubik 
    font-medium 
    transition-all 
    duration-300 
    cursor-pointer
    whitespace-nowrap
    ${sizes[size] || sizes.md}
  `.trim().replace(/\s+/g, ' ')

  // Стили в зависимости от состояния
  const stateStyles = active
    ? 'bg-primary text-white shadow-md'
    : 'bg-white border-2 border-gray-light text-gray-medium hover:border-primary hover:text-primary'

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
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {children}
    </div>
  )
}

export default Tab
