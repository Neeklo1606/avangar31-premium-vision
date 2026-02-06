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
 * Унифицированная карточка жилого комплекса
 * План: 3.1–3.12, M3.1–M3.11
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
  const [didSwipe, setDidSwipe] = useState(false)
  const imageRef = useRef(null)
  const touchStartX = useRef(0)
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
    if (x < 0.33) goToPrevImage()
    else if (x > 0.67) goToNextImage()
  }, 150)

  const handleImageMouseMove = (e) => {
    if (hasHover) debouncedHandleMouseMove(e)
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

  const handleImageClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (!hasMultipleImages || !imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    if (x < 0.4) goToPrevImage()
    else goToNextImage()
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

  const handleMouseEnter = () => {
    if (hasHover) setExpanded(true)
  }

  const handleMouseLeave = () => {
    setExpanded(false)
  }

  const handleToggleExpand = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setExpanded((v) => !v)
  }

  const apartmentsToShow = apartments.slice(0, 4)

  return (
    <article
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={resetDidSwipe}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-out border border-gray-light/20 cursor-pointer flex flex-col min-h-0 h-full"
    >
      {/* Изображение — фиксированная высота, без layout shift (3.1, 3.11) */}
      <div
        ref={imageRef}
        className="relative w-full aspect-[4/3] min-h-[160px] sm:min-h-[180px] lg:min-h-[200px] bg-gray-50 overflow-hidden select-none rounded-t-xl"
        onClick={handleImageClick}
        onMouseMove={handleImageMouseMove}
        onTouchStart={handleImageTouchStart}
        onTouchEnd={handleTouchEnd}
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

        {/* Индикатор изображений (3.8, M3.2) */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {imageList.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                  idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Бейджи (3.4, M3.3) */}
        <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1 z-10">
          <span className="px-2 py-0.5 bg-white/90 rounded-md text-[11px] font-rubik font-medium text-dark">
            Новостройка
          </span>
          {tags.slice(0, 1).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-white/90 rounded-md text-[11px] font-rubik font-medium text-dark"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Кнопка избранного (3.5) */}
        <IconButton
          variant="ghost"
          size="sm"
          onClick={handleToggleFavorite}
          className="absolute top-1.5 right-1.5 z-10 w-8 h-8 min-w-[32px] bg-white/70 hover:bg-white hover:scale-110 hover:opacity-100 rounded-md shadow-sm transition-all duration-200 ease-out"
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

      {/* Контент (3.2, 3.3, 3.7, M3.5–M3.8) */}
      <div className="flex-1 flex flex-col p-3 min-h-0">
        <h3 className="text-dark text-sm font-rubik font-medium leading-snug mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="text-primary text-base font-rubik font-bold mb-0.5">
          {priceFrom}
        </p>
        <p className="text-gray-medium text-xs font-rubik leading-relaxed mb-2">
          {apartmentsCount}
        </p>

        {/* Блок квартир — раскрытие по hover (desktop) или тапу (mobile) (3.7, M3.7) */}
        {apartmentsToShow.length > 0 && (
          <div
            className="overflow-hidden transition-[opacity,transform] duration-200 ease-out"
            style={{
              opacity: expanded ? 1 : 0,
              transform: expanded ? 'translateY(0)' : 'translateY(-8px)',
              maxHeight: expanded ? 140 : 0,
              visibility: expanded ? 'visible' : 'hidden',
            }}
          >
            <div className="border-t border-gray-light/40 pt-2 space-y-1.5">
              {apartmentsToShow.map((apt, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center gap-2 text-xs font-rubik"
                >
                  <span className="text-primary flex-shrink-0">{apt.type}</span>
                  <span className="text-gray-medium truncate">{apt.area}</span>
                  <span className="text-gray-medium flex-shrink-0">{apt.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Кнопка подробнее / раскрыть (3.9, M3.8) */}
        <div className="mt-auto pt-2 flex flex-col gap-2">
          {apartmentsToShow.length > 0 && !hasHover && (
            <button
              type="button"
              onClick={handleToggleExpand}
              className="text-primary text-xs font-rubik font-medium hover:underline transition-colors text-left"
            >
              {expanded ? 'Свернуть' : 'Показать квартиры'}
            </button>
          )}
          <button
            type="button"
            onClick={handleDetailsClick}
            className="w-full min-h-[44px] sm:min-h-0 sm:h-auto sm:w-auto sm:inline-block py-3 sm:py-0 sm:pt-2 text-primary text-sm font-rubik font-medium hover:underline transition-all duration-200 active:scale-[0.98] rounded-lg sm:rounded-none bg-primary/5 sm:bg-transparent hover:bg-primary/10 sm:hover:bg-transparent"
          >
            Подробнее
          </button>
        </div>
      </div>
    </article>
  )
}

export default ResidentialComplexCard
