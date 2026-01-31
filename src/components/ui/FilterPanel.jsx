import React, { useState } from 'react'
import Checkbox from './Checkbox'

const FilterPanel = () => {
  const [filters, setFilters] = useState({
    propertyTypes: {
      houses: false,
      newBuildings: false,
      secondary: false,
      commercial: false,
      rent: false
    },
    priceFrom: '',
    priceTo: '',
    city: 'Москва'
  })

  const propertyTypes = [
    { id: 'houses', label: 'Дома' },
    { id: 'newBuildings', label: 'Новостройки' },
    { id: 'secondary', label: 'Вторичная' },
    { id: 'commercial', label: 'Коммерческая' },
    { id: 'rent', label: 'Аренда' }
  ]

  const handleCheckboxChange = (id) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: {
        ...prev.propertyTypes,
        [id]: !prev.propertyTypes[id]
      }
    }))
  }

  return (
    <div className="bg-white rounded-[16px] p-6 shadow-lg border border-gray-light/30 sticky top-6">
      <h3 className="text-dark text-[20px] font-rubik font-bold mb-6">
        Фильтры
      </h3>

      {/* Тип недвижимости */}
      <div className="mb-6">
        <h4 className="text-dark text-[16px] font-rubik font-semibold mb-4">
          Тип недвижимости
        </h4>
        <div className="space-y-3">
          {propertyTypes.map((type) => (
            <Checkbox
              key={type.id}
              label={type.label}
              checked={filters.propertyTypes[type.id]}
              onChange={() => handleCheckboxChange(type.id)}
            />
          ))}
        </div>
      </div>

      {/* Вариант объекта */}
      <div className="mb-6">
        <h4 className="text-dark text-[16px] font-rubik font-semibold mb-4">
          Вариант объекта
        </h4>
        <select className="w-full px-4 py-3 bg-white border-2 border-gray-light rounded-[8px] text-[14px] font-rubik text-gray-medium focus:outline-none focus:border-primary transition-colors">
          <option value="">Выберите тип недвижимости</option>
          <option value="apartment">Квартира</option>
          <option value="house">Дом</option>
          <option value="land">Участок</option>
          <option value="commercial">Коммерческая</option>
        </select>
      </div>

      {/* Стоимость */}
      <div className="mb-6">
        <h4 className="text-dark text-[16px] font-rubik font-semibold mb-4">
          Стоимость
        </h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="от"
            value={filters.priceFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, priceFrom: e.target.value }))}
            className="w-full px-4 py-3 bg-white border-2 border-gray-light rounded-[8px] text-[14px] font-rubik placeholder:text-gray-medium focus:outline-none focus:border-primary transition-colors"
          />
          <input
            type="text"
            placeholder="до"
            value={filters.priceTo}
            onChange={(e) => setFilters(prev => ({ ...prev, priceTo: e.target.value }))}
            className="w-full px-4 py-3 bg-white border-2 border-gray-light rounded-[8px] text-[14px] font-rubik placeholder:text-gray-medium focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Кнопка применить */}
      <button className="w-full px-6 py-4 bg-primary text-white text-[16px] font-rubik font-semibold rounded-[8px] hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg">
        Показать объекты
      </button>

      {/* Кнопка сбросить */}
      <button className="w-full mt-3 px-6 py-3 bg-white border-2 border-gray-light text-dark text-[14px] font-rubik font-medium rounded-[8px] hover:border-primary hover:text-primary transition-colors">
        Сбросить фильтры
      </button>
    </div>
  )
}

export default FilterPanel
