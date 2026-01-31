import React, { useState } from 'react'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import ResidentialComplexCard from '../components/ui/ResidentialComplexCard'
import Pagination from '../components/ui/Pagination'
import locationIcon from '../assets/icons/location-icon.svg'

// Import property card images
import propertyCard1 from '../assets/images/property-card-1.svg'
import propertyCard2 from '../assets/images/property-card-2.svg'

const NewBuildingsCatalogPage = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const breadcrumbItems = [
    { label: 'Главная', link: '/' },
    { label: 'Каталог', link: '/catalog' },
    { label: 'Новостройки' }
  ]

  // Генерация карточек ЖК
  const complexes = []
  const images = [propertyCard1, propertyCard2]
  const names = ['ЖК Снегири', 'ЖК Лесной квартал', 'ЖК Парк Хаус', 'ЖК Северный']
  
  for (let i = 0; i < 8; i++) {
    complexes.push({
      id: i + 1,
      image: images[i % 2],
      title: names[i % 4],
      priceFrom: 'От 5.6 млн',
      apartmentsCount: 'В продаже 226 квартир',
      tags: i % 2 === 0 ? ['Рассрочка 1 год', 'Ипотека 6%'] : ['Ипотека 6%', 'Скидки'],
      apartments: [
        { type: 'Студия', area: 'от 24 м.кв.', price: 'от 5.6 млн' },
        { type: '1-комнатная', area: 'от 32 м.кв.', price: 'от 7.2 млн' },
        { type: '2-комнатная', area: 'от 52 м.кв.', price: 'от 10.5 млн' },
        { type: '3-комнатная', area: 'от 79 м.кв.', price: 'от 14.2 млн' }
      ]
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
            Каталог новостроек в
          </h1>
          <span className="text-primary text-[32px] lg:text-[48px] font-rubik font-bold">
            Москве
          </span>
          <img src={locationIcon} alt="" className="w-6 h-6 ml-2" />
        </div>

        {/* Количество найденных */}
        <div className="mb-8">
          <p className="text-gray-medium text-[16px] font-rubik font-normal">
            Найдено <span className="text-dark font-semibold">156</span> жилых комплексов
          </p>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {complexes.map((complex) => (
            <ResidentialComplexCard
              key={complex.id}
              image={complex.image}
              title={complex.title}
              priceFrom={complex.priceFrom}
              apartmentsCount={complex.apartmentsCount}
              tags={complex.tags}
              apartments={complex.apartments}
            />
          ))}
        </div>

        {/* Пагинация */}
        <Pagination
          currentPage={currentPage}
          totalPages={20}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export default NewBuildingsCatalogPage
