import React, { useState } from 'react'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import NewsCard from '../components/ui/NewsCard'
import Pagination from '../components/ui/Pagination'

// Import property card images for news (reuse)
import propertyCard1 from '../assets/images/property-card-1.svg'
import propertyCard2 from '../assets/images/property-card-2.svg'
import propertyCard3 from '../assets/images/property-card-3.svg'
import propertyCard4 from '../assets/images/property-card-4.svg'
import propertyCard5 from '../assets/images/property-card-5.svg'
import propertyCard6 from '../assets/images/property-card-6.svg'

const NewsListPage = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const breadcrumbItems = [
    { label: 'Главная', link: '/' },
    { label: 'Новости' }
  ]

  const newsItems = []
  const images = [propertyCard1, propertyCard2, propertyCard3, propertyCard4, propertyCard5, propertyCard6]
  const categories = ['Новостройки', 'Рынок', 'Ипотека', 'Аналитика']

  for (let i = 0; i < 9; i++) {
    newsItems.push({
      id: i + 1,
      image: images[i % 6],
      title: 'Новые ипотечные программы с господдержкой стартуют в 2026 году',
      excerpt: 'Правительство анонсировало запуск новых программ льготной ипотеки для молодых семей и покупателей первого жилья с процентной ставкой от 5%.',
      date: '15 января 2026',
      category: categories[i % 4]
    })
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-[60px] py-6 lg:py-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Заголовок */}
        <h1 className="text-dark text-[36px] lg:text-[52px] font-rubik font-bold mb-8 lg:mb-12">
          Новости
        </h1>

        {/* Сетка новостей */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {newsItems.map((news) => (
            <NewsCard
              key={news.id}
              id={news.id}
              image={news.image}
              title={news.title}
              excerpt={news.excerpt}
              date={news.date}
              category={news.category}
            />
          ))}
        </div>

        {/* Пагинация */}
        <Pagination
          currentPage={currentPage}
          totalPages={15}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export default NewsListPage
