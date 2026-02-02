import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from './index'

const FAVORITES_STORAGE_KEY = 'livegrid_favorites_jk'

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
 * Унифицированная карточка жилого комплекса
 */
const ResidentialComplexCard = ({
  id,
  image,
  images,
  title,
  priceFrom,
  apartmentsCount,
  tags = [],
  apartments = [],
}) => {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const imageRef = useRef(null)

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

  const imageList = Array.isArray(images) && images.length
    ? images
    : image
      ? [image]
      : []
  const hasMultipleImages = imageList.length > 1
  const displayImage = imageList[currentImageIndex] || imageList[0]

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return
    if (id) navigate(`/new-building/${id}`)
  }

  const handleDetailsClick = (e) => {
    e.stopPropagation()
    if (id) navigate(`/new-building/${id}`)
  }

  const handleImageClick = useCallback((e) => {
    e.stopPropagation()
    if (!hasMultipleImages || !imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    if (x < 0.4) {
      setCurrentImageIndex((i) => (i <= 0 ? imageList.length - 1 : i - 1))
    } else {
      setCurrentImageIndex((i) => (i >= imageList.length - 1 ? 0 : i + 1))
    }
  }, [hasMultipleImages, imageList.length])

  const apartmentsToShow = apartments.slice(0, 4)

  return (
    <article
      onClick={handleCardClick}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-light/30 cursor-pointer flex flex-col"
    >
      {/* Изображение */}
      <div
        ref={imageRef}
        className="relative w-full bg-gray-50 overflow-hidden select-none"
        style={{
          height: expanded ? 80 : 200,
          transition: 'height 0.25s ease',
        }}
        onClick={handleImageClick}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-medium text-sm">
            Нет фото
          </div>
        )}

        {/* Индикатор изображений */}
        {hasMultipleImages && !expanded && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {imageList.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Теги */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <span className="px-2 py-1 bg-white/95 rounded-md text-xs font-rubik font-medium text-dark shadow-sm">
            Новостройка
          </span>
          {tags.slice(0, 1).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/95 rounded-md text-xs font-rubik font-medium text-dark shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Кнопка избранного */}
        <IconButton
          variant="ghost"
          size="sm"
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white shadow-sm"
          ariaLabel={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          icon={
            <svg 
              width="18" 
              height="18" 
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
      </div>

      {/* Контент */}
      <div className="flex-1 flex flex-col p-3">
        <h3 className="text-dark text-sm font-rubik font-medium leading-snug mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="text-dark text-base font-rubik font-bold mb-1">
          {priceFrom}
        </p>
        <p className="text-gray-medium text-xs font-rubik mb-2">
          {apartmentsCount}
        </p>

        {/* Блок квартир при наведении */}
        {apartmentsToShow.length > 0 && (
          <div
            className="overflow-hidden transition-all duration-200"
            style={{
              maxHeight: expanded ? 120 : 0,
              opacity: expanded ? 1 : 0,
            }}
          >
            <div className="border-t border-gray-light/40 pt-2 space-y-1.5">
              {apartmentsToShow.map((apt, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-xs font-rubik"
                >
                  <span className="text-primary">{apt.type}</span>
                  <span className="text-gray-medium">{apt.area}</span>
                  <span className="text-gray-medium">{apt.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Кнопка подробнее */}
        <button
          type="button"
          onClick={handleDetailsClick}
          className="mt-auto pt-2 text-primary text-xs font-rubik font-medium hover:underline transition-colors"
        >
          Подробнее
        </button>
      </div>
    </article>
  )
}

export default ResidentialComplexCard
