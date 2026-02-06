import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Button, Input, Checkbox } from '../components/ui'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import PropertyCard from '../components/ui/PropertyCard'
import propertyCard1 from '../assets/images/property-card-1.svg'
import propertyCard2 from '../assets/images/property-card-2.svg'
import propertyCard3 from '../assets/images/property-card-3.svg'

const PRIVACY_LINK = '/privacy'

const PropertyDetailPage = () => {
  const { id } = useParams()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!consent || submitting) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      setName('')
      setPhone('')
      setConsent(false)
    }, 800)
  }

  const breadcrumbItems = [
    { label: 'Главная', link: '/' },
    { label: 'Каталог', link: '/catalog' },
    { label: 'Дом 125 м.кв.' }
  ]

  const characteristics = [
    { label: 'Площадь', value: '125 м²' },
    { label: 'Комнат', value: '3' },
    { label: 'Этаж', value: '2 из 2' },
    { label: 'Тип дома', value: 'Кирпичный' },
    { label: 'Год постройки', value: '2024' },
    { label: 'Ремонт', value: 'Чистовая отделка' }
  ]

  const similarProperties = [
    {
      image: propertyCard2,
      title: 'Дом 125 м.кв. 3 комнаты',
      price: '15 600 000',
      location: 'Москва, Кантемировская',
      tags: ['Ипотека 6%']
    },
    {
      image: propertyCard3,
      title: 'Дом 130 м.кв. 3 комнаты',
      price: '16 200 000',
      location: 'Москва, Царицыно',
      tags: ['Распродажа']
    }
  ]

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-[60px] py-6 lg:py-10">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Левая часть - Галерея */}
          <div className="lg:col-span-2">
            <div className="rounded-[20px] overflow-hidden shadow-xl mb-6">
              <img
                src={propertyCard1}
                alt="Дом"
                className="w-full h-[400px] lg:h-[600px] object-cover"
              />
            </div>

            {/* Описание */}
            <div className="space-y-6">
              <h2 className="text-dark text-[28px] font-rubik font-bold">
                Описание
              </h2>
              <p className="text-dark text-[16px] font-rubik font-normal leading-relaxed">
                Продается прекрасный дом площадью 125 кв.м. в престижном районе Москвы. 
                Дом построен из качественных материалов, имеет современную планировку и все необходимые коммуникации.
                На участке есть место для парковки, зона отдыха и сад.
              </p>

              {/* Характеристики */}
              <div>
                <h3 className="text-dark text-[24px] font-rubik font-bold mb-4">
                  Характеристики
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {characteristics.map((char, index) => (
                    <div key={index} className="flex justify-between py-3 border-b border-gray-light">
                      <span className="text-gray-medium text-[15px] font-rubik font-normal">
                        {char.label}
                      </span>
                      <span className="text-dark text-[15px] font-rubik font-semibold">
                        {char.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Правая часть - Информация */}
          <div className="space-y-6">
            {/* Цена */}
            <div className="bg-gray-50 rounded-[16px] p-6 border border-gray-light/30">
              <p className="text-gray-medium text-[14px] font-rubik font-normal mb-2">
                Цена
              </p>
              <p className="text-primary text-[36px] font-rubik font-bold mb-4">
                15 600 000 ₽
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-4 py-2 bg-white border-2 border-primary text-primary text-[11px] font-rubik font-semibold rounded-full">
                  Распродажа
                </span>
                <span className="px-4 py-2 bg-white border-2 border-primary text-primary text-[11px] font-rubik font-semibold rounded-full">
                  Ипотека 6%
                </span>
              </div>
            </div>

            {/* Адрес */}
            <div className="bg-gray-50 rounded-[16px] p-6 border border-gray-light/30">
              <p className="text-gray-medium text-[14px] font-rubik font-normal mb-2">
                Адрес
              </p>
              <p className="text-dark text-[16px] font-rubik font-medium">
                Москва, Кантемировская
              </p>
            </div>

            {/* Форма связи */}
            <div className="bg-primary rounded-[16px] p-6 shadow-xl">
              <h3 className="text-white text-[20px] font-rubik font-bold mb-4">
                Заинтересовал объект?
              </h3>
              {submitted ? (
                <p className="text-white text-sm font-rubik">
                  Заявка отправлена. Мы свяжемся с вами в ближайшее время.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    size="md"
                    className="focus:ring-2 focus:ring-white/50 border-white/30 bg-white/10 text-white placeholder:text-white/70"
                  />
                  <Input
                    type="tel"
                    placeholder="Телефон"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    size="md"
                    className="focus:ring-2 focus:ring-white/50 border-white/30 bg-white/10 text-white placeholder:text-white/70"
                  />
                  <div className="py-2 text-white text-sm [&_a]:text-white/95 [&_a:hover]:text-white [&_a]:underline">
                    <Checkbox
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="[&>span]:!text-white"
                      label={
                        <>
                          Я согласен на{' '}
                          <Link to={PRIVACY_LINK} target="_blank" rel="noopener noreferrer">
                            обработку персональных данных
                          </Link>
                          {' '}в соответствии с{' '}
                          <Link to={PRIVACY_LINK} target="_blank" rel="noopener noreferrer">
                            политикой конфиденциальности
                          </Link>
                        </>
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    fullWidth
                    disabled={!consent || submitting}
                    className="bg-white text-primary hover:bg-gray-50 hover:text-primary border-white disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  >
                    {submitting ? 'Отправка…' : 'Отправить заявку'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Похожие предложения */}
        <div className="pt-10 border-t border-gray-light">
          <h2 className="text-dark text-[32px] font-rubik font-bold mb-8">
            Похожие предложения
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((property, index) => (
              <PropertyCard
                key={index}
                image={property.image}
                title={property.title}
                price={property.price}
                location={property.location}
                tags={property.tags}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailPage
