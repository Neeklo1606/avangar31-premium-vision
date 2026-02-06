import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IconButton } from './index'

const FAVORITES_STORAGE_KEY = 'livegrid_favorites_property'

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

/**
 * Унифицированная карточка объекта недвижимости
 * discount — опциональный блок скидки (напр. «Скидка 20% до 1 февраля 2026»)
 */
const PropertyCard = ({ id, image, title, price, location, tags = [], href, discount }) => {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (id == null) return
    const ids = getStoredFavorites()
    setIsFavorite(ids.includes(String(id)))
  }, [id])

  const handleToggleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (id == null) return
    const ids = getStoredFavorites()
    const key = String(id)
    const next = ids.includes(key) ? ids.filter((i) => i !== key) : [...ids, key]
    setStoredFavorites(next)
    setIsFavorite(next.includes(key))
  }

  const CardWrapper = href ? Link : 'div'
  const cardProps = href ? { to: href } : {}

  return (
    <CardWrapper
      {...cardProps}
      className="relative bg-white rounded-xl overflow-hidden border border-gray-light/20 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-out group block isolate"
    >
      {/* Изображение — отступ от краёв карточки, скругление по макету */}
      <div className="relative mx-2 mt-2 rounded-lg overflow-hidden bg-gray-50 aspect-[4/3]">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
        />
        
        {/* Бейджи — аккуратные, без ощущения наклеек */}
        {tags.length > 0 && (
          <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1 z-10">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-md text-[11px] font-rubik font-medium text-dark"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Кнопка избранного — второстепенная, не конфликтует с бейджами */}
        <IconButton
          variant="ghost"
          size="sm"
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 z-10 w-9 h-9 min-w-[36px] bg-white/70 hover:bg-white hover:scale-105 rounded-md shadow-sm transition-all duration-200"
          ariaLabel={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          icon={
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill={isFavorite ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              strokeWidth="1.5"
              className={isFavorite ? 'text-error' : 'text-dark'}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />

        {/* Градиент снизу */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
      </div>

      {/* Информация — отступ от изображения, без залипания */}
      <div className="p-3 pt-2.5 space-y-1.5">
        {/* Название объекта */}
        <h3 className="text-dark text-sm font-rubik font-medium leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Цена — визуально доминирует над адресом */}
        <p className="text-dark text-base lg:text-lg font-rubik font-bold">
          {price}
        </p>

        {/* Адрес — вторичный, не конкурирует с ценой */}
        {location && (
          <p className="text-gray-medium text-xs font-rubik leading-relaxed flex items-center gap-1.5 truncate opacity-90">
            <span className="inline-block w-1 h-1 bg-gray-medium rounded-full flex-shrink-0" />
            {location}
          </p>
        )}

        {/* Блок скидки (5.8) — опционально для горящих предложений */}
        {discount && (
          <div className="mt-2 py-2 px-3 rounded-lg bg-primary text-white text-xs font-rubik font-medium">
            {discount}
          </div>
        )}
      </div>
    </CardWrapper>
  )
}

export default PropertyCard
