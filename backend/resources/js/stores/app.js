import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    selectedCity: localStorage.getItem('selectedCity') || '58c665588b6aa52311afa01b',
    selectedCityName: localStorage.getItem('selectedCityName') || 'Санкт-Петербург',
    loading: false,
    error: null,
  }),
  
  actions: {
    setCity(cityId, cityName) {
      this.selectedCity = cityId;
      this.selectedCityName = cityName;
      localStorage.setItem('selectedCity', cityId);
      localStorage.setItem('selectedCityName', cityName);
    },
    
    setLoading(loading) {
      this.loading = loading;
    },
    
    setError(error) {
      this.error = error;
    },
    
    clearError() {
      this.error = null;
    },
  },
});
