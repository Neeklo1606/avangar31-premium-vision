import React from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../components/ui'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import propertyCard1 from '../assets/images/property-card-1.svg'

const NewBuildingDetailPage = () => {
  const { id } = useParams()

  const breadcrumbItems = [
    { label: 'Главная', link: '/' },
    { label: 'Каталог', link: '/catalog' },
    { label: 'Новостройки', link: '/catalog/new-buildings' },
    { label: 'ЖК Снегири' }
  ]

  const apartments = [
    { type: 'Студия', area: 'от 24 м.кв.', price: 'от 5.6 млн', available: 45 },
    { type: '1-комнатная', area: 'от 32 м.кв.', price: 'от 7.2 млн', available: 78 },
    { type: '2-комнатная', area: 'от 52 м.кв.', price: 'от 10.5 млн', available: 62 },
    { type: '3-комнатная', area: 'от 79 м.кв.', price: 'от 14.2 млн', available: 41 }
  ]

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-[60px] py-6 lg:py-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Заголовок */}
        <h1 className="text-dark text-[36px] lg:text-[52px] font-rubik font-bold mb-6">
          ЖК Снегири
        </h1>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Левая часть - Галерея */}
          <div className="lg:col-span-2">
            <div className="rounded-[20px] overflow-hidden shadow-xl mb-6">
              <img
                src={propertyCard1}
                alt="ЖК Снегири"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>

            {/* Описание */}
            <div className="space-y-4">
              <h2 className="text-dark text-[24px] font-rubik font-bold">
                Описание
              </h2>
              <p className="text-dark text-[16px] font-rubik font-normal leading-relaxed">
                ЖК "Снегири" — современный жилой комплекс, расположенный в экологически чистом районе Подмосковья. 
                Комплекс предлагает квартиры от студий до просторных трехкомнатных планировок. 
                Развитая инфраструктура, детские площадки, паркинг и зеленые зоны.
              </p>
            </div>
          </div>

          {/* Правая часть - Информация */}
          <div className="space-y-6">
            {/* Цена */}
            <div className="bg-gray-50 rounded-[16px] p-6 border border-gray-light/30">
              <p className="text-gray-medium text-[14px] font-rubik font-normal mb-2">
                Цена от
              </p>
              <p className="text-primary text-[32px] font-rubik font-bold mb-4">
                5.6 млн ₽
              </p>
              <p className="text-gray-medium text-[14px] font-rubik font-normal">
                В продаже 226 квартир
              </p>
            </div>

            {/* Теги */}
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-white border-2 border-primary text-primary text-[12px] font-rubik font-semibold rounded-full">
                Рассрочка 1 год
              </span>
              <span className="px-4 py-2 bg-white border-2 border-primary text-primary text-[12px] font-rubik font-semibold rounded-full">
                Ипотека 6%
              </span>
            </div>

            {/* Адрес */}
            <div className="bg-gray-50 rounded-[16px] p-6 border border-gray-light/30">
              <p className="text-gray-medium text-[14px] font-rubik font-normal mb-2">
                Адрес
              </p>
              <p className="text-dark text-[16px] font-rubik font-medium">
                Московская область, п. Снегири
              </p>
            </div>

            {/* Кнопка связаться */}
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth
            >
              Связаться с застройщиком
            </Button>
          </div>
        </div>

        {/* Таблица квартир */}
        <div className="bg-white rounded-[20px] p-6 lg:p-8 shadow-lg border border-gray-light/30 mb-10">
          <h2 className="text-dark text-[28px] font-rubik font-bold mb-6">
            Квартиры в продаже
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-light">
                  <th className="text-left py-4 px-4 text-dark text-[14px] font-rubik font-bold">Тип</th>
                  <th className="text-left py-4 px-4 text-dark text-[14px] font-rubik font-bold">Площадь</th>
                  <th className="text-left py-4 px-4 text-dark text-[14px] font-rubik font-bold">Цена от</th>
                  <th className="text-left py-4 px-4 text-dark text-[14px] font-rubik font-bold">В наличии</th>
                </tr>
              </thead>
              <tbody>
                {apartments.map((apt, index) => (
                  <tr key={index} className="border-b border-gray-light hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-primary text-[15px] font-rubik font-medium">{apt.type}</td>
                    <td className="py-4 px-4 text-dark text-[15px] font-rubik font-normal">{apt.area}</td>
                    <td className="py-4 px-4 text-dark text-[16px] font-rubik font-bold">{apt.price}</td>
                    <td className="py-4 px-4 text-gray-medium text-[15px] font-rubik font-normal">{apt.available} шт</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewBuildingDetailPage
