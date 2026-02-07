import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Layout from './components/layout/Layout'
import AuthLayout from './components/layout/AuthLayout'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import NewBuildingsCatalogPage from './pages/NewBuildingsCatalogPage'
import NewBuildingDetailPage from './pages/NewBuildingDetailPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import NewsListPage from './pages/NewsListPage'
import NewsDetailPage from './pages/NewsDetailPage'
import MapPage from './pages/MapPage'
import FavoritesPage from './pages/FavoritesPage'
import PrivacyPage from './pages/PrivacyPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="catalog/new-buildings" element={<NewBuildingsCatalogPage />} />
          <Route path="new-building/:id" element={<NewBuildingDetailPage />} />
          <Route path="property/:id" element={<PropertyDetailPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="news" element={<NewsListPage />} />
          <Route path="news/:id" element={<NewsDetailPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
