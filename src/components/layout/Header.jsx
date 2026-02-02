import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button, IconButton } from '../ui'
import logo from '../../assets/images/logo-98ba9f.png'
import heartIcon from '../../assets/icons/heart-icon.svg'
import dropdownIcon from '../../assets/icons/dropdown-icon.svg'
import locationIcon from '../../assets/icons/location-icon.svg'

// Иконки для dropdown
const IconBuilding = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 text-primary">
    <path d="M4 20V8l8-4 8 4v12H4zm2-2h2v-4h4v4h2v-6h-4v-4H8v4H6v6z" fill="currentColor"/>
  </svg>
)
const IconApartment = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 text-primary">
    <path d="M12 3L4 9v12h6v-6h4v6h6V9l-8-6zm-2 8H8v2h2v-2zm4 0h-2v2h2v-2zm2 4h-2v2h2v-2zm-8 0H6v2h2v-2z" fill="currentColor"/>
  </svg>
)
const IconHouse = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 text-primary">
    <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" fill="currentColor"/>
  </svg>
)
const IconCommercial = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 text-primary">
    <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z" fill="currentColor"/>
  </svg>
)
const IconPlot = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 text-primary">
    <path d="M4 4h4v4H4V4zm0 6h4v4H4v-4zm0 6h4v4H4v-4zm6-12h4v4h-4V4zm0 6h4v4h-4v-4zm0 6h4v4h-4v-4zm6-12h4v4h-4V4zm0 6h4v4h-4v-4zm0 6h4v4h-4v-4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
)

const DROPDOWN_COLUMNS = [
  { title: 'Жилищные комплексы', Icon: IconBuilding, items: ['ЖК Смородина', 'ЖК Черкизово', 'ЖК Солнечный', 'Другие'] },
  { title: 'Квартиры', Icon: IconApartment, items: ['Студия', '1-комнатная', '2-комнатная', '3-комнатная', '4+'] },
  { title: 'Дома', Icon: IconHouse, items: ['До 7 млн', 'до 80 м²', 'до 120 м²', 'Коттеджи', 'Другие'] },
  { title: 'Коммерческая', Icon: IconCommercial, items: ['До 50 м²', 'до 100 м²', 'Офисы', 'Большие площади'] },
  { title: 'Участки', Icon: IconPlot, items: ['Под ИЖС', 'в СНТ', 'До 4 соток', 'Другие'] },
]

const NAV_ITEMS = [
  { label: 'Новостройки', href: '/catalog?category=novostroyki' },
  { label: 'Вторичная', href: '/catalog?category=vtorichnaya' },
  { label: 'Аренда', href: '/catalog?category=arenda' },
  { label: 'Дома', href: '/catalog?category=doma' },
  { label: 'Коммерческая', href: '/catalog?category=commercial' },
  { label: 'Участки', href: '/catalog?category=uchastki' },
  { label: 'Ипотека', href: '/ipoteka' },
]

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false)
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) setIsMobileMenuOpen(false)
    }
    if (isDropdownOpen || isMobileMenuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen, isMobileMenuOpen])

  return (
    <header className="w-full bg-white border-b border-gray-light/40 sticky top-0 z-50">
      <div className="max-w-container mx-auto px-4">
        <div className="flex items-center h-[72px] lg:h-[80px]">
          
          {/* Левый блок: Логотип */}
          <Link to="/" className="flex-shrink-0 mr-4 lg:mr-6">
            <img 
              src={logo} 
              alt="Live Grid" 
              className="h-10 lg:h-11 w-auto object-contain"
            />
          </Link>

          {/* Кнопка «Все объекты» — отступ от логотипа */}
          <div className="relative hidden lg:block" ref={dropdownRef}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsDropdownOpen((v) => !v)}
              icon={
                <svg 
                  className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 12 12" 
                  fill="none"
                >
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              iconPosition="right"
            >
              Все объекты
            </Button>

            {/* Dropdown панель */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-[800px] bg-white rounded-lg shadow-xl border border-gray-light/40 overflow-hidden animate-scaleIn z-50">
                {/* Верхняя строка */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-light/40">
                  <div className="flex items-center gap-2">
                    <img src={locationIcon} alt="" className="w-4 h-4 opacity-60" />
                    <span className="text-dark text-sm font-rubik">Москва и МО</span>
                  </div>
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 text-gray-medium hover:text-dark text-sm font-rubik transition-colors"
                  >
                    Закрыть
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                {/* Колонки категорий */}
                <div className="grid grid-cols-5 gap-4 p-5">
                  {DROPDOWN_COLUMNS.map((col, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <col.Icon />
                        <h4 className="text-dark text-sm font-rubik font-semibold">{col.title}</h4>
                      </div>
                      <ul className="space-y-1">
                        {col.items.map((item, j) => (
                          <li key={j}>
                            <Link
                              to="/catalog"
                              className="text-dark/80 text-sm font-rubik hover:text-primary transition-colors block py-0.5"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Нижний блок */}
                <div className="flex items-center justify-between gap-4 px-5 py-4 bg-gray-50 border-t border-gray-light/40">
                  <p className="text-dark text-sm font-rubik">
                    Не нашли объект? <span className="font-semibold">Заполните анкету</span>
                  </p>
                  <Button variant="primary" size="sm" onClick={() => setIsDropdownOpen(false)}>
                    Подобрать
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Центральная навигация */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center ml-6">
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="px-3 py-2 text-dark text-sm font-rubik font-normal hover:text-primary transition-colors rounded-md hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Правый блок: Избранное + Войти */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Desktop: Избранное */}
            <Link to="/favorites" className="hidden lg:block">
              <IconButton 
                variant="ghost"
                size="md"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
                ariaLabel="Избранное"
              />
            </Link>

            {/* Desktop: Войти */}
            <Button variant="primary" size="sm" className="hidden lg:flex">
              Войти
            </Button>

            {/* Mobile: Избранное */}
            <Link to="/favorites" className="lg:hidden">
              <IconButton 
                variant="ghost"
                size="md"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
                ariaLabel="Избранное"
              />
            </Link>

            {/* Бургер меню */}
            <button 
              className="lg:hidden flex flex-col gap-1 w-8 h-8 items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Меню"
            >
              <span className={`block w-5 h-0.5 bg-dark transition-all duration-200 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-5 h-0.5 bg-dark transition-all duration-200 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-dark transition-all duration-200 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-light/40 shadow-lg z-40 animate-slideUp"
        >
          <div className="max-w-container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-1 mb-4">
              {NAV_ITEMS.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="text-dark text-base font-rubik py-3 px-4 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-light/40">
              <Button variant="primary" size="md" fullWidth>
                Все объекты
              </Button>
              <Button variant="secondary" size="md" fullWidth>
                Войти
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
