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
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0">
    <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ClockIcon = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="shrink-0">
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

  return (
    <section className="w-full bg-gray-50 py-8 lg:py-12">
      <div className="max-w-container mx-auto px-4">
        <div className="rounded-lg border border-gray-light/40 bg-white shadow-sm flex flex-col lg:flex-row overflow-hidden">
          {/* Левая часть — квиз */}
          <div className="flex-1 p-5 lg:p-6">
            <h2 className="text-dark text-xl lg:text-2xl font-rubik font-bold mb-1">
              Подберем объект под Ваш запрос
            </h2>
            <p className="text-gray-medium text-sm font-rubik mb-5">
              {currentStep?.question}
            </p>

            {isTypeStep ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 lg:gap-3 mb-5">
                {PROPERTY_TYPES.map((opt) => {
                  const isSelected = selectedType === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect('type', opt.value)}
                      className={`relative rounded-lg border p-3 flex flex-col items-center justify-end min-h-[100px] lg:min-h-[120px] transition-all duration-200 ${
                        isSelected
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white border-gray-light text-dark hover:border-primary/50'
                      }`}
                    >
                      <div className="w-full flex-1 flex items-center justify-center mb-2">
                        <img
                          src={opt.image}
                          alt=""
                          className="max-h-[50px] lg:max-h-[60px] w-auto object-contain"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      </div>
                      <div className="w-full flex items-center justify-between gap-2">
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
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
              <div className="flex flex-wrap gap-2 mb-5">
                {currentStep?.options?.map((opt) => {
                  const isSelected = answers[currentStep.id] === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(currentStep.id, opt.value)}
                      className={`px-4 py-2.5 rounded-md text-sm font-rubik font-medium transition-colors ${
                        isSelected ? 'bg-primary text-white' : 'bg-gray-50 text-dark hover:bg-primary/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="mb-5">
                <p className="text-gray-medium text-sm font-rubik mb-4">
                  Ваши ответы сохранены. Нажмите «Следующий», чтобы перейти к подборке.
                </p>
                <Button variant="primary" size="md" to="/catalog">
                  Смотреть подборку
                </Button>
              </div>
            )}

            {/* Прогресс */}
            <div className="flex items-center gap-1 mb-5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={`inline-block h-1 rounded-full transition-all ${
                    i === step ? 'w-5 bg-primary' : 'w-5 bg-gray-light'
                  }`}
                />
              ))}
            </div>

            {/* Кнопки */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBack}
                disabled={isFirstStep}
              >
                Назад
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                disabled={isLastStep}
              >
                Следующий
              </Button>
            </div>
          </div>

          {/* Правая часть — синяя панель */}
          <div className="w-full lg:w-[260px] bg-primary flex-shrink-0 p-5 lg:p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-white text-lg font-rubik font-bold mb-3">
              Подберем за 5 минут
            </h3>
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white mb-4">
              <ClockIcon />
            </div>
            <div className="w-full max-w-[160px] h-[100px] rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white/60 text-xs font-rubik">Иллюстрация</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuizSection
