import React, { useState, useRef, useEffect } from 'react'
import CategoryCard from '../ui/CategoryCard'
import locationIcon from '../../assets/icons/location-icon.svg'
import searchIcon from '../../assets/icons/search-icon.svg'

// Import category images
import categoryNovostrojki from '../../assets/images/category-novostrojki.png'
import categoryVtorichnaya from '../../assets/images/category-vtorichnaya.png'
import categoryKommercheskaya from '../../assets/images/category-kommercheskaya.png'
import categoryArenda from '../../assets/images/category-arenda.png'
import categoryDoma from '../../assets/images/category-doma.png'
import categoryKvartiry from '../../assets/images/category-kvartiry.png'
import categoryUchastki from '../../assets/images/category-uchastki.png'
import categoryParkingi from '../../assets/images/category-parkingi.png'
import categoryPodobrat from '../../assets/images/category-podobrat.png'
import categoryIpoteka from '../../assets/images/ipoteka.png'

// Панель фильтров по макету Figma node 95-4
const SearchSection = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false)
      }
    }
    if (isFilterOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isFilterOpen])

  const categories = [
    // Строка 1
    { image: categoryNovostrojki, title: 'Новостройки' },
    { image: categoryVtorichnaya, title: 'Вторичная\nнедвижимость' },
    { image: categoryArenda, title: 'Аренда' },
    { image: categoryDoma, title: 'Дома' },
    { image: categoryUchastki, title: 'Участки' },
    // Строка 2
    { image: categoryIpoteka, title: 'Ипотека' },
    { image: categoryKvartiry, title: 'Квартиры' },
    { image: categoryParkingi, title: 'Паркинги' },
    { image: categoryKommercheskaya, title: 'Коммерческая\nнедвижимость' },
    { image: categoryPodobrat, title: 'Подобрать\nобъект' }
  ]

  const filterTabs = [
    'Квартиры',
    'Паркинги',
    'Дома с участками',
    'Участки',
    'Коммерция'
  ]

  return (
    <section className="w-full bg-white py-6 lg:py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Заголовок */}
        <h1 className="text-dark text-[28px] lg:text-[48px] font-rubik font-bold mb-8 lg:mb-10 leading-tight text-center">
          <span className="text-primary">Live Grid.</span> Более 100 000 объектов по России
        </h1>

        {/* Выбор города */}
        <div className="flex items-center gap-2 mb-6">
          <img src={locationIcon} alt="" className="w-5 h-5" />
          <span className="text-dark text-[16px] font-rubik font-normal">
            Москва и МО
          </span>
        </div>

        {/* Строка поиска с кнопками и панель фильтров */}
        <div className="relative mb-8" ref={filterRef}>
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
            {/* Поле поиска с иконками */}
            <div className="relative flex-1">
              <img
                src={searchIcon}
                alt=""
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40"
              />
              <input
                type="text"
                placeholder="Поиск по сайту"
                className="w-full h-[56px] pl-12 pr-16 bg-white border-2 border-gray-light rounded-[8px] text-[16px] font-rubik placeholder:text-gray-medium focus:outline-none focus:border-primary transition-colors"
              />
              {/* Кнопка фильтра — по клику открывается панель (Figma node 95-4) */}
              <button
                type="button"
                onClick={() => setIsFilterOpen((v) => !v)}
                aria-expanded={isFilterOpen}
                aria-label="Открыть фильтры"
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-primary rounded-[6px] hover:bg-primary-dark transition-colors ${isFilterOpen ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              >
                <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.49609 2.31836L8.16309 7.89844V14.041L8.20996 14.085L10.585 16.3076L10.8369 16.5439V7.8877L15.5039 2.31836L15.7109 2.07227H3.29004L3.49609 2.31836ZM6.08789 8.55566L6.05273 8.51367L0.365234 1.70312C0.198797 1.50281 0.124971 1.2505 0.157227 1.00195C0.189465 0.754507 0.325227 0.526547 0.538086 0.368164C0.742896 0.227002 0.962695 0.15043 1.18848 0.150391H17.8115C17.9808 0.15042 18.1468 0.193345 18.3057 0.274414L18.4619 0.368164C18.6748 0.526547 18.8105 0.754506 18.8428 1.00195C18.8751 1.2507 18.8005 1.50273 18.6338 1.70312L12.9473 8.51367L12.9121 8.55566V18.7637L12.9131 18.7744C12.9537 19.0598 12.8517 19.3626 12.6201 19.5605L12.6152 19.5654C12.5197 19.655 12.4055 19.7264 12.2793 19.7754C12.1532 19.8243 12.0179 19.8496 11.8809 19.8496C11.7437 19.8496 11.6076 19.8244 11.4814 19.7754C11.3555 19.7264 11.2419 19.6549 11.1465 19.5654L6.38477 15.1104L6.38379 15.1094L6.30469 15.0283C6.23101 14.9433 6.17415 14.847 6.13574 14.7441C6.08458 14.6071 6.0678 14.4609 6.08691 14.3174L6.08789 14.3076V8.55566Z" fill="white" stroke="#3CA4F4" strokeWidth="0.3"/>
                </svg>
              </button>
            </div>

            <button className="w-full lg:w-auto h-[56px] px-8 lg:px-10 bg-primary text-white text-[16px] font-rubik font-semibold rounded-[8px] hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg whitespace-nowrap flex-shrink-0">
              Показать 121 563 объекта
            </button>
          </div>

          {/* Панель фильтров (Figma 95-4): открывается по клику на кнопку фильтра */}
          {isFilterOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-[12px] border border-gray-light bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[#1E1E1E] text-[18px] font-rubik font-bold">Фильтры</h3>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-medium hover:text-dark text-[14px] font-rubik"
                  aria-label="Закрыть"
                >
                  Закрыть
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                <div>
                  <label className="block text-[#5a5a5a] text-[13px] font-rubik font-medium mb-2">Тип объекта</label>
                  <select className="w-full h-10 px-3 border border-gray-light rounded-[8px] text-[14px] font-rubik focus:outline-none focus:border-primary">
                    <option>Квартира</option>
                    <option>Дом</option>
                    <option>Участок</option>
                    <option>Коммерция</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#5a5a5a] text-[13px] font-rubik font-medium mb-2">Цена, от</label>
                  <input type="number" placeholder="0" className="w-full h-10 px-3 border border-gray-light rounded-[8px] text-[14px] font-rubik focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[#5a5a5a] text-[13px] font-rubik font-medium mb-2">Цена, до</label>
                  <input type="number" placeholder="Любая" className="w-full h-10 px-3 border border-gray-light rounded-[8px] text-[14px] font-rubik focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[#5a5a5a] text-[13px] font-rubik font-medium mb-2">Комнаты</label>
                  <select className="w-full h-10 px-3 border border-gray-light rounded-[8px] text-[14px] font-rubik focus:outline-none focus:border-primary">
                    <option>Любое</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4+</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="px-5 py-2.5 border border-gray-light rounded-[8px] text-[14px] font-rubik font-medium text-gray-medium hover:border-primary hover:text-primary transition-colors"
                >
                  Сбросить
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="px-5 py-2.5 bg-primary text-white rounded-[8px] text-[14px] font-rubik font-semibold hover:bg-primary-dark transition-colors"
                >
                  Применить
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Табы фильтров */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filterTabs.map((tab, index) => (
            <button
              key={index}
              className={`px-6 py-3 rounded-[8px] text-[15px] font-rubik font-medium transition-all ${
                index === 0
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white border-2 border-gray-light text-gray-medium hover:border-primary hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Сетка категорий */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              image={category.image}
              title={category.title}
              className="aspect-[1/1] min-h-[140px] lg:min-h-[160px]"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SearchSection
