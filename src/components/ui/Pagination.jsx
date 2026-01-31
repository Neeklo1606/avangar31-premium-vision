import React from 'react'

const Pagination = ({ currentPage = 1, totalPages = 10, onPageChange }) => {
  const pages = []
  
  // Генерация списка страниц
  for (let i = 1; i <= Math.min(totalPages, 7); i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      {/* Кнопка "Назад" */}
      <button
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg border-2 border-gray-light text-dark font-rubik font-medium hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ←
      </button>

      {/* Номера страниц */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange?.(page)}
          className={`min-w-[40px] h-[40px] rounded-lg font-rubik font-medium transition-all ${
            page === currentPage
              ? 'bg-primary text-white shadow-md'
              : 'border-2 border-gray-light text-dark hover:border-primary hover:text-primary'
          }`}
        >
          {page}
        </button>
      ))}

      {/* ... если страниц больше */}
      {totalPages > 7 && (
        <>
          <span className="text-gray-medium">...</span>
          <button
            onClick={() => onPageChange?.(totalPages)}
            className="min-w-[40px] h-[40px] rounded-lg border-2 border-gray-light text-dark font-rubik font-medium hover:border-primary hover:text-primary transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Кнопка "Вперед" */}
      <button
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg border-2 border-gray-light text-dark font-rubik font-medium hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        →
      </button>
    </div>
  )
}

export default Pagination
