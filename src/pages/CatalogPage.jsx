import React, { useState } from 'react'
import { Button } from '../components/ui'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import FilterPanel from '../components/ui/FilterPanel'
import PropertyCard from '../components/ui/PropertyCard'
import Pagination from '../components/ui/Pagination'
import locationIcon from '../assets/icons/location-icon.svg'

// Import property card images
import propertyCard1 from '../assets/images/property-card-1.svg'
import propertyCard2 from '../assets/images/property-card-2.svg'
import propertyCard3 from '../assets/images/property-card-3.svg'
import propertyCard4 from '../assets/images/property-card-4.svg'
import propertyCard5 from '../assets/images/property-card-5.svg'
import propertyCard6 from '../assets/images/property-card-6.svg'

const CatalogPage = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const breadcrumbItems = [
    { label: 'Главная', link: '/' },
    { label: 'Каталог' }
  ]

  // Генерация множества карточек для демонстрации
  const properties = []
  const propertyImages = [propertyCard1, propertyCard2, propertyCard3, propertyCard4, propertyCard5, propertyCard6]
  
  for (let i = 0; i < 12; i++) {
    properties.push({
      id: i + 1,
      image: propertyImages[i % 6],
      title: 'Дом 125 м.кв. 3 комнаты',
      price: '15 600 000',
      location: 'Москва, Кантемировская',
      tags: i % 2 === 0 ? ['Распродажа', 'Ипотека 6%'] : ['Ипотека 6%']
    })
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-[60px] py-6 lg:py-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Заголовок */}
        <div className="flex items-baseline gap-3 mb-8 lg:mb-10">
          <h1 className="text-dark text-[32px] lg:text-[48px] font-rubik font-bold">
            Каталог объектов в
          </h1>
          <span className="text-primary text-[32px] lg:text-[48px] font-rubik font-bold">
            Москве
          </span>
          <img src={locationIcon} alt="" className="w-6 h-6 ml-2" />
        </div>

        {/* Основной контент */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Левая панель - Фильтры (только на desktop) */}
          <aside className="hidden lg:block lg:w-[280px] flex-shrink-0">
            <FilterPanel />
          </aside>

          {/* Правая часть - Карточки */}
          <div className="flex-1">
            {/* Мобильная кнопка фильтров */}
            <Button 
              variant="secondary" 
              size="lg" 
              fullWidth
              className="lg:hidden mb-6"
            >
              Фильтры
            </Button>

            {/* Количество найденных */}
            <div className="mb-6">
              <p className="text-gray-medium text-[16px] font-rubik font-normal">
                Найдено <span className="text-dark font-semibold">121 563</span> объекта
              </p>
            </div>

            {/* Сетка карточек */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-6 mb-8">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  image={property.image}
                  title={property.title}
                  price={property.price}
                  location={property.location}
                  tags={property.tags}
                />
              ))}
            </div>

            {/* Пагинация */}
            <Pagination
              currentPage={currentPage}
              totalPages={100}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CatalogPage
