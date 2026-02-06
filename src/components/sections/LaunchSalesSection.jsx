import React from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import LaunchSalesCard from '../ui/LaunchSalesCard'
import 'swiper/css'
import 'swiper/css/pagination'

const jkImages = [
  ['/images/jk-card-1.png', '/images/jk-card-2.png'],
  ['/images/jk-card-3.png', '/images/jk-card-4.png'],
  ['/images/jk-card-5.png', '/images/jk-card-6.png'],
  ['/images/jk-card-1.png', '/images/jk-card-3.png'],
]

const defaultComplexes = [
  {
    id: 101,
    image: jkImages[0][0],
    images: jkImages[0],
    title: 'КП Черкизово',
    priceFrom: 'от 16.6 млн ₽',
    launchTag: 'Старт 2 кв. 2026',
    description: 'Комплекс будет расположен в новом районе Москвы с развитой инфраструктурой',
  },
  {
    id: 102,
    image: jkImages[1][0],
    images: jkImages[1],
    title: 'ЖК Смородина',
    priceFrom: 'от 3.8 млн ₽',
    launchTag: 'Старт 2 кв. 2027',
    description: 'В продаже 795 квартир в премиум-классе на берегу реки',
  },
  {
    id: 103,
    image: jkImages[2][0],
    images: jkImages[2],
    title: 'Таунхаусы в центре',
    priceFrom: 'от 32.8 млн ₽',
    launchTag: 'Старт 2 кв. 2026',
    description: 'Современные таунхаусы с развитой инфраструктурой района',
  },
  {
    id: 104,
    image: jkImages[3][0],
    images: jkImages[3],
    title: 'ЖК Берёзка',
    priceFrom: 'от 5.4 млн ₽',
    launchTag: 'Старт 2 кв. 2027',
    description: 'Экологичный комплекс у лесопарковой зоны',
  },
]

const LaunchSalesSection = () => {
  return (
    <section className="w-full bg-white py-8 lg:py-10 launch-sales-section overflow-x-hidden">
      <div className="max-w-container mx-auto px-4">
        {/* Шапка: заголовок + кнопка */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 lg:mb-6">
          <h2 className="text-dark text-2xl lg:text-3xl font-rubik font-bold">
            Старт продаж
          </h2>
          <Link
            to="/catalog?help=1"
            className="h-11 px-5 flex items-center justify-center bg-primary text-white text-sm font-rubik font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            Помощь с подбором
          </Link>
        </div>

        {/* Сетка: sm+ 2 колонки, lg+ 4 колонки */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
          {defaultComplexes.map((complex) => (
            <LaunchSalesCard
              key={complex.id}
              id={complex.id}
              image={complex.image}
              images={complex.images}
              title={complex.title}
              priceFrom={complex.priceFrom}
              description={complex.description}
              launchTag={complex.launchTag}
            />
          ))}
        </div>

        {/* Мобильная (< sm): Swiper карусель */}
        <div className="sm:hidden relative pb-12 overflow-hidden">
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={0.85}
            slidesPerGroup={1}
            centeredSlides={true}
            grabCursor={true}
            speed={300}
            pagination={{ clickable: true }}
            className="launch-sales-swiper"
          >
            {defaultComplexes.map((complex) => (
              <SwiperSlide key={complex.id} className="flex">
                <LaunchSalesCard
                  id={complex.id}
                  image={complex.image}
                  images={complex.images}
                  title={complex.title}
                  priceFrom={complex.priceFrom}
                  description={complex.description}
                  launchTag={complex.launchTag}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <style>{`
        .launch-sales-section .swiper-slide {
          height: auto;
          display: flex;
        }
        .launch-sales-section .swiper-slide > * {
          width: 100%;
          height: 100%;
          min-height: 0;
        }
        .launch-sales-section .swiper {
          padding-bottom: 3rem;
        }
        .launch-sales-section .swiper-pagination {
          bottom: 0 !important;
          display: flex;
          justify-content: center;
          gap: 0.375rem;
        }
        .launch-sales-section .swiper-pagination-bullet {
          width: 28px;
          height: 3px;
          border-radius: 2px;
          background: hsl(var(--color-gray-light));
          opacity: 1;
          transition: background 0.2s;
        }
        .launch-sales-section .swiper-pagination-bullet-active {
          background: hsl(var(--color-primary));
        }
      `}</style>
    </section>
  )
}

export default LaunchSalesSection
