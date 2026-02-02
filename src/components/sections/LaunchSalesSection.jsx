import React from 'react'
import ResidentialComplexCard from '../ui/ResidentialComplexCard'

const jkImages = [
  ['/images/jk-card-1.png', '/images/jk-card-2.png'],
  ['/images/jk-card-3.png', '/images/jk-card-4.png'],
  ['/images/jk-card-5.png', '/images/jk-card-6.png'],
]

const defaultComplexes = [
  {
    id: 101,
    image: jkImages[0][0],
    images: jkImages[0],
    title: 'КП Черкизово',
    priceFrom: 'От 16.6 млн ₽',
    apartmentsCount: 'В продаже 56 коттеджей',
    tags: ['Старт продаж', 'Ипотека 6%'],
    apartments: [
      { type: 'Студия', area: 'от 24 м²', price: 'от 5.6 млн' },
      { type: '1-комнатная', area: 'от 32 м²', price: 'от 7.2 млн' },
      { type: '2-комнатная', area: 'от 52 м²', price: 'от 10.5 млн' },
    ],
  },
  {
    id: 102,
    image: jkImages[1][0],
    images: jkImages[1],
    title: 'ЖК Смородина',
    priceFrom: 'От 3.8 млн ₽',
    apartmentsCount: 'В продаже 795 квартир',
    tags: ['Старт продаж', 'Рассрочка 1 год'],
    apartments: [
      { type: 'Студия', area: 'от 24 м²', price: 'от 5.6 млн' },
      { type: '1-комнатная', area: 'от 32 м²', price: 'от 7.2 млн' },
    ],
  },
  {
    id: 103,
    image: jkImages[2][0],
    images: jkImages[2],
    title: 'Таунхаусы в центре',
    priceFrom: 'От 32.8 млн ₽',
    apartmentsCount: 'В продаже 56 коттеджей',
    tags: ['Старт продаж', 'Ипотека 6%'],
    apartments: [
      { type: 'Студия', area: 'от 24 м²', price: 'от 5.6 млн' },
      { type: '1-комнатная', area: 'от 32 м²', price: 'от 7.2 млн' },
    ],
  },
]

const LaunchSalesSection = () => {
  return (
    <section className="w-full bg-white py-8 lg:py-10">
      <div className="max-w-container mx-auto px-4">
        <h2 className="text-dark text-2xl lg:text-3xl font-rubik font-semibold mb-5 lg:mb-6">
          Старт продаж
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {defaultComplexes.map((complex) => (
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
      </div>
    </section>
  )
}

export default LaunchSalesSection
