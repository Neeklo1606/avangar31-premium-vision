import React, { useState } from 'react'
import { Button } from '../ui'
import ResidentialComplexCard from '../ui/ResidentialComplexCard'
import YandexMapBlock from '../ui/YandexMapBlock'
import locationIcon from '../../assets/icons/location-icon.svg'
import mapPinIcon from '../../assets/icons/map-pin-icon.svg'

// Фото карточек
const jkImages = [
  ['/images/jk-card-1.png', '/images/jk-card-2.png'],
  ['/images/jk-card-3.png', '/images/jk-card-4.png'],
  ['/images/jk-card-5.png', '/images/jk-card-6.png'],
]

const defaultComplexes = [
  {
    id: 1,
    image: jkImages[0][0],
    images: jkImages[0],
    title: 'КП Черкизово',
    priceFrom: 'От 16.6 млн ₽',
    apartmentsCount: 'В продаже 56 коттеджей',
    tags: ['Рассрочка 1 год', 'Ипотека 6%'],
    apartments: [
      { type: 'Студия', area: 'от 24 м²', price: 'от 5.6 млн' },
      { type: '1-комнатная', area: 'от 32 м²', price: 'от 7.2 млн' },
      { type: '2-комнатная', area: 'от 52 м²', price: 'от 10.5 млн' },
      { type: '3-комнатная', area: 'от 79 м²', price: 'от 14.2 млн' },
    ],
  },
  {
    id: 2,
    image: jkImages[1][0],
    images: jkImages[1],
    title: 'ЖК Смородина',
    priceFrom: 'От 3.8 млн ₽',
    apartmentsCount: 'В продаже 795 квартир',
    tags: ['Рассрочка 1 год', 'Ипотека 6%'],
    apartments: [
      { type: 'Студия', area: 'от 24 м²', price: 'от 5.6 млн' },
      { type: '1-комнатная', area: 'от 32 м²', price: 'от 7.2 млн' },
      { type: '2-комнатная', area: 'от 52 м²', price: 'от 10.5 млн' },
    ],
  },
  {
    id: 3,
    image: jkImages[2][0],
    images: jkImages[2],
    title: 'Таунхаусы в центре',
    priceFrom: 'От 32.8 млн ₽',
    apartmentsCount: 'В продаже 56 коттеджей',
    tags: ['ТОП продаж', 'Ипотека 6%'],
    apartments: [
      { type: 'Студия', area: 'от 24 м²', price: 'от 5.6 млн' },
      { type: '1-комнатная', area: 'от 32 м²', price: 'от 7.2 млн' },
      { type: '2-комнатная', area: 'от 52 м²', price: 'от 10.5 млн' },
    ],
  },
]

const ResidentialComplexSection = () => {
  const [viewMode, setViewMode] = useState('cards')

  const complexes = []
  for (let i = 0; i < 8; i++) {
    const base = defaultComplexes[i % 3]
    complexes.push({
      ...base,
      id: base.id + i * 10,
    })
  }

  return (
    <section className="w-full bg-white py-8 lg:py-10" id="catalog-jk-section">
      <div className="max-w-container mx-auto px-4">
        {/* Заголовок с кнопками */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mb-5 lg:mb-6">
          <h2 className="text-dark text-2xl lg:text-3xl font-rubik font-semibold">
            Каталог ЖК в{' '}
            <span className="text-primary">Москве</span>
          </h2>
          <img src={locationIcon} alt="" className="w-4 h-4 opacity-60" aria-hidden />
          
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {viewMode === 'cards' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('map')}
                icon={<img src={mapPinIcon} alt="" className="w-4 h-5 shrink-0" aria-hidden />}
                iconPosition="left"
                className="bg-gray-50 hover:bg-gray-100"
              >
                На карте
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('cards')}
                className="bg-gray-50 hover:bg-gray-100"
              >
                Список
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              to="/catalog/new-buildings"
              className="bg-gray-50 hover:bg-gray-100"
            >
              Все предложения
            </Button>
          </div>
        </div>

        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {complexes.map((complex) => (
              <ResidentialComplexCard
                key={complex.id}
                id={complex.id}
                image={complex.image}
                images={complex.images}
                title={complex.title}
                priceFrom={complex.priceFrom}
                apartmentsCount={complex.apartmentsCount}
                tags={complex.tags}
                apartments={complex.apartments}
              />
            ))}
          </div>
        ) : (
          <YandexMapBlock complexes={complexes} />
        )}
      </div>
    </section>
  )
}

export default ResidentialComplexSection
