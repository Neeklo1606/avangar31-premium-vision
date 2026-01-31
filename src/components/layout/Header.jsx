import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button, IconButton } from '../ui'
import logo from '../../assets/images/logo-98ba9f.png'
import heartIcon from '../../assets/icons/heart-icon.svg'
import dropdownIcon from '../../assets/icons/dropdown-icon.svg'
import locationIcon from '../../assets/icons/location-icon.svg'

// Иконки колонок меню «Все объекты» (Figma 64-1135)
const IconBuilding = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-primary"><path d="M4 20V8l8-4 8 4v12H4zm2-2h2v-4h4v4h2v-6h-4v-4H8v4H6v6z" fill="currentColor"/></svg>
const IconApartment = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-primary"><path d="M12 3L4 9v12h6v-6h4v6h6V9l-8-6zm-2 8H8v2h2v-2zm4 0h-2v2h2v-2zm2 4h-2v2h2v-2zm-8 0H6v2h2v-2z" fill="currentColor"/></svg>
const IconHouse = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-primary"><path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" fill="currentColor"/></svg>
const IconCommercial = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-primary"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z" fill="currentColor"/></svg>
const IconPlot = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-primary"><path d="M4 4h4v4H4V4zm0 6h4v4H4v-4zm0 6h4v4H4v-4zm6-12h4v4h-4V4zm0 6h4v4h-4v-4zm0 6h4v4h-4v-4zm6-12h4v4h-4V4zm0 6h4v4h-4v-4zm0 6h4v4h-4v-4z" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>

const DROPDOWN_COLUMNS = [
  { title: 'Жилищные комплексы', Icon: IconBuilding, items: ['ЖК Смородина', 'ЖК Черкизово', 'ЖК Солнечный', 'Другие'] },
  { title: 'Квартиры', Icon: IconApartment, items: ['Студия', '1-комнатная', '2-комнатная', '3-комнатная', '4-комнатная', 'Более 100 м.кв.', 'Более 150 м.кв.', 'Пентхаусы', 'Другие'] },
  { title: 'Дома', Icon: IconHouse, items: ['До 7 млн', 'до 80 м.кв.', 'до 120 м.кв.', 'до 150 м.кв.', 'до 200 м.кв.', 'Особняки', 'Коттеджи', 'Другие'] },
  { title: 'Коммерческая', Icon: IconCommercial, items: ['Отдельно стоящие', 'В торговом центре', 'До 50 м.кв.', 'до 100 м.кв.', 'Под офисы', 'В комплексах', 'Большие площади', 'Другие'] },
  { title: 'Участки', Icon: IconPlot, items: ['Под ИЖС', 'в СНТ', 'Под коммерцию', 'До 4 соток', 'С коммуникациями', 'С постройками', 'Более 1 га', 'Другие'] },
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

  const navItems = [
    'Новостройки',
    'Вторичная',
    'Аренда',
    'Дома',
    'Коммерческая',
    'Участки',
    'Ипотека'
  ]

  return (
    <header className="w-full bg-white border-b border-gray-light/30 relative">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-[80px] gap-4">
          {/* Левый блок: Логотип + "Все объекты" */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/">
              <img 
                src={logo} 
                alt="Live Grid" 
                className="h-[45px] lg:h-[50px] w-auto object-contain cursor-pointer"
              />
            </Link>
            {/* Кнопка "Все объекты" СРАЗУ после логотипа (требование п.1.1) */}
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsDropdownOpen((v) => !v)}
                icon={
                  <img
                    src={dropdownIcon}
                    alt=""
                    className={`w-3 h-3 brightness-0 invert transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                }
                iconPosition="right"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-controls="header-all-objects-dropdown"
                id="header-all-objects-button"
              >
                Все объекты
              </Button>

              {/* Dropdown — панель по макету Figma 64-1135 */}
              {isDropdownOpen && (
                <div
                  id="header-all-objects-dropdown"
                  role="dialog"
                  aria-labelledby="header-all-objects-button"
                  className="absolute top-full right-0 mt-2 w-[min(95vw,880px)] bg-white rounded-[12px] shadow-2xl border border-gray-light/30 overflow-hidden z-[100]"
                >
                  {/* Верхняя строка: локация слева, Закрыть + крестик справа */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-light/30">
                    <div className="flex items-center gap-2">
                      <img src={locationIcon} alt="" className="w-5 h-5" />
                      <span className="text-[#1E1E1E] text-[15px] font-rubik font-normal">Москва и МО</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#8E8E8E] text-[14px] font-rubik font-normal">Закрыть</span>
                      <IconButton
                        variant="primary"
                        size="md"
                        onClick={() => setIsDropdownOpen(false)}
                        ariaLabel="Закрыть"
                        icon={
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        }
                      />
                    </div>
                  </div>

                  {/* Пять колонок категорий с иконками и списками */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-5">
                    {DROPDOWN_COLUMNS.map((col, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <col.Icon />
                          <h4 className="text-[#1E1E1E] text-[14px] font-rubik font-bold">{col.title}</h4>
                        </div>
                        <ul className="space-y-1">
                          {col.items.map((item, j) => (
                            <li key={j}>
                              <Link
                                to="/catalog"
                                className="text-[#1E1E1E] text-[13px] font-rubik font-normal hover:text-primary transition-colors block py-0.5"
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

                  {/* Нижний блок: текст, кнопка «Подобрать», иллюстрация */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-5 bg-[#F5F6FC] rounded-b-[12px]">
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-[#1E1E1E] text-[14px] lg:text-[15px] font-rubik font-bold mb-3">
                        Не нашли объект, который искали? Заполните анкету для индивидуального подбора
                      </p>
                      <Link
                        to="/#help"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Button variant="primary" size="md">
                          Подобрать
                        </Button>
                      </Link>
                    </div>
                    <div className="w-32 h-20 rounded-[8px] bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary/60 text-[11px] font-rubik">Иллюстрация</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Центральное меню (требование п.1.2) */}
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {navItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-dark text-[14px] font-rubik font-normal hover:text-primary transition-colors whitespace-nowrap"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Правый блок: Избранное + Войти (требование п.1.3) */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Иконка избранного (сердце) - ОБЯЗАТЕЛЬНА по п.1.3 */}
            <Link to="/favorites" className="hidden lg:block">
              <IconButton 
                variant="ghost"
                size="md"
                icon={<img src={heartIcon} alt="" className="w-5 h-5" />}
                ariaLabel="Избранное"
                className="hover:bg-gray-light/20"
              />
            </Link>

            {/* Кнопка "Войти" */}
            <Button variant="secondary" size="md" className="hidden lg:flex">
              Войти
            </Button>

            {/* Мобильные элементы */}
            <Link to="/favorites" className="lg:hidden">
              <IconButton 
                variant="ghost"
                size="md"
                icon={<img src={heartIcon} alt="" className="w-5 h-5" />}
                ariaLabel="Избранное"
              />
            </Link>

            {/* Бургер меню - с функционалом (требование п.7.1, пункт 24) */}
            <button 
              className="lg:hidden flex flex-col gap-1.5 w-6 h-6 justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Меню"
            >
              <span className={`block w-full h-0.5 bg-dark transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-full h-0.5 bg-dark transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-full h-0.5 bg-dark transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню (требование п.7.1) */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-light/30 shadow-xl z-50"
        >
          <div className="max-w-[1200px] mx-auto px-4 py-4">
            <nav className="flex flex-col gap-3 mb-4">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-dark text-[16px] font-rubik font-normal hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <Button 
                variant="primary" 
                size="md" 
                fullWidth
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen)
                  setIsMobileMenuOpen(false)
                }}
              >
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

