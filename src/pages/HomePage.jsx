import React from 'react'
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
