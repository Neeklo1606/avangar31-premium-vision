import React, { useState } from 'react'
import { Link } from 'react-router-dom'

// Секция «Подберем объект под Ваш запрос» — Figma node 98-2562
// Карточка: слева квиз (вопрос + сетка выбора + прогресс + кнопки), справа синяя панель

const PROPERTY_TYPES = [
  { value: 'house', label: 'Частный дом', image: '/images/category-doma-5ad35e.png' },
  { value: 'apartment', label: 'Квартира', image: '/images/category-kvartiry-39bb54.png' },
  { value: 'plot', label: 'Участок', image: '/images/category-uchastki-60208a.png' },
  { value: 'parking', label: 'Паркинг', image: '/images/category-parkingi.png' },
  { value: 'commercial', label: 'Коммерческая', image: '/images/category-kommercheskaya-26238f.png' },
  { value: 'other', label: 'Другое', image: '/images/category-podobrat.png' },
]

const QUIZ_STEPS = [
  { id: 'type', question: 'Какой тип недвижимости рассматриваете?', options: PROPERTY_TYPES },
  { id: 'rooms', question: 'Количество комнат', options: [{ value: 'studio', label: 'Студия' }, { value: '1', label: '1 комната' }, { value: '2', label: '2 комнаты' }, { value: '3', label: '3 и более' }] },
  { id: 'budget', question: 'Бюджет', options: [{ value: 'low', label: 'До 5 млн ₽' }, { value: 'mid', label: '5–10 млн ₽' }, { value: 'high', label: '10–20 млн ₽' }, { value: 'premium', label: 'От 20 млн ₽' }] },
  { id: 'district', question: 'Предпочтительный район', options: [{ value: 'center', label: 'Центр' }, { value: 'north', label: 'Север' }, { value: 'south', label: 'Юг' }, { value: 'any', label: 'Любой' }] },
  { id: 'finish', question: 'Готово', options: [] },
]

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ClockIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M24 14v10l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const QuizSection = () => {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  const currentStep = QUIZ_STEPS[step]
  const totalSteps = QUIZ_STEPS.length
  const isFirstStep = step === 0
  const isLastStep = step === totalSteps - 1
  const isTypeStep = currentStep?.id === 'type'

  const handleSelect = (stepId, value) => {
    setAnswers((prev) => ({ ...prev, [stepId]: value }))
    if (!isLastStep) setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1)
  }

  const handleNext = () => {
    if (!isLastStep) setStep((prev) => prev + 1)
  }

  const selectedType = answers.type
  const hasSelection = isTypeStep ? !!selectedType : !!answers[currentStep?.id]

  return (
    <section className="w-full bg-[#F8F9FB] py-10 lg:py-16">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-[60px]">
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white shadow-sm flex flex-col lg:flex-row">
          {/* Левая часть — квиз (белая карточка): скругление по макету */}
          <div className="flex-1 p-6 lg:p-8 lg:min-w-0 rounded-[20px] lg:rounded-l-[20px] lg:rounded-tr-none lg:rounded-br-none">
            <h2 className="text-[#1E1E1E] text-[22px] lg:text-[26px] font-rubik font-bold mb-1">
              Подберем объект под Ваш запрос
            </h2>
            <p className="text-[#8E8E8E] text-[14px] lg:text-[15px] font-rubik font-normal mb-6">
              {currentStep?.question}
            </p>

            {isTypeStep ? (
              /* Шаг 1: сетка 2x3 карточек типов недвижимости */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4 mb-6">
                {PROPERTY_TYPES.map((opt) => {
                  const isSelected = selectedType === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect('type', opt.value)}
                      className={`relative rounded-[12px] border-2 p-4 flex flex-col items-center justify-end min-h-[120px] lg:min-h-[140px] text-left transition-colors ${
                        isSelected
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white border-[#E5E7EB] text-[#1E1E1E] hover:border-primary/50'
                      }`}
                    >
                      <div className="w-full flex-1 flex items-center justify-center mb-2">
                        <img
                          src={opt.image}
                          alt=""
                          className="max-h-[64px] lg:max-h-[80px] w-auto object-contain"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      </div>
                      <div className="w-full flex items-center justify-between gap-2">
                        <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/90 text-primary' : 'border-2 border-[#8E8E8E]'
                        }`}>
                          {isSelected ? <CheckIcon /> : null}
                        </div>
                        <span className="text-[13px] lg:text-[14px] font-rubik font-semibold truncate">
                          {opt.label}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : !isLastStep ? (
              /* Остальные шаги — кнопки-варианты */
              <div className="flex flex-wrap gap-3 mb-6">
                {currentStep?.options?.map((opt) => {
                  const isSelected = answers[currentStep.id] === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(currentStep.id, opt.value)}
                      className={`px-5 py-3 rounded-[10px] text-[14px] font-rubik font-medium transition-colors ${
                        isSelected ? 'bg-primary text-white' : 'bg-[#F5F6FC] text-[#1E1E1E] hover:bg-primary/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-[#8E8E8E] text-[14px] font-rubik font-normal mb-4">
                  Ваши ответы сохранены. Нажмите «Следующий», чтобы перейти к подборке.
                </p>
                <Link
                  to="/catalog"
                  className="inline-block px-5 py-3 bg-primary text-white text-[14px] font-rubik font-semibold rounded-[10px] hover:bg-primary-dark transition-colors"
                >
                  Смотреть подборку
                </Link>
              </div>
            )}

            {/* Прогресс — горизонтальные чёрточки (5 шагов) */}
            <div className="flex items-center gap-1.5 mb-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={`inline-block h-1 rounded-full transition-all ${
                    i === step ? 'w-6 bg-primary' : 'w-6 bg-[#E5E7EB]'
                  }`}
                  aria-hidden
                />
              ))}
            </div>

            {/* Кнопки Назад / Следующий */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={isFirstStep}
                className="px-5 py-2.5 rounded-[10px] text-[14px] font-rubik font-medium bg-[#E5E7EB] text-[#5a5a5a] disabled:opacity-50 hover:enabled:bg-[#DFDFDF] transition-colors"
              >
                Назад
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={isLastStep}
                className="px-5 py-2.5 rounded-[10px] text-[14px] font-rubik font-semibold bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                Следующий
              </button>
            </div>
          </div>

          {/* Правая часть — синяя панель: закругление всех углов по макету Figma 98-2562 */}
          <div className="w-full lg:w-[280px] xl:w-[320px] bg-primary flex-shrink-0 p-6 lg:p-8 flex flex-col items-center justify-center text-center rounded-[20px] mt-4 lg:mt-0 lg:ml-4">
            <h3 className="text-white text-[18px] lg:text-[20px] font-rubik font-bold mb-4">
              Подберем за 5 минут
            </h3>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white mb-6">
              <ClockIcon />
            </div>
            <div className="w-full max-w-[180px] h-[120px] rounded-[12px] bg-white/10 flex items-center justify-center">
              <span className="text-white/60 text-[12px] font-rubik">Иллюстрация</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuizSection
