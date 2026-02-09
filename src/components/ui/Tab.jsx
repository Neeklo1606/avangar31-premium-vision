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
  variant = 'default',
  className = '' 
}) => {
  // Размеры
  const sizes = {
    xs: 'h-8 px-3 text-xs font-normal',
    sm: 'h-8 px-3 text-xs font-normal',
    md: 'h-9 px-4 text-sm font-normal',
    lg: 'h-10 px-5 text-sm font-medium',
    hero: 'min-h-[36px] h-9 max-[480px]:min-h-[38px] max-[480px]:h-10 px-4 py-2 text-sm font-normal leading-normal',  // 36–40px hero
  }

  const baseStyles = `
    inline-flex items-center justify-center
    font-rubik
    transition-all duration-200
    cursor-pointer whitespace-nowrap
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    ${sizes[size] || sizes.md}
  `.trim().replace(/\s+/g, ' ')

  // Hero: активный — синяя заливка, неактивный — светлый фон/граница, без шума
  const stateStyles = variant === 'hero'
    ? active
      ? 'bg-primary text-white rounded-lg'
      : 'bg-gray-50 border border-gray-light text-gray-medium hover:bg-gray-100 hover:border-gray-light rounded-lg'
    : active
      ? 'bg-primary text-white shadow-sm rounded-md'
      : 'bg-white border border-gray-light text-gray-medium hover:border-primary hover:text-primary rounded-md'

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
 * layout="distribute" — grid, равномерно по ширине
 * layout="hero" — flex по центру, равномерные промежутки (для hero-фильтров)
 */
export const TabGroup = ({ children, className = '', layout = 'default' }) => {
  const layoutClasses = {
    default: 'flex flex-wrap gap-2',
    distribute: 'grid grid-cols-5 gap-1',
    hero: 'flex flex-wrap justify-center items-center gap-2 max-[480px]:gap-2.5',
  }
  return (
    <div className={`${layoutClasses[layout] || layoutClasses.default} ${className}`.trim()}>
      {children}
    </div>
  )
}

export default Tab
