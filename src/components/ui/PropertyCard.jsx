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
 * variant="hot" — layout для блока «Горящие предложения»: title+price в строку, скидка на всю ширину
 */
const PropertyCard = ({ id, image, title, price, location, tags = [], href, discount, variant }) => {
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

  const isHot = variant === 'hot'

  return (
    <CardWrapper
      {...cardProps}
      className="relative bg-white rounded-xl overflow-hidden border border-gray-light/20 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-[180ms] ease-out group block isolate hot-offers-card"
    >
      {/* TASK 3-4: Изображение — mobile hot: 100% ширины, бейджи с отступами, избранное 44px tap */}
      <div className={`relative rounded-lg overflow-hidden bg-gray-50 aspect-[4/3] ${isHot ? 'mx-0 mt-0 max-[430px]:rounded-t-xl max-[430px]:rounded-b-none sm:mx-2 sm:mt-2' : 'mx-2 mt-2'}`}>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-150 rounded-lg max-[430px]:rounded-t-xl"
        />
        
        {/* TASK 4: Бейджи — mobile: отступы 12px от краёв, не прижимать */}
        {tags.length > 0 && (
          <div className={`absolute flex flex-wrap gap-1 z-10 ${isHot ? 'top-2.5 left-2.5 max-[430px]:top-3 max-[430px]:left-3 max-[430px]:right-3 max-[430px]:gap-1.5 sm:top-1.5 sm:left-1.5' : 'top-1.5 left-1.5'}`}>
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-md text-[11px] font-rubik font-medium text-dark max-[430px]:px-2.5 max-[430px]:py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* TASK 4: Избранное — mobile: tap-area 44px, правый верхний угол */}
        <IconButton
          variant="ghost"
          size="sm"
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 z-10 bg-white/70 hover:bg-white rounded-md shadow-sm transition-all duration-150 active:scale-95 ${isHot ? 'max-[430px]:min-w-[44px] max-[430px]:min-h-[44px] max-[430px]:w-11 max-[430px]:h-11 max-[430px]:top-2.5 max-[430px]:right-2.5 sm:w-9 sm:h-9 sm:min-w-[36px]' : 'w-9 h-9 min-w-[36px]'}`}
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

      {/* TASK 5-6: Информация — mobile hot: вертикальный блок, иерархия */}
      <div className={`p-3 pt-2.5 flex flex-col ${isHot ? 'gap-1.5 max-[430px]:p-4 max-[430px]:gap-2 max-[430px]:pt-3' : 'space-y-1.5'}`}>
        {isHot ? (
          <>
            {/* Hot: desktop — title+price в строку; mobile — вертикально */}
            <div className="flex flex-col max-[430px]:gap-1 sm:flex-row sm:justify-between sm:items-baseline sm:gap-2">
              <h3 className="text-dark text-sm font-rubik font-medium leading-snug line-clamp-2 flex-1 min-w-0 max-[430px]:leading-relaxed max-[430px]:text-base">
                {title}
              </h3>
              <p className="text-dark text-base font-rubik font-bold flex-shrink-0 max-[430px]:text-lg max-[430px]:mt-0.5">
                {price}
              </p>
            </div>
            {location && (
              <p className="text-gray-medium text-xs font-rubik leading-relaxed truncate opacity-90 max-[430px]:text-[13px]">
                {location}
              </p>
            )}
          </>
        ) : (
          <>
            <h3 className="text-dark text-sm font-rubik font-medium leading-snug line-clamp-2">
              {title}
            </h3>
            <p className="text-dark text-base lg:text-lg font-rubik font-bold">
              {price}
            </p>
            {location && (
              <p className="text-gray-medium text-xs font-rubik leading-relaxed flex items-center gap-1.5 truncate opacity-90">
                <span className="inline-block w-1 h-1 bg-gray-medium rounded-full flex-shrink-0" />
                {location}
              </p>
            )}
          </>
        )}

        {/* TASK 6: CTA — mobile hot: на всю ширину, 48–56px, не прижимать к низу */}
        {discount && (
          <div className={`mt-2 py-2 px-3 rounded-lg bg-primary text-white text-xs font-rubik font-medium flex items-center justify-center transition-colors duration-150 active:opacity-95 ${isHot ? 'min-h-[44px] w-full max-[430px]:min-h-[48px] max-[430px]:h-[52px] max-[430px]:text-sm max-[430px]:mt-3' : ''}`}>
            {discount}
          </div>
        )}
      </div>
    </CardWrapper>
  )
}

export default PropertyCard
