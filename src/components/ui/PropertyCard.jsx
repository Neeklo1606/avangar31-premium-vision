import React, { useState, useEffect } from 'react'
import { IconButton } from './index'
import heartIcon from '../../assets/icons/heart-icon.svg'
import heartIconFilled from '../../assets/icons/heart-icon-filled.svg'

const FAVORITES_STORAGE_KEY = 'trendagent_favorites_property'

function getStoredFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setStoredFavorites(ids) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids))
  } catch {}
}

const PropertyCard = ({ id, image, title, price, location, tags = [] }) => {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (id == null) return
    const ids = getStoredFavorites()
    setIsFavorite(ids.includes(String(id)))
  }, [id])

  const handleToggleFavorite = (e) => {
    e.stopPropagation()
    if (id == null) return
    const ids = getStoredFavorites()
    const key = String(id)
    const next = ids.includes(key) ? ids.filter((i) => i !== key) : [...ids, key]
    setStoredFavorites(next)
    setIsFavorite(next.includes(key))
  }

  return (
    <div className="relative bg-white rounded-[16px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-light/20">
      {/* Изображение */}
      <div className="relative w-full h-[220px] lg:h-[240px] overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Теги */}
        {tags.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-[11px] font-rubik font-semibold text-dark shadow-md"
              >
                {tag}
              </div>
            ))}
          </div>
        )}

        {/* Кнопка «Добавить в избранное» — как в карточках ЖК: без подложки, иконка 22×20 */}
        <IconButton
          variant="ghost"
          size="md"
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-10 bg-transparent hover:bg-white/20"
          ariaLabel={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          icon={
            <img
              src={isFavorite ? heartIconFilled : heartIcon}
              alt=""
              className="w-[22px] h-5"
            />
          }
        />

        {/* Градиент снизу */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      {/* Информация */}
      <div className="p-5 space-y-2.5">
        {/* Заголовок */}
        <h3 className="text-dark text-[14px] lg:text-[15px] font-rubik font-medium leading-snug line-clamp-2 min-h-[42px]">
          {title}
        </h3>

        {/* Цена */}
        <p className="text-dark text-[20px] lg:text-[22px] font-rubik font-bold">
          {price}
        </p>

        {/* Локация */}
        <p className="text-gray-medium text-[13px] font-rubik font-normal flex items-center gap-1.5">
          <span className="inline-block w-1 h-1 bg-gray-medium rounded-full"></span>
          {location}
        </p>
      </div>
    </div>
  )
}

export default PropertyCard
