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
  { id: 201, image: propertyCard1, title: 'Дом 125 м.кв. 3 комнаты', price: '15 600 000', location: 'Москва, Кантемировская', tags: ['Распродажа', 'Ипотека 6%'] },
  { id: 202, image: propertyCard2, title: 'Дом 125 м.кв. 3 комнаты', price: '15 600 000', location: 'Москва, Кантемировская', tags: ['Распродажа', 'Ипотека 6%'] },
  { id: 203, image: propertyCard3, title: 'Дом 125 м.кв. 3 комнаты', price: '15 600 000', location: 'Москва, Кантемировская', tags: ['Распродажа', 'Ипотека 6%'] },
  { id: 204, image: propertyCard1, title: 'Дом 125 м.кв. 3 комнаты', price: '15 600 000', location: 'Москва, Кантемировская', tags: ['Распродажа', 'Ипотека 6%'] },
  { id: 205, image: propertyCard2, title: 'Дом 125 м.кв. 3 комнаты', price: '15 600 000', location: 'Москва, Кантемировская', tags: ['Распродажа', 'Ипотека 6%'] },
]

const HotOffersSection = () => {
  return (
    <section className="w-full bg-white py-10 lg:py-14 hot-offers-section overflow-x-hidden">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-[60px] overflow-hidden">
        {/* Заголовок и кнопка «Все предложения» справа — по макету Figma */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 lg:mb-10">
          <h2 className="text-dark text-[32px] lg:text-[44px] font-rubik font-bold">
            Горящие предложения
          </h2>
          <Link
            to="/catalog"
            className="min-h-[42px] px-5 flex items-center bg-[#F5F6FC] rounded-[5px] text-[#000000] text-[13px] font-rubik font-normal hover:bg-[#E8EAF2] transition-colors shrink-0"
          >
            Все предложения
          </Link>
        </div>

        {/* Слайдер: контейнер с overflow-hidden — без горизонтального скролла */}
        <div className="relative pb-14 overflow-hidden">
          <Swiper
            modules={[Pagination]}
            spaceBetween={20}
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
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {/* Стили: пагинация — полоски (по макету Figma), без выхода слайдера за контейнер */}
      <style>{`
        .hot-offers-section .swiper,
        .hot-offers-section .hot-offers-swiper {
          overflow: hidden;
        }
        .hot-offers-section .swiper-wrapper {
          box-sizing: border-box;
        }
        .hot-offers-section .swiper-slide {
          height: auto;
          box-sizing: border-box;
        }
        .hot-offers-section .swiper {
          padding-bottom: 4rem;
        }
        .hot-offers-section .swiper-pagination {
          bottom: 0 !important;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }
        .hot-offers-section .swiper-pagination-bullet {
          width: 32px;
          height: 4px;
          border-radius: 2px;
          background: #d1d5db;
          opacity: 1;
          transition: background 0.2s;
        }
        .hot-offers-section .swiper-pagination-bullet-active {
          background: #3CA4F4;
          transform: none;
        }
      `}</style>
    </section>
  )
}

export default HotOffersSection
