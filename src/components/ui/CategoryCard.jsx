import React from 'react'

const CategoryCard = ({ image, title, className = '' }) => {
  return (
    <div className={`relative rounded-[12px] overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-lg bg-white border border-gray-light/30 ${className}`}>
      <div className="w-full h-full flex flex-col items-center justify-between p-3 lg:p-4">
        {/* Изображение - КОМПАКТНЕЕ (требование п.6.2) */}
        {image && (
          <div className="flex-1 w-full flex items-center justify-center mb-2">
            <img 
              src={image} 
              alt={title} 
              className="max-w-[85%] max-h-[60px] lg:max-h-[80px] object-contain"
            />
          </div>
        )}
        
        {/* Заголовок - МЕНЬШЕ line-height (требование п.6.2) */}
        <div className="w-full text-center mt-auto">
          <h3 className="text-dark text-[12px] lg:text-[13px] font-rubik font-medium leading-tight whitespace-pre-line">
            {title}
          </h3>
        </div>
      </div>
    </div>
  )
}

export default CategoryCard
