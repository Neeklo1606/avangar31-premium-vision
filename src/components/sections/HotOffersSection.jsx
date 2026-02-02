import React from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import PropertyCard from '../ui/PropertyCard'
import 'swiper/css'
import 'swiper/css/pagination'

import propertyCard1 from '../../assets/images/property-card-1.svg'
import propertyCard2 from '../../assets/images/property-card-2.svg'
import propertyCard3 from '../../assets/images/property-card-3.svg'

const properties = [
  { id: 201, image: propertyCard1, title: 'Дом 125 м² — 3 комнаты', price: '15 600 000 ₽', location: 'Москва, Кантемировская', tags: ['Распродажа', 'Ипотека 6%'] },
  { id: 202, image: propertyCard2, title: 'Дом 125 м² — 3 комнаты', price: '15 600 000 ₽', location: 'Москва, Кантемировская', tags: ['Распродажа', 'Ипотека 6%'] },
  { id: 203, image: propertyCard3, title: 'Дом 125 м² — 3 комнаты', price: '15 600 000 ₽', location: 'Москва, Кантемировская', tags: ['Распродажа', 'Ипотека 6%'] },
  { id: 204, image: propertyCard1, title: 'Дом 125 м² — 3 комнаты', price: '15 600 000 ₽', location: 'Москва, Кантемировская', tags: ['Распродажа', 'Ипотека 6%'] },
  { id: 205, image: propertyCard2, title: 'Дом 125 м² — 3 комнаты', price: '15 600 000 ₽', location: 'Москва, Кантемировская', tags: ['Распродажа', 'Ипотека 6%'] },
]

const HotOffersSection = () => {
  return (
    <section className="w-full bg-white py-8 lg:py-10 hot-offers-section overflow-x-hidden">
      <div className="max-w-container mx-auto px-4 overflow-hidden">
        {/* Заголовок */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 lg:mb-6">
          <h2 className="text-dark text-2xl lg:text-3xl font-rubik font-bold">
            Горящие предложения
          </h2>
          <Link
            to="/catalog"
            className="h-10 px-4 flex items-center bg-gray-50 rounded-md text-dark text-sm font-rubik hover:bg-gray-100 transition-colors"
          >
            Все предложения
          </Link>
        </div>

        {/* Слайдер */}
        <div className="relative pb-12 overflow-hidden">
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            slidesPerGroup={1}
            breakpoints={{
              640: { slidesPerView: 2, slidesPerGroup: 2 },
              768: { slidesPerView: 3, slidesPerGroup: 3 },
              1024: { slidesPerView: 4, slidesPerGroup: 4 },
            }}
            pagination={{ clickable: true }}
            className="hot-offers-swiper"
          >
            {properties.map((property) => (
              <SwiperSlide key={property.id}>
                <PropertyCard
                  id={property.id}
                  image={property.image}
                  title={property.title}
                  price={property.price}
                  location={property.location}
                  tags={property.tags}
                  href={`/property/${property.id}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <style>{`
        .hot-offers-section .swiper,
        .hot-offers-section .hot-offers-swiper {
          overflow: hidden;
        }
        .hot-offers-section .swiper-slide {
          height: auto;
        }
        .hot-offers-section .swiper {
          padding-bottom: 3rem;
        }
        .hot-offers-section .swiper-pagination {
          bottom: 0 !important;
          display: flex;
          justify-content: center;
          gap: 0.375rem;
        }
        .hot-offers-section .swiper-pagination-bullet {
          width: 28px;
          height: 3px;
          border-radius: 2px;
          background: hsl(var(--color-gray-light));
          opacity: 1;
          transition: background 0.2s;
        }
        .hot-offers-section .swiper-pagination-bullet-active {
          background: hsl(var(--color-primary));
        }
      `}</style>
    </section>
  )
}

export default HotOffersSection
