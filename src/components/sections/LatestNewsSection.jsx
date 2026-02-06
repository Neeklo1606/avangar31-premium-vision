import React from 'react'
import { Link } from 'react-router-dom'

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
    badgeTopRight: 'СТАРТ ПРОДАЖ',
  },
]

const LatestNewsSection = () => {
  const newsItems = []
  for (let i = 0; i < 4; i++) {
    const base = defaultNews[0]
    newsItems.push({
      ...base,
      id: base.id + i,
      image: NEWS_IMAGES[i % NEWS_IMAGES.length],
    })
  }

  return (
    <section id="news" className="w-full bg-white py-8 lg:py-10">
      <div className="max-w-container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 lg:mb-6">
          <h2 className="text-dark text-2xl lg:text-3xl font-rubik font-bold">
            Последние новости
          </h2>
          <Link
            to="/news"
            className="text-primary text-sm font-rubik font-medium hover:underline"
          >
            Все новости
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {newsItems.map((item) => (
            <article key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-light/30 hover:shadow-md transition-shadow">
              <Link to={`/news/${item.id}`} className="block group">
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Бейджи */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-primary text-white text-xs font-rubik font-medium rounded">
                      {item.badgeTopLeft}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-error text-white text-xs font-rubik font-medium rounded">
                      {item.badgeTopRight}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-dark text-sm font-rubik font-semibold leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-medium text-xs font-rubik line-clamp-2 mb-3">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary text-xs font-rubik font-medium">
                      Подробнее
                    </span>
                    <span className="text-gray-medium text-xs font-rubik">
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
