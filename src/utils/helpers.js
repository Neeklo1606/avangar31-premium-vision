// Утилиты для форматирования

/**
 * Форматирование цены с пробелами
 * @param {number|string} price - Цена
 * @returns {string} Отформатированная цена
 */
export const formatPrice = (price) => {
  const numPrice = typeof price === 'string' ? parseInt(price.replace(/\s/g, '')) : price
  return numPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/**
 * Склонение существительных
 * @param {number} count - Количество
 * @param {Array<string>} forms - Формы слова [1, 2, 5]
 * @returns {string} Правильная форма
 */
export const declension = (count, forms) => {
  const cases = [2, 0, 1, 1, 1, 2]
  return forms[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[Math.min(count % 10, 5)]]
}

/**
 * Сокращение больших чисел
 * @param {number} num - Число
 * @returns {string} Сокращенное число
 */
export const abbreviateNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

/**
 * Проверка на мобильное устройство
 * @returns {boolean}
 */
export const isMobile = () => {
  return window.innerWidth < 768
}

/**
 * Debounce функция
 * @param {Function} func - Функция для debounce
 * @param {number} wait - Время ожидания в мс
 * @returns {Function}
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
