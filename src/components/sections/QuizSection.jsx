import React, { useState } from 'react'
import { Button } from '../ui'

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
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="shrink-0">
    <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ClockIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="shrink-0">
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

  const selectedTypes = Array.isArray(answers.type) ? answers.type : answers.type ? [answers.type] : []

  const handleTypeToggle = (value) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev.type) ? prev.type : prev.type ? [prev.type] : []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, type: next }
    })
  }

  const handleSelect = (stepId, value) => {
    if (stepId === 'type') return
    setAnswers((prev) => ({ ...prev, [stepId]: value }))
    if (!isLastStep) setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1)
  }

  const handleNext = () => {
    if (!isLastStep) setStep((prev) => prev + 1)
  }

  return (
    <section className="w-full bg-gray-50 py-8 lg:py-12">
      <div className="max-w-container mx-auto px-4">
        <div className="rounded-xl border border-gray-light/30 bg-white shadow-sm flex flex-col lg:flex-row overflow-hidden items-stretch">
          {/* Левая часть — квиз (4.1, 4.2) */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col min-w-0">
            <h2 className="text-dark text-2xl lg:text-3xl font-rubik font-bold leading-tight mb-2">
              Подберем объект под Ваш запрос
            </h2>
            <p className="text-gray-medium text-sm font-rubik leading-relaxed mb-6">
              {currentStep?.question}
            </p>

            {isTypeStep ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4 mb-6 auto-rows-fr">
                {PROPERTY_TYPES.map((opt) => {
                  const isSelected = selectedTypes.includes(opt.value)
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleTypeToggle(opt.value)}
                      aria-pressed={isSelected}
                      aria-selected={isSelected}
                      className={`relative rounded-xl border p-4 flex flex-col items-center justify-center min-h-[100px] lg:min-h-[120px] cursor-pointer transition-[background-color,color,border-color,box-shadow] duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        isSelected
                          ? 'bg-primary border-primary text-white shadow-md'
                          : 'bg-white border-gray-light/60 text-dark hover:border-primary/50'
                      }`}
                    >
                      <div className="w-full flex-1 flex items-center justify-center mb-3">
                        <img
                          src={opt.image}
                          alt=""
                          className={`max-h-[50px] lg:max-h-[60px] w-auto object-contain transition-opacity duration-200 ${
                            isSelected ? 'brightness-0 invert opacity-95' : ''
                          }`}
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      </div>
                      <div className="w-full flex items-center justify-between gap-2">
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors duration-200 ${
                          isSelected ? 'bg-white/90 text-primary' : 'border border-gray-medium'
                        }`}>
                          {isSelected ? <CheckIcon /> : null}
                        </div>
                        <span className="text-xs lg:text-sm font-rubik font-medium truncate">
                          {opt.label}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : !isLastStep ? (
              <div className="flex flex-wrap gap-2 mb-6">
                {currentStep?.options?.map((opt) => {
                  const isSelected = answers[currentStep.id] === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(currentStep.id, opt.value)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-rubik font-medium transition-all duration-200 ease-out ${
                        isSelected ? 'bg-primary text-white' : 'bg-gray-50 text-dark hover:bg-primary/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-gray-medium text-sm font-rubik mb-4 leading-relaxed">
                  Ваши ответы сохранены. Нажмите «Следующий», чтобы перейти к подборке.
                </p>
                <Button variant="primary" size="md" to="/catalog">
                  Смотреть подборку
                </Button>
              </div>
            )}

            {/* Прогресс + кнопки (4.7) */}
            <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <span
                    key={i}
                    className={`inline-block h-1.5 rounded-full transition-all duration-200 ${
                      i === step ? 'w-6 bg-primary' : 'w-5 bg-gray-light'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-end">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleBack}
                  disabled={isFirstStep}
                  className="h-11 px-5"
                >
                  Назад
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  disabled={isLastStep}
                  className="h-11 px-5 shadow-sm"
                >
                  Следующий
                </Button>
              </div>
            </div>
          </div>

          {/* Правая часть — CTA (4.8, 4.9) */}
          <div className="w-full lg:w-[260px] bg-primary flex-shrink-0 p-6 lg:p-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-white text-lg lg:text-xl font-rubik font-bold mb-4 leading-tight">
              Подберем за 5 минут
            </h3>
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/30 flex items-center justify-center text-white mb-6 flex-shrink-0">
              <ClockIcon />
            </div>
            <div className="w-full max-w-[180px] h-[120px] rounded-lg bg-white/10 flex items-center justify-center mt-auto flex-shrink-0">
              <span className="text-white/60 text-xs font-rubik">Иллюстрация</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuizSection
