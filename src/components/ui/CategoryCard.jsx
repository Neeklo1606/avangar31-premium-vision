import React from 'react'

/**
 * CategoryCard — светло-серый фон, текст слева-сверху, иконка справа, скругление 16px
 */
const CategoryCard = ({ image, title, className = '', onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full bg-gray-50 rounded-xl overflow-hidden
        cursor-pointer group
        border border-gray-light/50
        hover:border-primary/30 hover:shadow-md
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        flex items-stretch text-left
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <div className="w-full h-full flex flex-row items-start gap-3 p-4 lg:p-5 min-h-[88px] lg:min-h-[96px]">
        {/* Текст слева-сверху */}
        <div className="flex-1 flex flex-col justify-start min-w-0 pt-0.5">
          <span className="text-dark text-sm lg:text-base font-rubik font-medium leading-tight line-clamp-2">
            {title}
          </span>
        </div>
        {/* Иконка/картинка справа — 64–80px, object-contain */}
        {image && (
          <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20">
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
