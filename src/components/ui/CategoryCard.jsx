import React from 'react'

/**
 * CategoryCard — серый фон, текст слева-сверху, иконка/картинка справа крупнее
 */
const CategoryCard = ({ image, title, className = '', onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full bg-gray-100 rounded-lg overflow-hidden
        cursor-pointer group
        border border-gray-light/50
        hover:border-primary/30 hover:shadow-md
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        flex items-stretch text-left
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <div className="w-full h-full flex flex-row items-center gap-3 p-3 lg:p-4 min-h-[72px] lg:min-h-[80px]">
        {/* Текст слева-сверху */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <span className="text-dark text-xs lg:text-sm font-rubik font-medium leading-tight line-clamp-2">
            {title}
          </span>
        </div>
        {/* Иконка/картинка справа — крупнее */}
        {image && (
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14">
            <img
              src={image}
              alt={title?.replace('\n', ' ')}
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
      </div>
    </button>
  )
}

export default CategoryCard
