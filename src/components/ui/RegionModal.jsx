import React, { useState, useEffect } from 'react'
import { Button, IconButton } from './index'

/**
 * Модальное окно выбора региона
 */
const RegionModal = ({ isOpen, onClose, currentRegion, onSelectRegion }) => {
  const [selectedRegion, setSelectedRegion] = useState(currentRegion)

  const regions = [
    'Москва и МО',
    'Санкт-Петербург и ЛО',
    'Краснодарский край',
    'Свердловская область',
    'Татарстан',
    'Новосибирская область',
    'Нижегородская область',
    'Челябинская область',
    'Самарская область',
    'Ростовская область',
  ]

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedRegion(currentRegion)
  }, [currentRegion])

  if (!isOpen) return null

  const handleConfirm = () => {
    onSelectRegion(selectedRegion)
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-[200] animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full shadow-xl overflow-hidden animate-scaleIn">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-light/40">
            <h3 className="text-dark text-lg font-rubik font-semibold">
              Выберите регион
            </h3>
            <IconButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              ariaLabel="Закрыть"
              icon={
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              }
            />
          </div>

          {/* Content */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-1">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`
                    w-full text-left px-4 py-3 rounded-md font-rubik text-sm transition-all duration-200
                    ${selectedRegion === region
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-dark hover:bg-gray-100'
                    }
                  `}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-4 border-t border-gray-light/40">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirm}
              className="flex-1"
            >
              Применить
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default RegionModal
