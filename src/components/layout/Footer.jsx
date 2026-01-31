import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo-98ba9f.png'

// Футер по макету Figma node 98-2520: светлый фон, 4 колонки, соцкнопки, инфоблок внизу

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-primary">
    <path d="M2 2h4v4H2V2zm0 6h4v4H2V8zm6-6h4v4H8V2zm0 6h4v4H8V8z" fill="currentColor" />
  </svg>
)
const FlagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-primary">
    <path d="M3 2v12M3 2h10l-2 4 2 4H3M3 2l2 4-2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)
const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-primary">
    <path d="M14 7c0 3.3-2.7 6-6 6H3l-2 2V7C1 3.7 3.7 1 7 1s6 2.7 6 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 4 3 4.24 3 4.99 3 13.28 10.73 21 19.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill="currentColor"/></svg>
)
const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.69 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" fill="currentColor"/></svg>
)
const VKIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.727-1.033-1-1.49-1.154-1.744-1.154-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z" fill="currentColor"/></svg>
)
const YouTubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/></svg>
)

const SOCIAL = [
  { href: 'tel:+79163330808', Icon: PhoneIcon, label: 'Позвонить' },
  { href: 'https://t.me/livegrid', Icon: TelegramIcon, label: 'Telegram' },
  { href: 'https://vk.com/livegrid', Icon: VKIcon, label: 'VK' },
  { href: 'https://youtube.com', Icon: YouTubeIcon, label: 'YouTube' },
]

const NAV_LINKS = ['Новостройки', 'Вторичная', 'Аренда', 'Дома', 'Коммерческая', 'Участки']

const POPULAR_LINKS = [
  { label: 'Подобрать объект', to: '/#help' },
  { label: 'Ипотека', to: '/#mortgage' },
  { label: 'Новые объявления', to: '/catalog?new=1' },
  { label: 'Горящие предложения', to: '/catalog?hot=1' },
  { label: 'Каталог ЖК в Москве', to: '/catalog/new-buildings' },
  { label: 'Каталог ЖК по России', to: '/catalog' },
  { label: 'Старт продаж', to: '/catalog?launch=1' },
]

const Footer = () => {
  return (
    <footer className="w-full bg-[#F8F9FB] text-[#1E1E1E]">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-[60px] py-10 lg:py-14">
        {/* Четыре колонки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10 lg:mb-12">
          {/* Колонка 1: Бренд + юридические ссылки */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link to="/" className="inline-block">
              <img src={logo} alt="Live Grid" className="h-[44px] lg:h-[50px] w-auto object-contain" />
            </Link>
            <p className="text-[#1E1E1E] text-[16px] font-rubik font-bold uppercase tracking-wide">
              LIVE GRID
            </p>
            <p className="text-[#5a5a5a] text-[14px] font-rubik font-normal leading-relaxed">
              LiveGrid 2015–2026
            </p>
            <p className="text-[#5a5a5a] text-[14px] font-rubik font-normal leading-relaxed">
              Площадка недвижимости
            </p>
            <div className="pt-2 space-y-2">
              <a href="#" className="block text-[#1E1E1E] text-[14px] font-rubik font-normal hover:text-primary transition-colors underline">
                Политика конфиденциальности
              </a>
              <a href="#" className="block text-[#1E1E1E] text-[14px] font-rubik font-normal hover:text-primary transition-colors underline">
                Обработка персональных данных
              </a>
            </div>
          </div>

          {/* Колонка 2: Навигация */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-[#1E1E1E] text-[14px] lg:text-[16px] font-rubik font-bold uppercase tracking-wide">
              <GridIcon /> Навигация
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((item, i) => (
                <li key={i}>
                  <Link to="#" className="text-[#5a5a5a] text-[14px] font-rubik font-normal hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Колонка 3: Популярное */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-[#1E1E1E] text-[14px] lg:text-[16px] font-rubik font-bold uppercase tracking-wide">
              <FlagIcon /> Популярное
            </h3>
            <ul className="space-y-2.5">
              {POPULAR_LINKS.map((item, i) => (
                <li key={i}>
                  <Link to={item.to} className="text-[#5a5a5a] text-[14px] font-rubik font-normal hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Колонка 4: Контакты + соцкнопки */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-[#1E1E1E] text-[14px] lg:text-[16px] font-rubik font-bold uppercase tracking-wide">
              <ChatIcon /> Контакты
            </h3>
            <div className="text-[#5a5a5a] text-[14px] font-rubik font-normal space-y-2 leading-relaxed">
              <p><a href="tel:+79163330808" className="hover:text-primary transition-colors">+7 916 333 08 08</a></p>
              <p>г. Москва, ул. Ленинградский проспект 68, к.1, офис 312</p>
              <p>Пн-Сб с 10:00 до 18:00</p>
              <p><a href="mailto:info@livegrid.ru" className="hover:text-primary transition-colors">info@livegrid.ru</a></p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              {SOCIAL.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white border border-[#DFDFDF] text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Нижний информационный блок с ссылками */}
        <div className="border-t border-[#E5E7EB] pt-6 lg:pt-8">
          <p className="text-[#8E8E8E] text-[12px] lg:text-[13px] font-rubik font-normal leading-relaxed max-w-[900px]">
            LiveGrid — база объявлений по недвижимости в России. Используя сервис, вы соглашаетесь с{' '}
            <a href="#" className="text-[#1E1E1E] underline hover:text-primary transition-colors">Пользовательским соглашением</a>
            {' '}и{' '}
            <a href="#" className="text-[#1E1E1E] underline hover:text-primary transition-colors">Политикой конфиденциальности</a>
            , а также с условиями{' '}
            <a href="#" className="text-[#1E1E1E] underline hover:text-primary transition-colors">Лицензионного соглашения</a>
            . ООО «ЛайвГрид». Поддержка:{' '}
            <a href="mailto:support@livegrid.ru" className="text-[#1E1E1E] underline hover:text-primary transition-colors">support@livegrid.ru</a>
            . На информационном ресурсе применяются рекомендательные технологии.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
