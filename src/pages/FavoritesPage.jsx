import React, { useState, useEffect } from 'react'
import { Button } from '../components/ui'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import PropertyCard from '../components/ui/PropertyCard'
import ResidentialComplexCard from '../components/ui/ResidentialComplexCard'

/**
 * Страница избранного (требование п.8, пункт 33)
 */
const FavoritesPage = () => {
  const [favoriteProperties, setFavoriteProperties] = useState([])
  const [favoriteComplexes, setFavoriteComplexes] = useState([])

  const breadcrumbItems = [
    { label: 'Главная', link: '/' },
    { label: 'Избранное' }
  ]

  // Загрузка избранных из localStorage
  useEffect(() => {
    try {
      const properties = JSON.parse(localStorage.getItem('trendagent_favorites_property') || '[]')
      const complexes = JSON.parse(localStorage.getItem('trendagent_favorites_jk') || '[]')
      setFavoriteProperties(properties)
      setFavoriteComplexes(complexes)
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }, [])

  const isEmpty = favoriteProperties.length === 0 && favoriteComplexes.length === 0

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Заголовок */}
        <h1 className="text-dark text-[32px] lg:text-[48px] font-rubik font-bold mb-8">
          Избранное
        </h1>

        {isEmpty ? (
          /* Пустое состояние (требование п.8, пункт 33) */
          <div className="bg-white rounded-[16px] p-12 text-center shadow-lg">
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-6 text-gray-medium"
            >
              <path 
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none"
              />
            </svg>
            <h2 className="text-dark text-[24px] font-rubik font-bold mb-3">
              В избранном пока пусто
            </h2>
            <p className="text-gray-medium text-[16px] font-rubik mb-6 max-w-[400px] mx-auto">
              Добавляйте объекты в избранное, чтобы быстро находить их позже
            </p>
            <Button 
              variant="primary" 
              size="lg"
              to="/catalog"
            >
              Перейти в каталог
            </Button>
          </div>
        ) : (
          <>
            {/* Избранные объекты */}
            {favoriteProperties.length > 0 && (
              <div className="mb-12">
                <h2 className="text-dark text-[24px] font-rubik font-bold mb-6">
                  Объекты ({favoriteProperties.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              </div>
            )}

            {/* Избранные ЖК */}
            {favoriteComplexes.length > 0 && (
              <div>
                <h2 className="text-dark text-[24px] font-rubik font-bold mb-6">
                  Жилищные комплексы ({favoriteComplexes.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteComplexes.map((complex) => (
                    <ResidentialComplexCard key={complex.id} {...complex} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage
