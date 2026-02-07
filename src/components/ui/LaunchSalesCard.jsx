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

function useDebounce(fn, ms) {
  const timeoutRef = useRef(null)
  const fnRef = useRef(fn)
  fnRef.current = fn
  return useCallback((...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => fnRef.current(...args), ms)
  }, [ms])
}

function useHasHover() {
  const [hasHover, setHasHover] = useState(true)
  useEffect(() => {
    setHasHover(window.matchMedia('(hover: hover)').matches)
  }, [])
  return hasHover
}

/**
 * Карточка «Старт продаж» — упрощённый layout: одна плашка, название+цена в строку, описание, ссылка «Подробнее».
 */
const LaunchSalesCard = ({
  id,
  image,
  images,
  title,
  priceFrom,
  description,
  launchTag,
}) => {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [didSwipe, setDidSwipe] = useState(false)
  const imageRef = useRef(null)
  const touchStartX = useRef(0)
  const lastZoneRef = useRef(null)
  const hasHover = useHasHover()

  useEffect(() => {
    if (id == null) return
    const ids = getStoredFavorites()
    setIsFavorite(ids.includes(String(id)))
  }, [id])

  const handleToggleFavorite = (e) => {
    e.stopPropagation()
    e.preventDefault()
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

  const goToPrevImage = useCallback(() => {
    setCurrentImageIndex((i) => (i <= 0 ? imageList.length - 1 : i - 1))
  }, [imageList.length])

  const goToNextImage = useCallback(() => {
    setCurrentImageIndex((i) => (i >= imageList.length - 1 ? 0 : i + 1))
  }, [imageList.length])

  const debouncedHandleMouseMove = useDebounce((e) => {
    if (!hasMultipleImages || !imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const zone = x < 0.33 ? 'left' : x > 0.67 ? 'right' : 'middle'
    if (zone !== lastZoneRef.current) {
      lastZoneRef.current = zone
      if (zone === 'left') goToPrevImage()
      else if (zone === 'right') goToNextImage()
    }
  }, 120)

  const handleImageMouseMove = (e) => {
    if (hasHover) debouncedHandleMouseMove(e)
  }

  const handleImageMouseLeave = () => {
    lastZoneRef.current = null
  }

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return
    if (didSwipe) return
    if (id) navigate(`/new-building/${id}`)
  }

  const handleDetailsClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (id) navigate(`/new-building/${id}`)
  }

  const handleImageTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const resetDidSwipe = useCallback(() => setDidSwipe(false), [])

  const handleTouchEnd = (e) => {
    if (!hasMultipleImages) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX
    const threshold = 50
    if (Math.abs(diff) > threshold) {
      setDidSwipe(true)
      e.preventDefault()
      if (diff > 0) goToNextImage()
      else goToPrevImage()
    }
  }

  const tag = launchTag || 'Старт продаж'
  const desc = description || ''

  return (
    <article
      onClick={handleCardClick}
      onTouchStart={resetDidSwipe}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-out border border-gray-light/20 cursor-pointer flex flex-col min-h-0 h-full isolate"
    >
      {/* Изображение — крупное, скруглённое, hover zoom */}
      <div
        ref={imageRef}
        className="relative w-full aspect-[4/3] min-h-[160px] sm:min-h-[180px] lg:min-h-[200px] bg-gray-50 overflow-hidden select-none rounded-t-xl"
        onMouseMove={handleImageMouseMove}
        onMouseLeave={handleImageMouseLeave}
        onTouchStart={handleImageTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-medium text-sm">
            Нет фото
          </div>
        )}

        {/* Точки слайдера — активная синяя */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {imageList.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-0.5 rounded-full transition-colors duration-200 ${
                  idx === currentImageIndex ? 'bg-primary' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Одна плашка "Старт 2 кв. 2026" */}
        <div className="absolute top-2 left-2 z-10">
          <span className="px-3 py-1 bg-white rounded-full text-[11px] font-rubik font-medium text-dark">
            {tag}
          </span>
        </div>

        {/* Иконка избранного — w-9 h-9, touch target ≥ 44px */}
        <IconButton
          variant="ghost"
          size="sm"
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 z-10 w-9 h-9 min-w-[36px] bg-white/80 hover:bg-white hover:scale-105 rounded-md shadow-sm transition-all duration-200 ease-out"
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
      </div>

      {/* Контент: название+цена в строку, описание, ссылка Подробнее */}
      <div className="flex-1 flex flex-col p-3 pt-2.5 min-h-0">
        {/* Первая строка: название слева, цена справа */}
        <div className="flex justify-between items-baseline gap-3 mb-1">
          <h3 className="text-dark text-sm font-rubik font-medium leading-snug line-clamp-1 flex-shrink min-w-0">
            {title}
          </h3>
          <p className="text-primary text-base font-rubik font-bold flex-shrink-0">
            {priceFrom}
          </p>
        </div>

        {/* Описание 1–2 строки */}
        {desc && (
          <p className="text-gray-medium text-xs font-rubik leading-relaxed line-clamp-2 mb-2">
            {desc}
          </p>
        )}

        {/* Ссылка «Подробнее» — синяя, без кнопки */}
        <div className="mt-auto pt-1">
          <button
            type="button"
            onClick={handleDetailsClick}
            className="text-primary text-sm font-rubik font-medium hover:underline transition-colors text-left"
          >
            Подробнее
          </button>
        </div>
      </div>
    </article>
  )
}

export default LaunchSalesCard
