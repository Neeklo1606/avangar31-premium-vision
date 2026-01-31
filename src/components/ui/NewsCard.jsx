import React from 'react'
import { Link } from 'react-router-dom'

const NewsCard = ({ id, image, title, excerpt, date, category }) => {
  return (
    <Link to={`/news/${id}`} className="block group">
      <div className="bg-white rounded-[16px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-light/20">
        {/* Изображение */}
        <div className="relative w-full h-[220px] overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Категория */}
          {category && (
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-primary text-white text-[11px] font-rubik font-semibold rounded-full shadow-md">
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Информация */}
        <div className="p-5 space-y-3">
          {/* Дата */}
          <p className="text-gray-medium text-[13px] font-rubik font-normal">
            {date}
          </p>

          {/* Заголовок */}
          <h3 className="text-dark text-[18px] font-rubik font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Описание */}
          <p className="text-gray-medium text-[14px] font-rubik font-normal leading-relaxed line-clamp-3">
            {excerpt}
          </p>

          {/* Кнопка */}
          <button className="text-primary text-[14px] font-rubik font-semibold hover:underline">
            Читать далее →
          </button>
        </div>
      </div>
    </Link>
  )
}

export default NewsCard
