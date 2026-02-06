import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'

const FEATURE_IMAGES = {
  mortgage: '/images/features-mortgage.png',
  selection: '/images/features-selection.png',
  allProperty: '/images/features-all-property.png',
  cabinet: '/images/features-cabinet.png',
}

const features = [
  {
    key: 'mortgage',
    title: 'Ипотечный калькулятор',
    buttonText: 'Рассчитаем ипотеку',
    to: '/#mortgage',
    image: FEATURE_IMAGES.mortgage,
  },
  {
    key: 'selection',
    title: 'Индивидуальный подбор',
    buttonText: 'Помощь с подбором',
    to: '/#help',
    image: FEATURE_IMAGES.selection,
  },
  {
    key: 'allProperty',
    title: 'Вся недвижимость',
    buttonText: 'Все предложения',
    to: '/catalog',
    image: FEATURE_IMAGES.allProperty,
  },
  {
    key: 'cabinet',
    title: 'Ваш личный кабинет',
    buttonText: 'Войти',
    to: '/#register',
    image: FEATURE_IMAGES.cabinet,
  },
]

const AdditionalFeaturesSection = () => {
  return (
    <section id="features" className="w-full bg-white py-8 lg:py-10">
      <div className="max-w-container mx-auto px-4">
        <h2 className="text-dark text-2xl lg:text-3xl font-rubik font-bold mb-5 lg:mb-6">
          Дополнительные возможности
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {features.map((item) => (
            <div
              key={item.key}
              className="bg-gray-50 rounded-lg p-5 flex flex-col items-center text-center min-h-[240px]"
            >
              <div className="flex-1 flex items-center justify-center mb-4 min-h-[100px]">
                <img
                  src={item.image}
                  alt=""
                  className="max-w-full max-h-[100px] w-auto h-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
              <h3 className="text-dark text-base font-rubik font-semibold mb-3">
                {item.title}
              </h3>
              <Button variant="primary" size="sm" to={item.to} fullWidth>
                {item.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdditionalFeaturesSection
