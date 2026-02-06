import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Tab, TabGroup, RegionModal } from '../ui'
import CategoryCard from '../ui/CategoryCard'
import locationIcon from '../../assets/icons/location-icon.svg'
import searchIcon from '../../assets/icons/search-icon.svg'

// Storage keys
const REGION_STORAGE_KEY = 'livegrid_selected_region'
const REGION_CONFIRMED_KEY = 'livegrid_region_confirmed'

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

const SearchSection = () => {
  const navigate = useNavigate()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState(() => {
    return localStorage.getItem(REGION_STORAGE_KEY) || 'Москва и МО'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const filterRef = useRef(null)
  const [activeTab, setActiveTab] = useState(0)

  // Проверка региона при первом заходе
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

  // Категории: Row1 — 2 wide + 3 narrow, Row2 — 3 narrow + 2 wide
  const categories = [
    { image: categoryNovostrojki, title: 'Новостройки', wide: true },
    { image: categoryVtorichnaya, title: 'Вторичная недвижимость', wide: true },
    { image: categoryArenda, title: 'Аренда', wide: false },
    { image: categoryDoma, title: 'Дома', wide: false },
    { image: categoryUchastki, title: 'Участки', wide: false },
    { image: categoryIpoteka, title: 'Ипотека', wide: false },
    { image: categoryKvartiry, title: 'Квартиры', wide: false },
    { image: categoryParkingi, title: 'Паркинги', wide: false },
    { image: categoryKommercheskaya, title: 'Коммерческая недвижимость', wide: true },
    { image: categoryPodobrat, title: 'Подобрать объект', wide: true },
  ]

  const filterTabs = ['Квартиры', 'Паркинги', 'Дома с участками', 'Участки', 'Коммерция']

  const handleSelectRegion = (region) => {
    setSelectedRegion(region)
    localStorage.setItem(REGION_STORAGE_KEY, region)
    localStorage.setItem(REGION_CONFIRMED_KEY, 'true')
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.append('q', searchQuery)
    if (selectedRegion) params.append('region', selectedRegion)
    params.append('type', filterTabs[activeTab])
    navigate(`/catalog?${params.toString()}`)
  }

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleCategoryClick = (category) => {
    navigate(`/catalog?category=${encodeURIComponent(category.title)}`)
  }

  return (
    <section className="w-full bg-white flex flex-col">
      <div className="max-w-container mx-auto px-4 pt-2 pb-4 lg:pt-3 lg:pb-6 flex flex-col gap-3 lg:gap-4">
        {/* Геолокация — отдельная кнопка под хедером, слева */}
        <div className="flex-shrink-0 flex justify-start">
          <button
            onClick={() => setIsRegionModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-transparent hover:bg-gray-50 transition-colors cursor-pointer group text-left"
          >
            <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-primary opacity-60 group-hover:opacity-100" aria-hidden>
              <path d="M7.5 0C3.36473 0 7.63536e-05 3.40955 7.63536e-05 7.59525C-0.0271109 13.718 7.215 18.7948 7.5 19C7.5 19 15.0271 13.718 14.9999 7.6C14.9999 3.40955 11.6353 0 7.5 0ZM7.5 11.4C5.42815 11.4 3.75004 9.6995 3.75004 7.6C3.75004 5.5005 5.42815 3.8 7.5 3.8C9.57186 3.8 11.25 5.5005 11.25 7.6C11.25 9.6995 9.57186 11.4 7.5 11.4Z" fill="currentColor"/>
            </svg>
            <span className="text-dark text-sm font-rubik group-hover:text-primary transition-colors">
              {selectedRegion}
            </span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="opacity-50 group-hover:opacity-100 transition-opacity">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Hero-блок по центру (max-w-xl), компактные отступы */}
        <div className="mx-auto w-full max-w-xl flex-shrink-0 flex flex-col gap-3 lg:gap-4">
          {/* Заголовок — Live Grid. синий italic, остальное чёрный, центр */}
          <h1 className="text-center text-xl lg:text-2xl font-rubik font-normal leading-tight">
            <span className="text-primary italic font-semibold">Live Grid.</span>{' '}
            <span className="text-dark font-medium">Более 100 000 объектов по России</span>
          </h1>

          {/* Модальное окно региона */}
          <RegionModal
            isOpen={isRegionModalOpen}
            onClose={() => setIsRegionModalOpen(false)}
            currentRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
          />

          {/* Строка поиска: [Input] [Filter] [CTA] — одна линия desktop; mobile: [Input+Filter] [CTA full] */}
          <div className="relative" ref={filterRef}>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
              {/* Mobile: Input+Filter в одном ряду; Desktop: все в одном ряду */}
              <div className="flex flex-row gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <Input
                    size="md"
                    placeholder="Поиск по сайту"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    icon={<img src={searchIcon} alt="" className="w-4 h-4" />}
                    iconPosition="left"
                    className="w-full h-11 bg-gray-50 border-gray-light focus:border-primary rounded-lg"
                  />
                </div>
                {/* Кнопка фильтра — квадратная, 44px, иконка воронка */}
                <button
                  type="button"
                  onClick={() => setIsFilterOpen((v) => !v)}
                  aria-label="Фильтры"
                  className={`shrink-0 w-11 h-11 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-light hover:bg-gray-100 transition-colors ${isFilterOpen ? 'ring-2 ring-primary ring-offset-1 bg-primary-light border-primary' : ''}`}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                    <path d="M3 5h14M5 10h10M7 15h6" />
                  </svg>
                </button>
              </div>
              {/* CTA — синяя, 44px, full width на mobile */}
              <Button
                variant="primary"
                size="md"
                className="w-full sm:w-auto flex-shrink-0 h-11 px-5 rounded-lg min-w-0 sm:min-w-[180px]"
                onClick={handleSearch}
              >
                Показать 121 563 объекта
              </Button>
            </div>

            {/* Панель фильтров */}
            {isFilterOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-light/40 bg-white p-5 shadow-lg animate-slideUp">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-dark text-base font-rubik font-semibold">Фильтры</h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-medium hover:text-dark text-sm font-rubik transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-gray-medium text-xs font-rubik font-medium mb-1.5">Тип объекта</label>
                  <select className="w-full h-10 px-3 border border-gray-light rounded-md text-sm font-rubik focus:outline-none focus:border-primary transition-colors">
                    <option>Квартира</option>
                    <option>Дом</option>
                    <option>Участок</option>
                    <option>Коммерция</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-medium text-xs font-rubik font-medium mb-1.5">Цена, от</label>
                  <input type="number" placeholder="0" className="w-full h-10 px-3 border border-gray-light rounded-md text-sm font-rubik focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-gray-medium text-xs font-rubik font-medium mb-1.5">Цена, до</label>
                  <input type="number" placeholder="Любая" className="w-full h-10 px-3 border border-gray-light rounded-md text-sm font-rubik focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-gray-medium text-xs font-rubik font-medium mb-1.5">Комнаты</label>
                  <select className="w-full h-10 px-3 border border-gray-light rounded-md text-sm font-rubik focus:outline-none focus:border-primary transition-colors">
                    <option>Любое</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4+</option>
                  </select>
                </div>
              </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setIsFilterOpen(false)}>
                    Сбросить
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setIsFilterOpen(false)}>
                    Применить
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Табы фильтров — строго под поиском, центр hero, 36px высота, равномерные промежутки */}
          <TabGroup layout="hero">
            {filterTabs.map((tab, index) => (
              <Tab
                key={index}
                active={activeTab === index}
                onClick={() => setActiveTab(index)}
                size="hero"
                variant="hero"
              >
                {tab}
              </Tab>
            ))}
          </TabGroup>
        </div>

        {/* Сетка категорий — 2 визуальных ряда, крупные карточки, gap 12–16px */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 auto-rows-fr flex-shrink-0 min-h-0">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              image={category.image}
              title={category.title}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SearchSection
