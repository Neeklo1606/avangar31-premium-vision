import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Tab, TabGroup, IconButton, RegionModal } from '../ui'
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

  // Категории — 2 ряда: 5 + 5
  const categories = [
    // Ряд 1
    { image: categoryNovostrojki, title: 'Новостройки' },
    { image: categoryVtorichnaya, title: 'Вторичная' },
    { image: categoryArenda, title: 'Аренда' },
    { image: categoryDoma, title: 'Дома' },
    { image: categoryUchastki, title: 'Участки' },
    // Ряд 2
    { image: categoryIpoteka, title: 'Ипотека' },
    { image: categoryKvartiry, title: 'Квартиры' },
    { image: categoryParkingi, title: 'Паркинги' },
    { image: categoryKommercheskaya, title: 'Коммерческая' },
    { image: categoryPodobrat, title: 'Подобрать' }
  ]

  const filterTabs = ['Квартиры', 'Паркинги', 'Дома', 'Участки', 'Коммерция']

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
    <section className="w-full bg-white pt-4 pb-6 lg:pt-6 lg:pb-8">
      <div className="max-w-container mx-auto px-4">
        
        {/* Заголовок — компактный, центрированный */}
        <h1 className="text-center text-dark text-2xl lg:text-4xl font-rubik font-semibold mb-3 lg:mb-4 leading-tight">
          <span className="text-primary">Live Grid.</span>{' '}
          <span className="font-normal">Более 100 000 объектов по России</span>
        </h1>

        {/* Геолокация — кликабельная */}
        <button
          onClick={() => setIsRegionModalOpen(true)}
          className="flex items-center gap-2 mx-auto mb-4 hover:text-primary transition-colors cursor-pointer group"
        >
          <img src={locationIcon} alt="" className="w-4 h-4 opacity-60 group-hover:opacity-100" />
          <span className="text-dark text-sm font-rubik group-hover:text-primary transition-colors">
            {selectedRegion}
          </span>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="opacity-50 group-hover:opacity-100 transition-opacity">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Модальное окно региона */}
        <RegionModal
          isOpen={isRegionModalOpen}
          onClose={() => setIsRegionModalOpen(false)}
          currentRegion={selectedRegion}
          onSelectRegion={handleSelectRegion}
        />

        {/* Строка поиска + CTA */}
        <div className="relative mb-4" ref={filterRef}>
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
            {/* Поле поиска */}
            <Input
              size="md"
              placeholder="Поиск по адресу, ЖК или застройщику..."
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
                  ariaLabel="Фильтры"
                  className={isFilterOpen ? 'ring-2 ring-primary ring-offset-1' : ''}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M3 5h14M5 10h10M7 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  }
                />
              }
            />

            {/* CTA кнопка */}
            <Button 
              variant="primary" 
              size="md"
              className="w-full lg:w-auto flex-shrink-0 lg:min-w-[200px]"
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

        {/* Табы фильтров — унифицированные */}
        <TabGroup className="mb-4 justify-center">
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

        {/* Сетка категорий: 5 колонок на desktop, 2 на mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-3">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              image={category.image}
              title={category.title}
              onClick={() => handleCategoryClick(category)}
              className="aspect-[4/3] lg:aspect-[1/1]"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SearchSection
