import React from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import NewsCard from '../components/ui/NewsCard'
import propertyCard1 from '../assets/images/property-card-1.svg'
import propertyCard2 from '../assets/images/property-card-2.svg'
import propertyCard3 from '../assets/images/property-card-3.svg'

const NewsDetailPage = () => {
  const { id } = useParams()

  const breadcrumbItems = [
    { label: 'Главная', link: '/' },
    { label: 'Новости', link: '/news' },
    { label: 'Новые ипотечные программы' }
  ]

  const relatedNews = [
    {
      id: 2,
      image: propertyCard2,
      title: 'Рынок недвижимости показал рост в январе',
      excerpt: 'Аналитики отмечают увеличение спроса на жилье в начале 2026 года.',
      date: '14 января 2026',
      category: 'Рынок'
    },
    {
      id: 3,
      image: propertyCard3,
      title: 'Топ-5 новостроек Москвы с лучшими условиями',
      excerpt: 'Обзор самых привлекательных предложений от застройщиков.',
      date: '13 января 2026',
      category: 'Новостройки'
    }
  ]

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-[60px] py-6 lg:py-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Категория */}
        <div className="mb-4">
          <span className="px-4 py-2 bg-primary text-white text-[12px] font-rubik font-semibold rounded-full">
            Ипотека
          </span>
        </div>

        {/* Заголовок */}
        <h1 className="text-dark text-[32px] lg:text-[48px] font-rubik font-bold mb-4 leading-tight">
          Новые ипотечные программы с господдержкой стартуют в 2026 году
        </h1>

        {/* Дата и автор */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-light">
          <span className="text-gray-medium text-[14px] font-rubik font-normal">
            15 января 2026
          </span>
          <span className="text-gray-medium">•</span>
          <span className="text-gray-medium text-[14px] font-rubik font-normal">
            Редакция Live Grid
          </span>
        </div>

        {/* Главное изображение */}
        <div className="rounded-[20px] overflow-hidden shadow-xl mb-10">
          <img
            src={propertyCard1}
            alt="Новость"
            className="w-full h-[400px] lg:h-[500px] object-cover"
          />
        </div>

        {/* Контент статьи */}
        <div className="max-w-[800px] mx-auto space-y-6 mb-16">
          <p className="text-dark text-[18px] font-rubik font-normal leading-relaxed">
            Правительство Российской Федерации анонсировало запуск новых программ льготной ипотеки 
            для молодых семей и покупателей первого жилья. Процентная ставка по новым программам 
            составит от 5% годовых.
          </p>
          
          <p className="text-dark text-[16px] font-rubik font-normal leading-relaxed">
            Согласно заявлению Министерства строительства, новые программы будут доступны с 1 февраля 2026 года. 
            Они охватят более 50 регионов России и позволят приобрести жилье на льготных условиях 
            семьям с детьми, молодым специалистам и бюджетникам.
          </p>

          <blockquote className="border-l-4 border-primary pl-6 py-2 my-8">
            <p className="text-dark text-[18px] font-rubik font-medium italic leading-relaxed">
              "Эти программы станут важным шагом в поддержке граждан и развитии рынка недвижимости"
            </p>
          </blockquote>

          <p className="text-dark text-[16px] font-rubik font-normal leading-relaxed">
            Эксперты рынка недвижимости оценивают данную инициативу положительно. По прогнозам аналитиков, 
            новые программы могут увеличить объем выдачи ипотечных кредитов на 15-20% в первом полугодии 2026 года.
          </p>

          <h2 className="text-dark text-[24px] font-rubik font-bold mt-8 mb-4">
            Основные условия программ
          </h2>

          <ul className="space-y-3 text-dark text-[16px] font-rubik font-normal leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Процентная ставка от 5% годовых</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Первоначальный взнос от 15%</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Срок кредитования до 30 лет</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Максимальная сумма кредита — 12 млн рублей</span>
            </li>
          </ul>
        </div>

        {/* Похожие новости */}
        <div className="pt-10 border-t border-gray-light">
          <h2 className="text-dark text-[32px] font-rubik font-bold mb-8">
            Читайте также
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedNews.map((news) => (
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
        </div>
      </div>
    </div>
  )
}

export default NewsDetailPage
