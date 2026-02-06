import React from 'react'

/**
 * CategoryCard — иконка сверху, текст снизу, flex-col, фиксированный gap
 * Единый шрифт, max-width текста, line-clamp-2, без overlap
 */
const CategoryCard = ({ image, title, className = '', onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full h-full min-h-[88px] lg:min-h-[96px] bg-gray-50 rounded-xl overflow-hidden
        cursor-pointer group
        border border-gray-light/50
        hover:border-primary/30 hover:shadow-md
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        flex text-left
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <div className="w-full h-full flex flex-col items-start gap-3 p-4 lg:p-5 min-h-0">
        {/* Иконка сверху — размеры без изменений */}
        {image && (
          <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20">
            <img
              src={image}
              alt={title?.replace('\n', ' ')}
              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        {/* Текст снизу — max-width, выравнивание по левому краю, line-clamp-2 */}
        <div className="flex-shrink-0 flex flex-col justify-start min-w-0 w-full max-w-full text-left">
          <span className="text-dark text-sm lg:text-base font-rubik font-medium leading-[1.35] line-clamp-2 break-words">
            {title}
          </span>
        </div>
      </div>
    </button>
  )
}

export default CategoryCard
