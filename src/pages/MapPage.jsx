import React from 'react'
import Breadcrumbs from '../components/ui/Breadcrumbs'

const MapPage = () => {
  const breadcrumbItems = [
    { label: 'Главная', link: '/' },
    { label: 'На карте' }
  ]

  return (
    <div className="max-w-[1200px] mx-auto px-4 lg:px-[60px] py-8">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="text-2xl font-rubik font-semibold text-dark mt-4 mb-6">
        ЖК на карте
      </h1>
      <div className="bg-gray-100 rounded-[15px] h-[500px] flex items-center justify-center text-gray-medium font-rubik">
        Карта (здесь можно подключить Яндекс.Карты или другую карту)
      </div>
    </div>
  )
}

export default MapPage
