import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/ui/Breadcrumbs'

const PrivacyPage = () => {
  const breadcrumbItems = [
    { label: 'Главная', link: '/' },
    { label: 'Политика конфиденциальности' }
  ]

  return (
    <div className="w-full bg-white min-h-[50vh]">
      <div className="max-w-container mx-auto px-4 py-8 lg:py-12">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-dark text-2xl lg:text-3xl font-rubik font-bold mt-6 mb-6">
          Политика конфиденциальности
        </h1>
        <div className="text-gray-medium text-sm font-rubik leading-relaxed space-y-4 max-w-3xl">
          <p>
            ООО «ЛайвГрид» (далее — Оператор) осуществляет обработку персональных данных в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
          </p>
          <p>
            Настоящая политика определяет порядок обработки персональных данных и меры по обеспечению их безопасности.
          </p>
          <p>
            Обработка персональных данных осуществляется с согласия субъекта персональных данных. Согласие предоставляется путём проставления отметки в соответствующем поле формы заявки.
          </p>
          <p>
            Персональные данные используются исключительно для связи с пользователем по вопросам представленных запросов и не передаются третьим лицам без согласия субъекта.
          </p>
        </div>
        <Link to="/" className="inline-block mt-8 text-primary font-rubik font-medium hover:underline">
          ← Вернуться на главную
        </Link>
      </div>
    </div>
  )
}

export default PrivacyPage
