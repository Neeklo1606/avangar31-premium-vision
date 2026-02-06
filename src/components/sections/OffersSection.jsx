import React from 'react'
import { Button } from '../ui'
import PropertyCard from '../ui/PropertyCard'
import bannerImage from '../../assets/images/banner-catalog.png'

// Import property card images
import propertyCard1 from '../../assets/images/property-card-1.svg'
import propertyCard2 from '../../assets/images/property-card-2.svg'
import propertyCard3 from '../../assets/images/property-card-3.svg'
import propertyCard4 from '../../assets/images/property-card-4.svg'
import propertyCard5 from '../../assets/images/property-card-5.svg'
import propertyCard6 from '../../assets/images/property-card-6.svg'

const OffersSection = () => {
  const properties = [
    {
      id: 1,
      image: propertyCard1,
      title: 'Дом 125 м² — 3 комнаты',
      price: '15 600 000 ₽',
      location: 'Москва, Кантемировская',
      tags: ['Распродажа', 'Ипотека 6%']
    },
    {
      id: 2,
      image: propertyCard2,
      title: 'Дом 125 м² — 3 комнаты',
      price: '15 600 000 ₽',
      location: 'Москва, Кантемировская',
      tags: ['Распродажа', 'Ипотека 6%']
    },
    {
      id: 3,
      image: propertyCard3,
      title: 'Дом 125 м² — 3 комнаты',
      price: '15 600 000 ₽',
      location: 'Москва, Кантемировская',
      tags: ['Распродажа', 'Ипотека 6%']
    },
    {
      id: 4,
      image: propertyCard4,
      title: 'Дом 125 м² — 3 комнаты',
      price: '15 600 000 ₽',
      location: 'Москва, Кантемировская',
      tags: ['Распродажа', 'Ипотека 6%']
    },
    {
      id: 5,
      image: propertyCard5,
      title: 'Дом 125 м² — 3 комнаты',
      price: '15 600 000 ₽',
      location: 'Москва, Кантемировская',
      tags: ['Распродажа', 'Ипотека 6%']
    },
    {
      id: 6,
      image: propertyCard6,
      title: 'Дом 125 м² — 3 комнаты',
      price: '15 600 000 ₽',
      location: 'Москва, Кантемировская',
      tags: ['Распродажа', 'Ипотека 6%']
    }
  ]

  return (
    <section id="offers" className="w-full bg-white py-6 lg:py-8">
      <div className="max-w-container mx-auto px-4">
        {/* Заголовок — по макету, выровнен по левому краю сетки */}
        <h2 className="text-dark text-xl lg:text-2xl font-rubik font-semibold leading-tight mb-4 lg:mb-5">
          Новые объявления
        </h2>

        {/* Контейнер с карточками и баннером */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-stretch">
          {/* Левая часть: 6 карточек в 3 колонки */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                image={property.image}
                title={property.title}
                price={property.price}
                location={property.location}
                tags={property.tags}
                href={`/property/${property.id}`}
              />
            ))}
          </div>

          {/* Правая часть: CTA-блок — по макету */}
          <div className="lg:w-[340px] flex-shrink-0 flex">
            <div className="relative bg-primary rounded-2xl overflow-hidden shadow-md w-full min-h-[320px] lg:min-h-0 flex flex-col">
              <div className="flex-1 flex flex-col justify-between p-6 lg:p-7">
                <div className="space-y-4">
                  <h3 className="text-white text-3xl lg:text-4xl font-rubik font-extrabold leading-tight">
                    100 000+<br />объектов
                  </h3>
                  <p className="text-white/80 text-sm font-rubik leading-relaxed max-w-[260px]">
                    Еще больше объектов недвижимости в нашем каталоге
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    fullWidth
                    className="!h-12 !w-full !min-w-0 !px-6 bg-white text-dark border-gray-200 hover:bg-white/95 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 rounded-xl transition-all duration-250 ease-out border"
                    to="/catalog"
                  >
                    Перейти в каталог
                  </Button>
                </div>

                {/* Иллюстрация — крупная, с объёмом, в нижней части */}
                <div className="mt-6 lg:mt-8 flex-1 min-h-[160px] lg:min-h-[200px] flex items-end justify-center">
                  <img
                    src={bannerImage}
                    alt="Каталог недвижимости"
                    className="w-full max-w-[320px] h-[200px] lg:h-[260px] object-contain object-bottom drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OffersSection
