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
      image: propertyCard1,
      title: 'Дом 125 м.кв. 3 комнаты',
      price: '15 600 000',
      location: 'Москва, Кантемировская',
      tags: ['Распродажа', 'Ипотека 6%']
    },
    {
      image: propertyCard2,
      title: 'Дом 125 м.кв. 3 комнаты',
      price: '15 600 000',
      location: 'Москва, Кантемировская',
      tags: ['Распродажа', 'Ипотека 6%']
    },
    {
      image: propertyCard3,
      title: 'Дом 125 м.кв. 3 комнаты',
      price: '15 600 000',
      location: 'Москва, Кантемировская',
      tags: ['Распродажа', 'Ипотека 6%']
    },
    {
      image: propertyCard4,
      title: 'Дом 125 м.кв. 3 комнаты',
      price: '15 600 000',
      location: 'Москва, Кантемировская',
      tags: ['Распродажа', 'Ипотека 6%']
    },
    {
      image: propertyCard5,
      title: 'Дом 125 м.кв. 3 комнаты',
      price: '15 600 000',
      location: 'Москва, Кантемировская',
      tags: ['Распродажа', 'Ипотека 6%']
    },
    {
      image: propertyCard6,
      title: 'Дом 125 м.кв. 3 комнаты',
      price: '15 600 000',
      location: 'Москва, Кантемировская',
      tags: ['Распродажа', 'Ипотека 6%']
    }
  ]

  return (
    <section className="w-full bg-white py-10 lg:py-14">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Заголовок */}
        <h2 className="text-dark text-[32px] lg:text-[44px] font-rubik font-bold mb-8 lg:mb-10">
          Новые объявления
        </h2>

        {/* Контейнер с карточками и баннером */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-5">
          {/* Левая часть: 6 карточек в 3 колонки */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-5">
            {properties.map((property, index) => (
              <PropertyCard
                key={index}
                image={property.image}
                title={property.title}
                price={property.price}
                location={property.location}
                tags={property.tags}
              />
            ))}
          </div>

          {/* Правая часть: Баннер */}
          <div className="lg:w-[340px] flex-shrink-0">
            <div className="relative bg-primary rounded-[20px] overflow-hidden shadow-2xl h-full">
              <div className="h-full flex flex-col justify-between p-8 lg:p-10">
                {/* Текст и кнопка */}
                <div className="space-y-6">
                  <h3 className="text-white text-[36px] lg:text-[48px] font-rubik font-bold leading-tight">
                    100 000 +<br />объектов
                  </h3>
                  <p className="text-white text-[15px] lg:text-[16px] font-rubik font-normal leading-relaxed opacity-90">
                    Еще больше объектов<br />
                    недвижимости в нашем каталоге
                  </p>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="bg-white text-dark hover:bg-gray-50 hover:scale-105 border-white"
                  >
                    Перейти в каталог
                  </Button>
                </div>

                {/* Изображение внизу */}
                <div className="hidden lg:block mt-6">
                  <img
                    src={bannerImage}
                    alt="Каталог недвижимости"
                    className="w-full h-[180px] object-cover rounded-[12px]"
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
