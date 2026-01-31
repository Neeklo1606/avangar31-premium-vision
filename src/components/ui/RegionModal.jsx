import React, { useState, useEffect } from 'react'
import { Button, IconButton } from './index'

/**
 * Модальное окно выбора региона (требование п.2, пункты 9-11)
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

  if (!isOpen) return null

  const handleConfirm = () => {
    onSelectRegion(selectedRegion)
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[200]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div className="bg-white rounded-[12px] max-w-[500px] w-full shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-light">
            <h3 className="text-dark text-[20px] font-rubik font-bold">
              Выберите регион
            </h3>
            <IconButton
              variant="ghost"
              size="md"
              onClick={onClose}
              ariaLabel="Закрыть"
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              }
            />
          </div>

          {/* Content */}
          <div className="p-5 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`w-full text-left px-4 py-3 rounded-[8px] font-rubik text-[15px] transition-colors ${
                    selectedRegion === region
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-dark hover:bg-gray-100'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-5 border-t border-gray-light">
            <Button
              variant="outline"
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
