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
  { id: 'type', question: 'Какой тип недвижимости вы рассматриваете?', options: PROPERTY_TYPES },
  { id: 'rooms', question: 'Количество комнат', options: [{ value: 'studio', label: 'Студия' }, { value: '1', label: '1 комната' }, { value: '2', label: '2 комнаты' }, { value: '3', label: '3 и более' }] },
  { id: 'budget', question: 'Бюджет', options: [{ value: 'low', label: 'До 5 млн ₽' }, { value: 'mid', label: '5–10 млн ₽' }, { value: 'high', label: '10–20 млн ₽' }, { value: 'premium', label: 'От 20 млн ₽' }] },
  { id: 'district', question: 'Предпочтительный район', options: [{ value: 'center', label: 'Центр' }, { value: 'north', label: 'Север' }, { value: 'south', label: 'Юг' }, { value: 'any', label: 'Любой' }] },
  { id: 'finish', question: 'Готово', options: [] },
]

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className="shrink-0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" />
  </svg>
)

const ClockIcon = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="shrink-0 text-white">
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M24 14v10l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const QuizIllustration = () => (
  <div className="w-full max-w-[140px] h-[90px] flex items-end justify-center">
    <svg viewBox="0 0 140 90" className="w-full h-full" fill="none">
      <rect x="45" y="35" width="50" height="45" rx="3" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      <path d="M60 35 L60 25 L80 25 L80 35" fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <rect x="15" y="50" width="45" height="30" rx="2" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <line x1="22" y1="58" x2="52" y2="58" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      <line x1="22" y1="65" x2="48" y2="65" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <circle cx="75" cy="25" r="18" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" />
      <path d="M75 15 L75 25 L83 30" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
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
  const canProceed = !isTypeStep || selectedTypes.length > 0

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
    if (!isLastStep && canProceed) setStep((prev) => prev + 1)
  }

  return (
    <section id="quiz" className="w-full py-8 lg:py-12" style={{ backgroundColor: '#F6F8FB' }}>
      <div className="max-w-container mx-auto px-4">
        <div className="rounded-[20px] overflow-hidden flex flex-col lg:flex-row bg-white shadow-sm border border-gray-light/20">
          {/* Левая часть — основной контент */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col min-w-0 order-2 lg:order-1">
            <h2 className="text-dark text-2xl lg:text-3xl font-rubik font-bold leading-tight mb-2">
              Подберем объект под ваш запрос
            </h2>
            <p className="text-gray-medium text-sm lg:text-base font-rubik leading-relaxed mb-6">
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
                      className={`relative rounded-xl border p-4 flex flex-col items-center justify-center min-h-[110px] sm:min-h-[120px] lg:min-h-[130px] cursor-pointer transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        isSelected
                          ? 'bg-primary border-primary text-white shadow-sm'
                          : 'bg-white border-gray-light/50 text-dark hover:border-primary/40 hover:shadow-sm hover:scale-[1.02]'
                      }`}
                    >
                      <div className="absolute bottom-3 left-3 w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors duration-200 ${
                        isSelected ? 'bg-white/95 text-primary' : 'border border-gray-light'
                      }">
                        {isSelected ? <CheckIcon /> : null}
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center w-full gap-2">
                        <img
                          src={opt.image}
                          alt=""
                          className={`max-h-[40px] sm:max-h-[46px] lg:max-h-[50px] w-auto object-contain transition-opacity duration-200 ${
                            isSelected ? 'brightness-0 invert opacity-95' : 'opacity-85'
                          }`}
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                        <span className="text-sm font-rubik font-medium text-center leading-snug">
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
                      className={`px-4 py-3 rounded-xl text-sm font-rubik font-medium transition-all duration-200 ease-in-out ${
                        isSelected ? 'bg-primary text-white' : 'bg-gray-50 text-dark hover:bg-primary/10 border border-gray-light/30'
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

            {/* Прогресс-бар и кнопки */}
            <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-gray-light/30">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <span
                    key={i}
                    className={`inline-block h-1 rounded-full transition-all duration-200 ${
                      i === step ? 'flex-1 max-w-8 bg-primary' : 'flex-1 max-w-4 bg-gray-light/60'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleBack}
                  disabled={isFirstStep}
                  className="h-11 px-5 text-gray-medium hover:bg-gray-100 hover:text-dark disabled:opacity-50"
                >
                  Назад
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  disabled={isLastStep || !canProceed}
                  className="h-11 px-6 flex-1 sm:flex-initial"
                >
                  Следующий
                </Button>
              </div>
            </div>
          </div>

          {/* Правая часть — CTA */}
          <div className="w-full lg:w-[280px] xl:w-[300px] bg-primary flex-shrink-0 p-6 lg:p-8 flex flex-col items-center justify-center text-center order-1 lg:order-2 rounded-t-[20px] lg:rounded-t-none lg:rounded-r-[20px]">
            <h3 className="text-white text-xl lg:text-2xl font-rubik font-bold mb-4 leading-tight">
              Подберем за 5 минут
            </h3>
            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/20 flex items-center justify-center mb-5 flex-shrink-0">
              <ClockIcon />
            </div>
            <div className="mt-auto w-full flex justify-center pt-4">
              <QuizIllustration />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuizSection
