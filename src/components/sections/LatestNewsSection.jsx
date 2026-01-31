import React from 'react'
import { Link } from 'react-router-dom'

// Медиа блока «Последние новости» — Figma node 98-2432 (карточки новостей)
const NEWS_IMAGES = []
for (let i = 1; i <= 8; i++) {
  NEWS_IMAGES.push(`/images/news-card-${i}.png`)
}

const defaultNews = [
  {
    id: 1,
    image: NEWS_IMAGES[0],
    title: 'Старт строительства нового комплекса в центре Москвы',
    excerpt: 'Известный застройщик открывает продажи нового комплекса, успейте приобрести по первым ценам',
    date: '16.01.26',
    badgeTopLeft: 'НОВЫЕ СЕЗОНЫ 2',
    badgeTopLeftSub: 'МЕЧТА НОВОСЁЛОВ',
    badgeTopRight: 'СТАРТ ПРОДАЖ',
    centerLeft: 'РЕМОНТ',
    centerRight: 'В ПОДАРОК',
  },
]

const LatestNewsSection = () => {
  const newsItems = []
  for (let i = 0; i < 8; i++) {
    const base = defaultNews[0]
    newsItems.push({
      ...base,
      id: base.id + i,
      image: NEWS_IMAGES[i % NEWS_IMAGES.length],
    })
  }

  return (
    <section className="w-full bg-white py-10 lg:py-16">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-[60px]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 lg:mb-10">
          <h2 className="text-[#000000] text-[32px] lg:text-[44px] font-rubik font-bold">
            Последние новости
          </h2>
          <Link
            to="/news"
            className="text-primary text-[16px] font-rubik font-medium hover:underline shrink-0"
          >
            Все новости
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {newsItems.map((item) => (
            <article key={item.id} className="bg-white rounded-[16px] overflow-hidden shadow-lg border border-gray-light/20 hover:shadow-xl transition-shadow">
              <Link to={`/news/${item.id}`} className="block group">
                {/* Область изображения с оверлеями по макету */}
                <div className="relative w-full h-[220px] overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  {/* Сверху слева: синий баннер + подзаголовок */}
                  <div className="absolute top-3 left-3 flex flex-col gap-0.5">
                    <span className="px-3 py-1.5 bg-primary text-white text-[10px] lg:text-[11px] font-rubik font-semibold rounded uppercase tracking-wide">
                      {item.badgeTopLeft}
                    </span>
                    <span className="text-white text-[10px] font-rubik font-normal opacity-95">
                      {item.badgeTopLeftSub}
                    </span>
                  </div>
                  {/* Сверху справа: красный баннер СТАРТ ПРОДАЖ */}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1.5 bg-red-600 text-white text-[10px] lg:text-[11px] font-rubik font-semibold rounded uppercase tracking-wide">
                      {item.badgeTopRight}
                    </span>
                  </div>
                  {/* По центру слева/справа: РЕМОНТ / В ПОДАРОК */}
                  <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                    <span className="text-white text-[18px] lg:text-[22px] font-rubik font-bold drop-shadow-lg">
                      {item.centerLeft}
                    </span>
                    <span className="text-white text-[18px] lg:text-[22px] font-rubik font-bold drop-shadow-lg">
                      {item.centerRight}
                    </span>
                  </div>
                </div>

                {/* Текст под изображением */}
                <div className="p-4 lg:p-5">
                  <h3 className="text-[#000000] text-[15px] lg:text-[16px] font-rubik font-bold leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#8E8E8E] text-[13px] font-rubik font-normal leading-relaxed line-clamp-2 mb-4">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary text-[13px] font-rubik font-semibold hover:underline">
                      Подробнее
                    </span>
                    <span className="text-[#8E8E8E] text-[13px] font-rubik font-normal">
                      {item.date}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LatestNewsSection
