import React from 'react'

const CategoryCard = ({ image, title, className = '' }) => {
  return (
    <div className={`relative rounded-[16px] overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-white border border-gray-light/30 ${className}`}>
      <div className="w-full h-full flex flex-col items-center justify-between p-4 lg:p-5">
        {/* Изображение */}
        {image && (
          <div className="flex-1 w-full flex items-center justify-center mb-3">
            <img 
              src={image} 
              alt={title} 
              className="max-w-[90%] max-h-[90px] lg:max-h-[110px] object-contain"
            />
          </div>
        )}
        
        {/* Заголовок */}
        <div className="w-full text-center mt-auto">
          <h3 className="text-dark text-[13px] lg:text-[15px] font-rubik font-semibold leading-snug whitespace-pre-line">
            {title}
          </h3>
        </div>
      </div>
    </div>
  )
}

export default CategoryCard
