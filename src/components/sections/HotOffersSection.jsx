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
import propertyCard4 from '../../assets/images/property-card-4.svg'
import propertyCard5 from '../../assets/images/property-card-5.svg'
import propertyCard6 from '../../assets/images/property-card-6.svg'

const properties = [
  { id: 201, image: propertyCard1, title: 'ЖК Снегири', price: 'от 5.6 млн', location: 'В продаже 226 квартир', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 20% до 1 февраля 2026', type: 'jk' },
  { id: 202, image: propertyCard2, title: 'Дом 125 м.кв. 3 комнаты', price: '15 600 000 ₽', location: 'Москва, Кантемировская', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 15% до 15 марта 2026', type: 'property' },
  { id: 203, image: propertyCard3, title: 'Дом 125 м.кв. 3 комнаты', price: '15 600 000 ₽', location: 'Москва, Кантемировская', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 10% при покупке до июня', type: 'property' },
  { id: 204, image: propertyCard4, title: 'ЖК Смородина', price: 'от 3.8 млн', location: 'В продаже 795 квартир', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 20% до 1 февраля 2026', type: 'jk' },
  { id: 205, image: propertyCard5, title: 'Дом 125 м.кв. 3 комнаты', price: '15 600 000 ₽', location: 'Москва, Кантемировская', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 15% до 15 марта 2026', type: 'property' },
  { id: 206, image: propertyCard6, title: 'ЖК Солнечный', price: 'от 4.2 млн', location: 'В продаже 312 квартир', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 18% до 28 февраля 2026', type: 'jk' },
  { id: 207, image: propertyCard1, title: 'Квартира 85 м.кв. 2 комнаты', price: '12 400 000 ₽', location: 'Санкт-Петербург, Невский пр.', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 12% при сделке в феврале', type: 'property' },
  { id: 208, image: propertyCard2, title: 'ЖК Берёзка', price: 'от 6.1 млн', location: 'В продаже 445 квартир', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 22% до 15 февраля 2026', type: 'jk' },
  { id: 209, image: propertyCard3, title: 'Таунхаус 180 м.кв. 4 комнаты', price: '28 900 000 ₽', location: 'Москва, Рублёвское шоссе', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 15% до 10 марта 2026', type: 'property' },
  { id: 210, image: propertyCard4, title: 'Квартира 65 м.кв. 1 комната', price: '8 700 000 ₽', location: 'Москва, Тверская', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 8% до конца месяца', type: 'property' },
  { id: 211, image: propertyCard5, title: 'ЖК Звёздный', price: 'от 7.3 млн', location: 'В продаже 198 квартир', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 25% до 1 марта 2026', type: 'jk' },
  { id: 212, image: propertyCard6, title: 'Дом 210 м.кв. 5 комнат', price: '35 200 000 ₽', location: 'Московская область, Одинцово', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 20% при покупке до весны', type: 'property' },
  { id: 213, image: propertyCard1, title: 'ЖК Лазурный', price: 'от 4.9 млн', location: 'В продаже 567 квартир', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 16% до 20 февраля 2026', type: 'jk' },
  { id: 214, image: propertyCard2, title: 'Квартира 95 м.кв. 3 комнаты', price: '18 500 000 ₽', location: 'Москва, Арбат', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 14% до 5 марта 2026', type: 'property' },
  { id: 215, image: propertyCard3, title: 'ЖК Рассвет', price: 'от 5.4 млн', location: 'В продаже 289 квартир', tags: ['Распродажа', 'Ипотека 6%'], discount: 'Скидка 19% до 25 февраля 2026', type: 'jk' },
]

const getHref = (property) => {
  if (property.type === 'jk') return `/new-building/${property.id}`
  return `/property/${property.id}`
}

const HotOffersSection = () => {
  return (
    <section id="hot-offers" className="w-full bg-white py-8 lg:py-10 hot-offers-section overflow-x-hidden max-[430px]:pt-10 max-[430px]:pb-8">
      <div className="max-w-container mx-auto px-4 sm:px-6 overflow-hidden max-[430px]:px-4">
        {/* TASK 1: mobile — заголовок центрирован, ссылка отдельной строкой, secondary-цвет */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 text-center sm:text-left max-[430px]:mb-5 max-[430px]:gap-2 max-[430px]:mt-2">
          <h2 className="text-dark text-2xl lg:text-3xl font-rubik font-bold max-[430px]:text-xl">
            Горящие предложения
          </h2>
          <Link
            to="/catalog"
            className="text-primary text-sm font-rubik font-medium hover:underline sm:ml-auto max-[430px]:text-gray-medium max-[430px]:text-xs"
          >
            Все предложения
          </Link>
        </div>

        {/* TASK 2: Контейнер — 16px padding, карточка не касается краёв */}
        <div className="relative pb-14 overflow-hidden max-[430px]:px-0">
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            slidesPerGroup={1}
            centeredSlides={true}
            grabCursor={true}
            speed={300}
            breakpoints={{
              431: {
                slidesPerView: 0.85,
                slidesPerGroup: 1,
                centeredSlides: true,
              },
              640: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                centeredSlides: false,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 24,
              },
              1200: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 24,
              },
            }}
            pagination={{ clickable: true }}
            className="hot-offers-swiper"
          >
            {properties.map((property) => (
              <SwiperSlide key={property.id} className="flex">
                <PropertyCard
                  id={property.id}
                  image={property.image}
                  title={property.title}
                  price={property.price}
                  location={property.location}
                  tags={property.tags}
                  discount={property.discount}
                  href={getHref(property)}
                  variant="hot"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <style>{`
        @keyframes hotOffersFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hot-offers-section .swiper,
        .hot-offers-section .hot-offers-swiper {
          overflow: hidden;
        }
        .hot-offers-section .swiper-slide-active > * {
          animation: hotOffersFadeIn 0.35s ease-out backwards;
        }
        .hot-offers-section .swiper-slide {
          height: auto;
          display: flex;
        }
        .hot-offers-section .swiper-slide > * {
          width: 100%;
          height: 100%;
          min-height: 0;
        }
        .hot-offers-section .swiper {
          padding-bottom: 3.5rem;
        }
        .hot-offers-section .swiper-pagination {
          bottom: 0 !important;
          margin-top: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
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
        @media (max-width: 768px) {
          .hot-offers-section .swiper-slide {
            padding: 0 8px;
          }
        }
        /* TASK 2 + 7 + 8: mobile — карточка с отступами, пагинация, плавные анимации */
        @media (max-width: 430px) {
          .hot-offers-section .swiper-slide {
            padding: 0 8px;
            box-sizing: border-box;
          }
          .hot-offers-section .swiper-slide-active > * {
            animation-duration: 0.2s;
          }
          .hot-offers-section .swiper {
            padding-bottom: 3rem;
          }
          .hot-offers-section .swiper-pagination {
            bottom: 0 !important;
            margin-top: 24px;
            gap: 6px;
          }
          .hot-offers-section .swiper-pagination-bullet {
            width: 20px;
            height: 3px;
            opacity: 0.6;
            transition: opacity 0.15s ease-out;
          }
          .hot-offers-section .swiper-pagination-bullet-active {
            opacity: 1;
          }
        }
        @media (hover: none) {
          .hot-offers-section .hot-offers-card:hover {
            transform: none !important;
            box-shadow: 0 2px 8px rgba(30, 30, 30, 0.06) !important;
          }
          .hot-offers-section .hot-offers-card:hover img {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}

export default HotOffersSection
