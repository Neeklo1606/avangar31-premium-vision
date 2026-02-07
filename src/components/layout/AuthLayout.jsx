import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import logo from '../../assets/images/logo-98ba9f.png'

/**
 * Layout для страниц авторизации — центрированная карточка, логотип, без Header/Footer
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Верхняя панель с логотипом */}
      <header className="w-full bg-white border-b border-gray-light/40 py-4 px-4">
        <div className="max-w-container mx-auto flex justify-center sm:justify-start">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Live Grid" className="h-9 sm:h-10 w-auto object-contain" />
          </Link>
        </div>
      </header>

      {/* Контент — центрированная форма */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <Outlet />
      </main>

      {/* Футер с ссылкой на главную */}
      <footer className="py-4 text-center">
        <Link to="/" className="text-gray-medium text-sm font-rubik hover:text-primary transition-colors">
          Вернуться на главную
        </Link>
      </footer>
    </div>
  )
}

export default AuthLayout
