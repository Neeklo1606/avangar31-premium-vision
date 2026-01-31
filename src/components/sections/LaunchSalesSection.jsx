import React from 'react'
import ResidentialComplexCard from '../ui/ResidentialComplexCard'

// Те же изображения и структура карточек, что в секции «Каталог ЖК в Москве»
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
    priceFrom: 'От 16.6 млн',
    apartmentsCount: 'В продаже 56 коттеджей',
    tags: ['Старт продаж', 'Ипотека 6%'],
    apartments: [
      { type: 'Студия', area: 'от 24 м.кв.', price: 'от 5.6 млн' },
      { type: '1-комнатная', area: 'от 32 м.кв.', price: 'от 7.2 млн' },
      { type: '2-комнатная', area: 'от 52 м.кв.', price: 'от 10.5 млн' },
      { type: '3-комнатная', area: 'от 79 м.кв.', price: 'от 14.2 млн' },
    ],
  },
  {
    id: 102,
    image: jkImages[1][0],
    images: jkImages[1],
    title: 'ЖК Смородина',
    priceFrom: 'От 3.8 млн',
    apartmentsCount: 'В продаже 795 квартир',
    tags: ['Старт продаж', 'Рассрочка 1 год'],
    apartments: [
      { type: 'Студия', area: 'от 24 м.кв.', price: 'от 5.6 млн' },
      { type: '1-комнатная', area: 'от 32 м.кв.', price: 'от 7.2 млн' },
      { type: '2-комнатная', area: 'от 52 м.кв.', price: 'от 10.5 млн' },
      { type: 'В продаже 22 таунхауса', area: '', price: '' },
    ],
  },
  {
    id: 103,
    image: jkImages[2][0],
    images: jkImages[2],
    title: 'Таунхаусы в центре',
    priceFrom: 'От 32.8 млн',
    apartmentsCount: 'В продаже 56 коттеджей',
    tags: ['Старт продаж', 'Ипотека 6%'],
    apartments: [
      { type: 'Студия', area: 'от 24 м.кв.', price: 'от 5.6 млн' },
      { type: '1-комнатная', area: 'от 32 м.кв.', price: 'от 7.2 млн' },
      { type: '2-комнатная', area: 'от 52 м.кв.', price: 'от 10.5 млн' },
      { type: '3-комнатная', area: 'от 79 м.кв.', price: 'от 14.2 млн' },
    ],
  },
]

const LaunchSalesSection = () => {
  const complexes = defaultComplexes

  return (
    <section className="w-full bg-white py-10 lg:py-14">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-[60px]">
        <h2 className="text-[#000000] text-[26px] lg:text-[32px] font-rubik font-semibold leading-tight mb-8">
          Старт продаж
        </h2>

        {/* Сетка карточек — такие же, как в блоке «Каталог ЖК в Москве» (ResidentialComplexCard) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-[20px]">
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
      </div>
    </section>
  )
}

export default LaunchSalesSection
