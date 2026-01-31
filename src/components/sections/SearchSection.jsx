import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Tab, TabGroup, IconButton, RegionModal } from '../ui'
import CategoryCard from '../ui/CategoryCard'
import locationIcon from '../../assets/icons/location-icon.svg'
import searchIcon from '../../assets/icons/search-icon.svg'

// Ключ для localStorage (требование п.2, пункт 11)
const REGION_STORAGE_KEY = 'trendagent_selected_region'
const REGION_CONFIRMED_KEY = 'trendagent_region_confirmed'

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
  const navigate = useNavigate()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState(() => {
    return localStorage.getItem(REGION_STORAGE_KEY) || 'Москва и МО'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const filterRef = useRef(null)

  // Проверка: показать модал при первом заходе (требование п.2, пункт 9)
  useEffect(() => {
    const isConfirmed = localStorage.getItem(REGION_CONFIRMED_KEY)
    if (!isConfirmed) {
      setIsRegionModalOpen(true)
    }
  }, [])

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

  const [activeTab, setActiveTab] = useState(0)

  // Обработка выбора региона (требование п.2, пункты 10-11)
  const handleSelectRegion = (region) => {
    setSelectedRegion(region)
    localStorage.setItem(REGION_STORAGE_KEY, region)
    localStorage.setItem(REGION_CONFIRMED_KEY, 'true')
  }

  // Обработка поиска (требование п.8, пункт 29)
  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.append('q', searchQuery)
    if (selectedRegion) params.append('region', selectedRegion)
    params.append('type', filterTabs[activeTab])
    navigate(`/catalog?${params.toString()}`)
  }

  // Обработка Enter в поиске (требование п.8, пункт 29)
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Обработка клика по карточке (требование п.6, пункт 23)
  const handleCategoryClick = (category) => {
    navigate(`/catalog?category=${encodeURIComponent(category.title)}`)
  }

  return (
    <section className="w-full bg-white pt-3 pb-6 lg:pt-4 lg:pb-8">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Заголовок - КОМПАКТНЫЙ (требование п.3) */}
        <h1 className="text-dark text-[24px] lg:text-[40px] font-rubik font-semibold mb-3 lg:mb-4 leading-none text-center">
          <span className="text-primary">Live Grid.</span> Более 100 000 объектов по России
        </h1>

        {/* Геолокация - КЛИКАБЕЛЬНАЯ, КОМПАКТНАЯ (требование п.2) */}
        <button
          onClick={() => setIsRegionModalOpen(true)}
          className="flex items-center gap-2 mb-3 hover:text-primary transition-colors cursor-pointer group"
        >
          <img src={locationIcon} alt="" className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-dark text-[14px] font-rubik font-normal group-hover:text-primary">
            {selectedRegion}
          </span>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60 group-hover:opacity-100">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Модальное окно выбора региона (требование п.2, пункты 9-11) */}
        <RegionModal
          isOpen={isRegionModalOpen}
          onClose={() => setIsRegionModalOpen(false)}
          currentRegion={selectedRegion}
          onSelectRegion={handleSelectRegion}
        />

        {/* Строка поиска с кнопками - КОМПАКТНАЯ (требование п.4) */}
        <div className="relative mb-4" ref={filterRef}>
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
            {/* Поле поиска с кнопкой фильтра - КОМПАКТНОЕ (требование п.4.2) */}
            <Input
              size="md"
              placeholder="Поиск по сайту"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              icon={<img src={searchIcon} alt="" className="w-4 h-4" />}
              iconPosition="left"
              className="flex-1"
              rightElement={
                <IconButton
                  variant="primary"
                  size="sm"
                  onClick={() => setIsFilterOpen((v) => !v)}
                  ariaLabel="Открыть фильтры"
                  className={isFilterOpen ? 'ring-2 ring-primary ring-offset-2' : ''}
                  icon={
                    <svg width="16" height="17" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.49609 2.31836L8.16309 7.89844V14.041L8.20996 14.085L10.585 16.3076L10.8369 16.5439V7.8877L15.5039 2.31836L15.7109 2.07227H3.29004L3.49609 2.31836ZM6.08789 8.55566L6.05273 8.51367L0.365234 1.70312C0.198797 1.50281 0.124971 1.2505 0.157227 1.00195C0.189465 0.754507 0.325227 0.526547 0.538086 0.368164C0.742896 0.227002 0.962695 0.15043 1.18848 0.150391H17.8115C17.9808 0.15042 18.1468 0.193345 18.3057 0.274414L18.4619 0.368164C18.6748 0.526547 18.8105 0.754506 18.8428 1.00195C18.8751 1.2507 18.8005 1.50273 18.6338 1.70312L12.9473 8.51367L12.9121 8.55566V18.7637L12.9131 18.7744C12.9537 19.0598 12.8517 19.3626 12.6201 19.5605L12.6152 19.5654C12.5197 19.655 12.4055 19.7264 12.2793 19.7754C12.1532 19.8243 12.0179 19.8496 11.8809 19.8496C11.7437 19.8496 11.6076 19.8244 11.4814 19.7754C11.3555 19.7264 11.2419 19.6549 11.1465 19.5654L6.38477 15.1104L6.38379 15.1094L6.30469 15.0283C6.23101 14.9433 6.17415 14.847 6.13574 14.7441C6.08458 14.6071 6.0678 14.4609 6.08691 14.3174L6.08789 14.3076V8.55566Z" fill="white" stroke="#3CA4F4" strokeWidth="0.3"/>
                    </svg>
                  }
                />
              }
            />

            {/* CTA - КОМПАКТНАЯ (требование п.4.4) */}
            <Button 
              variant="primary" 
              size="md"
              className="w-full lg:w-auto flex-shrink-0"
              onClick={handleSearch}
            >
              Показать 121 563 объекта
            </Button>
          </div>

          {/* Панель фильтров (Figma 95-4): открывается по клику на кнопку фильтра */}
          {isFilterOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-[12px] border border-gray-light bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#1E1E1E] text-[16px] font-rubik font-semibold">Фильтры</h3>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-medium hover:text-dark text-[13px] font-rubik"
                  aria-label="Закрыть"
                >
                  Закрыть
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                <div>
                  <label className="block text-[#5a5a5a] text-[12px] font-rubik font-medium mb-1.5">Тип объекта</label>
                  <select className="w-full h-9 px-3 border border-gray-light rounded-[8px] text-[13px] font-rubik focus:outline-none focus:border-primary">
                    <option>Квартира</option>
                    <option>Дом</option>
                    <option>Участок</option>
                    <option>Коммерция</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#5a5a5a] text-[12px] font-rubik font-medium mb-1.5">Цена, от</label>
                  <input type="number" placeholder="0" className="w-full h-9 px-3 border border-gray-light rounded-[8px] text-[13px] font-rubik focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[#5a5a5a] text-[12px] font-rubik font-medium mb-1.5">Цена, до</label>
                  <input type="number" placeholder="Любая" className="w-full h-9 px-3 border border-gray-light rounded-[8px] text-[13px] font-rubik focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-[#5a5a5a] text-[12px] font-rubik font-medium mb-1.5">Комнаты</label>
                  <select className="w-full h-9 px-3 border border-gray-light rounded-[8px] text-[13px] font-rubik focus:outline-none focus:border-primary">
                    <option>Любое</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4+</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Сбросить
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Применить
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Табы фильтров - КОМПАКТНЫЕ (требование п.5) */}
        <TabGroup className="mb-4">
          {filterTabs.map((tab, index) => (
            <Tab
              key={index}
              active={activeTab === index}
              onClick={() => setActiveTab(index)}
              size="sm"
            >
              {tab}
            </Tab>
          ))}
        </TabGroup>

        {/* Сетка категорий - КОМПАКТНЫЕ, КЛИКАБЕЛЬНЫЕ (требование п.6) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
          {categories.map((category, index) => (
            <div key={index} onClick={() => handleCategoryClick(category)}>
              <CategoryCard
                image={category.image}
                title={category.title}
                className="aspect-[1/1] min-h-[110px] lg:min-h-[130px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SearchSection
