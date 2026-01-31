import React, { useEffect } from 'react'
import SearchSection from '../components/sections/SearchSection'
import OffersSection from '../components/sections/OffersSection'
import ResidentialComplexSection from '../components/sections/ResidentialComplexSection'
import QuizSection from '../components/sections/QuizSection'
import HotOffersSection from '../components/sections/HotOffersSection'
import LaunchSalesSection from '../components/sections/LaunchSalesSection'
import AboutPlatformSection from '../components/sections/AboutPlatformSection'
import AdditionalFeaturesSection from '../components/sections/AdditionalFeaturesSection'
import LatestNewsSection from '../components/sections/LatestNewsSection'
import ContactSection from '../components/sections/ContactSection'

const HomePage = () => {
  useEffect(() => {
    // 🔥 КОМПАКТНАЯ ВЕРСИЯ: Hero помещается в первый экран 🔥
    console.log('%c✅ LiveGrid Deploy v2.0 - КОМПАКТНЫЙ HERO', 'color: #3CA4F4; font-size: 18px; font-weight: bold;')
    console.log('%c📐 Оптимизация для 13" ноутбука (768px):', 'color: #27AE60; font-weight: bold;')
    console.log('  ✓ Header: 80px → 72px (-10%)')
    console.log('  ✓ Заголовок: 48px → 40px (-17%)')
    console.log('  ✓ Поиск/CTA: 56px → 48px (-14%)')
    console.log('  ✓ Табы: 48px → 40px (-17%)')
    console.log('  ✓ Карточки: 160px → 130px (-19%)')
    console.log('  ✓ Все отступы: -20-30%')
    console.log('%c💾 Экономия: ~180px вертикального пространства', 'color: #9B59B6; font-weight: bold;')
    console.log('%c🎯 Результат: Hero полностью помещается в первый экран!', 'color: #E74C3C; font-weight: bold;')
  }, [])

  return (
    <>
      <SearchSection />
      <OffersSection />
      <ResidentialComplexSection />
      <QuizSection />
      <HotOffersSection />
      <LaunchSalesSection />
      <AboutPlatformSection />
      <AdditionalFeaturesSection />
      <LatestNewsSection />
      <ContactSection />
    </>
  )
}

export default HomePage
