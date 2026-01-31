import React from 'react'
import { Link } from 'react-router-dom'

// Медиа блока «Дополнительные возможности» — Figma node 98-2407 (иконки карточек)
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
    buttonText: 'Войти / Зарегистрироваться',
    to: '/#register',
    image: FEATURE_IMAGES.cabinet,
  },
]

const AdditionalFeaturesSection = () => {
  return (
    <section className="w-full bg-white py-10 lg:py-16">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-[60px]">
        <h2 className="text-[#000000] text-[32px] lg:text-[44px] font-rubik font-bold mb-8 lg:mb-12">
          Дополнительные возможности
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {features.map((item) => (
            <div
              key={item.key}
              className="bg-[#F5F6FC] rounded-[16px] p-6 lg:p-8 flex flex-col items-center text-center min-h-[280px]"
            >
              <div className="flex-1 flex items-center justify-center mb-5 min-h-[120px]">
                <img
                  src={item.image}
                  alt=""
                  className="max-w-full max-h-[120px] w-auto h-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold" aria-hidden>
                  {item.title.charAt(0)}
                </div>
              </div>
              <h3 className="text-[#000000] text-[18px] lg:text-[20px] font-rubik font-semibold mb-4 leading-tight">
                {item.title}
              </h3>
              <Link
                to={item.to}
                className="w-full min-h-[44px] px-5 flex items-center justify-center bg-primary text-white text-[14px] font-rubik font-medium rounded-[8px] hover:bg-primary-dark transition-colors"
              >
                {item.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdditionalFeaturesSection
