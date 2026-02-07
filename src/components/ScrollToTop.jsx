import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Скроллит страницу в начало при каждой смене маршрута.
 * Обеспечивает попадание пользователя в начало страницы при переходе.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
