<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-800">TrendAgent</h1>
        <p class="text-sm text-gray-500">Панель управления</p>
      </div>
      
      <nav class="mt-6">
        <div class="px-4 space-y-2">
          <!-- Dashboard -->
          <router-link
            to="/admin"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            active-class="bg-blue-50 text-blue-600"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Главная
          </router-link>
          
          <!-- ЖК -->
          <router-link
            to="/admin/blocks"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            active-class="bg-blue-50 text-blue-600"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            ЖК (Комплексы)
          </router-link>
          
          <!-- Квартиры -->
          <router-link
            to="/admin/apartments"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            active-class="bg-blue-50 text-blue-600"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Квартиры
          </router-link>
          
          <!-- Паркинги -->
          <router-link
            to="/admin/parking"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            active-class="bg-blue-50 text-blue-600"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
            </svg>
            Паркинги
          </router-link>
          
          <!-- Дома -->
          <router-link
            to="/admin/houses"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            active-class="bg-blue-50 text-blue-600"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Дома
          </router-link>
          
          <!-- Участки -->
          <router-link
            to="/admin/plots"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            active-class="bg-blue-50 text-blue-600"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
            Участки
          </router-link>
          
          <!-- Коммерция -->
          <router-link
            to="/admin/commerce"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            active-class="bg-blue-50 text-blue-600"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Коммерция
          </router-link>
          
          <!-- Поселки -->
          <router-link
            to="/admin/villages"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            active-class="bg-blue-50 text-blue-600"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Поселки
          </router-link>
          
          <!-- Проекты домов -->
          <router-link
            to="/admin/house-projects"
            class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            active-class="bg-blue-50 text-blue-600"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Проекты домов
          </router-link>
        </div>
      </nav>
    </aside>
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      <header class="bg-white shadow-sm">
        <div class="flex items-center justify-between px-6 py-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">{{ $route.meta.title }}</h2>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- City Selector -->
            <div class="relative" v-click-outside="() => showCityMenu = false">
              <button
                @click="showCityMenu = !showCityMenu"
                class="flex items-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{{ appStore.selectedCityName }}</span>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <div
                v-if="showCityMenu"
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10"
              >
                <div class="py-2">
                  <button
                    @click="changeCity('58c665588b6aa52311afa01b', 'Санкт-Петербург')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    Санкт-Петербург
                  </button>
                  <button
                    @click="changeCity('moscow_id', 'Москва')"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    Москва
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <!-- Error Toast -->
        <div
          v-if="appStore.error"
          class="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center justify-between"
        >
          <span>{{ appStore.error }}</span>
          <button @click="appStore.clearError()" class="text-red-600 hover:text-red-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Loading -->
        <div v-if="appStore.loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        
        <!-- Page Content -->
        <router-view v-else />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const showCityMenu = ref(false);

const changeCity = (cityId, cityName) => {
  appStore.setCity(cityId, cityName);
  showCityMenu.value = false;
  window.location.reload();
};

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};
</script>
