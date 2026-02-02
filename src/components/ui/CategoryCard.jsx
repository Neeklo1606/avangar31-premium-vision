import React from 'react'

/**
 * Унифицированный компонент CategoryCard
 * Карточки категорий в сетке Hero-секции
 */
const CategoryCard = ({ image, title, className = '', onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full bg-gray-50 rounded-lg overflow-hidden
        cursor-pointer group
        border border-gray-light/50
        hover:border-primary/30 hover:shadow-md
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-3 lg:p-4 gap-2">
        {/* Изображение */}
        {image && (
          <div className="flex-1 w-full flex items-center justify-center">
            <img 
              src={image} 
              alt={title?.replace('\n', ' ')} 
              className="max-w-[70%] max-h-[50px] lg:max-h-[60px] object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        
        {/* Заголовок */}
        <div className="w-full text-center">
          <span className="text-dark text-xs lg:text-sm font-rubik font-medium leading-tight whitespace-pre-line">
            {title}
          </span>
        </div>
      </div>
    </button>
  )
}

export default CategoryCard
