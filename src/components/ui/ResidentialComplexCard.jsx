import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from './index'
import heartIcon from '../../assets/icons/heart-icon.svg'
import heartIconFilled from '../../assets/icons/heart-icon-filled.svg'

const FAVORITES_STORAGE_KEY = 'trendagent_favorites_jk'

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
  const [imageHoverX, setImageHoverX] = useState(null)
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

  const handleПодробнееClick = (e) => {
    e.stopPropagation()
    if (id) navigate(`/new-building/${id}`)
  }

  const handleCardMouseEnter = () => setExpanded(true)
  const handleCardMouseLeave = () => setExpanded(false)

  const handleImageMouseMove = useCallback(
    (e) => {
      if (!hasMultipleImages || !imageRef.current) return
      const rect = imageRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      setImageHoverX(x)
    },
    [hasMultipleImages]
  )

  const handleImageMouseLeave = useCallback(() => {
    setImageHoverX(null)
  }, [])

  const handleImageClick = (e) => {
    e.stopPropagation()
    if (!hasMultipleImages) return
    const rect = imageRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width
    if (x < 0.33) {
      setCurrentImageIndex((i) => (i <= 0 ? imageList.length - 1 : i - 1))
    } else if (x > 0.66) {
      setCurrentImageIndex((i) => (i >= imageList.length - 1 ? 0 : i + 1))
    }
  }

  // При наведении влево/вправо — перелистывание (без клика)
  React.useEffect(() => {
    if (!hasMultipleImages || imageHoverX === null) return
    const t = setTimeout(() => {
      if (imageHoverX < 0.25) {
        setCurrentImageIndex((i) => (i <= 0 ? imageList.length - 1 : i - 1))
      } else if (imageHoverX > 0.75) {
        setCurrentImageIndex((i) => (i >= imageList.length - 1 ? 0 : i + 1))
      }
    }, 400)
    return () => clearTimeout(t)
  }, [imageHoverX, hasMultipleImages, imageList.length])

  const apartmentsToShow = apartments.slice(0, 4)

  // Фиксированная высота карточки — при наведении контент не сдвигает элементы снизу
  const CARD_HEIGHT = 340
  const IMAGE_HEIGHT = 254
  const IMAGE_HEIGHT_COLLAPSED = 80

  return (
    <article
      onClick={handleCardClick}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      className="bg-white rounded-[15px] overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 cursor-pointer flex flex-col"
      style={{ height: CARD_HEIGHT }}
    >
      {/* Блок изображения: при expanded сворачивается; высота фиксирована — общая высота карточки не меняется */}
      <div
        ref={imageRef}
        className="relative w-full flex-shrink-0 bg-gray-100 overflow-hidden select-none"
        style={{
          height: expanded ? IMAGE_HEIGHT_COLLAPSED : IMAGE_HEIGHT,
          transition: 'height 0.35s ease',
        }}
        onMouseMove={handleImageMouseMove}
        onMouseLeave={handleImageMouseLeave}
        onClick={handleImageClick}
      >
        {displayImage && (
          <img
            src={displayImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ minHeight: expanded ? 80 : 254 }}
          />
        )}
        {!displayImage && (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            Нет фото
          </div>
        )}

        {/* Зоны влево/вправо для подсказки перелистывания */}
        {hasMultipleImages && !expanded && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-1/3 cursor-w-resize" />
            <div className="absolute right-0 top-0 bottom-0 w-1/3 cursor-e-resize" />
          </>
        )}

        {/* Теги: Новостройка + Рассрочка, Ипотека и т.д. */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="px-3 py-1.5 bg-white/95 rounded-[25px] text-[11px] font-semibold text-dark shadow-sm">
            Новостройка
          </span>
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-white/95 rounded-[25px] text-[11px] font-semibold text-dark shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Кнопка «Добавить в избранное» — без подложки, только иконка 22×20 */}
        <IconButton
          variant="ghost"
          size="md"
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 bg-transparent hover:bg-white/20"
          ariaLabel={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          icon={
            <img
              src={isFavorite ? heartIconFilled : heartIcon}
              alt=""
              className="w-[22px] h-5"
            />
          }
        />
      </div>

      {/* Контент: flex-1 — занимает оставшееся место; при сворачивании фото блок квартир появляется в освободившемся пространстве */}
      <div className="flex-1 min-h-0 flex flex-col p-4 overflow-hidden">
        <h3 className="text-[#3F3F3F] text-[14px] font-medium font-rubik leading-[1.18] mb-1 flex-shrink-0">
          {title}
        </h3>
        <p className="text-[#3F3F3F] text-[14px] font-medium font-rubik text-right lowercase mb-1 flex-shrink-0">
          {priceFrom}
        </p>
        <p className="text-[#3F3F3F] text-[12px] font-rubik mb-3 flex-shrink-0">
          {apartmentsCount}
        </p>

        {/* Блок квартир: при наведении показывается в освободившейся области — без изменения высоты карточки */}
        {apartmentsToShow.length > 0 && (
          <div
            className="flex-1 min-h-0 overflow-hidden transition-all duration-300"
            style={{
              maxHeight: expanded ? 200 : 0,
              opacity: expanded ? 1 : 0,
            }}
          >
            <div className="border-t border-gray-200 pt-3 space-y-2 overflow-auto">
              {apartmentsToShow.map((apt, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-[12px] font-rubik"
                >
                  {apt.area || apt.price ? (
                    <>
                      <div className="flex gap-4">
                        <span className="text-primary font-normal min-w-[90px]">
                          {apt.type}
                        </span>
                        <span className="text-[#8E8E8E]">{apt.area}</span>
                      </div>
                      <span className="text-[#8E8E8E]">{apt.price}</span>
                    </>
                  ) : (
                    <span className="text-primary font-normal">{apt.type}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Подробнее — по макету: 12px, primary (#3CA4F4) */}
        <button
          type="button"
          onClick={handleПодробнееClick}
          className="mt-3 w-full text-center text-primary text-[12px] font-rubik font-semibold hover:text-primary-dark hover:underline transition-colors flex-shrink-0"
        >
          Подробнее
        </button>
      </div>
    </article>
  )
}

export default ResidentialComplexCard
