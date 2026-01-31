import React from 'react'
import { Link } from 'react-router-dom'

// Блок «Свяжитесь с LiveGrid» — Figma node 98-2493
// Иконки соцсетей/связи (по макету, inline SVG — Figma API 429)
const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 4 3 4.24 3 4.99 3 13.28 10.73 21 19.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill="currentColor"/>
  </svg>
)
const TelegramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.69 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" fill="currentColor"/>
  </svg>
)
const VKIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.727-1.033-1-1.49-1.154-1.744-1.154-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z" fill="currentColor"/>
  </svg>
)
const YouTubeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/>
  </svg>
)

const SOCIAL_LINKS = [
  { href: 'tel:+79163330808', Icon: PhoneIcon, label: 'Позвонить' },
  { href: 'https://t.me/livegrid', Icon: TelegramIcon, label: 'Telegram' },
  { href: 'https://vk.com/livegrid', Icon: VKIcon, label: 'VK' },
  { href: 'https://youtube.com', Icon: YouTubeIcon, label: 'YouTube' },
]

const ContactSection = () => {
  return (
    <section className="w-full bg-white py-10 lg:py-16">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-[60px]">
        <h2 className="text-[#000000] text-[32px] lg:text-[44px] font-rubik font-bold mb-8 lg:mb-10">
          Свяжитесь с <span className="text-primary">LiveGrid</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Левая колонка: карточка контактов */}
          <div className="bg-[#F8F8F8] rounded-[16px] p-6 lg:p-8 flex flex-col">
            <div className="space-y-5 lg:space-y-6">
              <div>
                <p className="text-[#8E8E8E] text-[13px] font-rubik font-normal mb-1">Звоните, проконсультируем</p>
                <a href="tel:+79163330808" className="text-[#000000] text-[18px] lg:text-[20px] font-rubik font-bold hover:text-primary transition-colors">
                  +7 916 333 08 08
                </a>
              </div>
              <div>
                <p className="text-[#8E8E8E] text-[13px] font-rubik font-normal mb-1">Отдел продаж</p>
                <a href="tel:+79163330909" className="text-[#000000] text-[18px] lg:text-[20px] font-rubik font-bold hover:text-primary transition-colors">
                  +7 916 333 09 09
                </a>
              </div>
              <div>
                <p className="text-[#8E8E8E] text-[13px] font-rubik font-normal mb-1">Электронная почта</p>
                <a href="mailto:info@livegrid.ru" className="text-[#000000] text-[18px] lg:text-[20px] font-rubik font-bold hover:text-primary transition-colors">
                  info@livegrid.ru
                </a>
              </div>
              <div>
                <p className="text-[#8E8E8E] text-[13px] font-rubik font-normal mb-1">Режим работы</p>
                <p className="text-[#000000] text-[18px] lg:text-[20px] font-rubik font-bold">
                  Пн-Сб с 10:00 до 18:00
                </p>
              </div>
            </div>

            {/* Иконки соцсетей */}
            <div className="flex items-center gap-3 mt-6 lg:mt-8">
              {SOCIAL_LINKS.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
            </div>

            {/* Кнопка Войти / Зарегистрироваться */}
            <Link
              to="/#register"
              className="mt-6 lg:mt-8 w-full py-3.5 lg:py-4 bg-primary text-white text-center text-[16px] font-rubik font-semibold rounded-[12px] hover:bg-primary-dark transition-colors"
            >
              Войти / Зарегистрироваться
            </Link>
          </div>

          {/* Правая колонка: видео-плейсхолдер */}
          <div className="relative rounded-[16px] overflow-hidden bg-primary min-h-[280px] lg:min-h-[320px] flex items-center justify-center">
            <span className="text-white text-[24px] lg:text-[32px] font-rubik font-bold uppercase tracking-wider">
              Video
            </span>
            {/* Сюда можно встроить iframe с YouTube/Vimeo или тег video */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
