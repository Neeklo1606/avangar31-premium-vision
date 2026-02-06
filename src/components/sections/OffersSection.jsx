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
    <section className="w-full bg-white py-6 lg:py-8">
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

          {/* Правая часть: CTA-блок — по высоте сетки */}
          <div className="lg:w-[320px] flex-shrink-0 flex">
            <div className="relative bg-primary rounded-xl overflow-hidden shadow-sm w-full min-h-[280px] flex flex-col">
              <div className="flex-1 flex flex-col justify-between p-5">
                <div className="space-y-3">
                  <h3 className="text-white text-2xl lg:text-3xl font-rubik font-bold leading-tight">
                    100 000+<br />объектов
                  </h3>
                  <p className="text-white/90 text-sm font-rubik leading-relaxed">
                    Еще больше объектов<br />
                    недвижимости в нашем каталоге
                  </p>
                  <Button 
                    variant="secondary" 
                    size="md"
                    className="bg-white text-dark hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] border-white shadow-sm transition-all duration-200"
                    to="/catalog"
                  >
                    Перейти в каталог
                  </Button>
                </div>

                {/* Изображение — по макету: значительная часть блока, без обрезки */}
                <div className="hidden lg:block mt-5 flex-1 min-h-[140px] flex items-end">
                  <img
                    src={bannerImage}
                    alt="Каталог недвижимости"
                    className="w-full h-[180px] object-contain object-bottom"
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
