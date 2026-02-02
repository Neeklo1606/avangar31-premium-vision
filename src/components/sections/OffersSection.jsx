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
    <section className="w-full bg-white py-8 lg:py-10">
      <div className="max-w-container mx-auto px-4">
        {/* Заголовок */}
        <h2 className="text-dark text-2xl lg:text-3xl font-rubik font-semibold mb-5 lg:mb-6">
          Новые объявления
        </h2>

        {/* Контейнер с карточками и баннером */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Левая часть: 6 карточек в 3 колонки */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
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

          {/* Правая часть: Промо-карта */}
          <div className="lg:w-[320px] flex-shrink-0">
            <div className="relative bg-primary rounded-lg overflow-hidden shadow-md h-full min-h-[280px]">
              <div className="h-full flex flex-col justify-between p-5">
                <div className="space-y-4">
                  <h3 className="text-white text-3xl lg:text-4xl font-rubik font-bold leading-tight">
                    100 000+<br />объектов
                  </h3>
                  <p className="text-white/90 text-sm font-rubik">
                    Еще больше объектов<br />
                    недвижимости в нашем каталоге
                  </p>
                  <Button 
                    variant="secondary" 
                    size="md"
                    className="bg-white text-dark hover:bg-gray-50 border-white shadow-sm"
                    to="/catalog"
                  >
                    Перейти в каталог
                  </Button>
                </div>

                {/* Изображение */}
                <div className="hidden lg:block mt-4">
                  <img
                    src={bannerImage}
                    alt="Каталог недвижимости"
                    className="w-full h-[120px] object-cover object-bottom rounded-md"
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
