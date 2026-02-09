<template>
  <header class="relative flex h-16 items-center justify-between border-b border-gray-200 bg-white backdrop-blur-xl px-4 sm:px-6 gap-2 sm:gap-4 z-30 shrink-0">
    <div class="flex items-center gap-2 sm:gap-3 min-w-0">
      <button
        @click="toggleMobileMenu"
        class="lg:hidden flex-shrink-0 h-11 w-11 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Открыть меню"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      <div class="hidden sm:flex items-center gap-2 text-sm min-w-0">
        <span class="font-semibold text-gray-900 truncate">{{ currentPageTitle }}</span>
      </div>
      <div class="flex sm:hidden items-center text-sm min-w-0">
        <span class="font-semibold text-gray-900 truncate">{{ currentPageTitle }}</span>
      </div>
    </div>
    <div class="flex items-center gap-2 sm:gap-3">
      <div class="relative" ref="cityDropdownRef">
        <button
          type="button"
          @click="showCityMenu = !showCityMenu"
          class="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[180px] text-left flex items-center justify-between gap-2"
        >
          <span class="truncate">{{ appStore.selectedCityName }}</span>
          <svg class="w-4 h-4 shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div
          v-if="showCityMenu"
          class="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1"
        >
          <button
            v-for="c in cities"
            :key="c.id"
            @click="selectCity(c.id, c.name)"
            type="button"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
            :class="{ 'bg-blue-50 text-blue-700 font-medium': appStore.selectedCity === c.id }"
          >
            {{ c.name }}
          </button>
        </div>
      </div>
      <div class="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-blue-600 border border-blue-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
        A
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, inject, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/app';

const route = useRoute();
const appStore = useAppStore();
const mobileMenu = inject('mobileMenu', null);

const showCityMenu = ref(false);
const cityDropdownRef = ref(null);

const cities = [
  { id: '58c665588b6aa52311afa01b', name: 'Санкт-Петербург' },
  { id: 'moscow_id', name: 'Москва' },
];

const currentPageTitle = computed(() => route.meta?.title || 'Панель управления');

const toggleMobileMenu = () => {
  if (mobileMenu) mobileMenu.toggle();
};

const selectCity = (cityId, cityName) => {
  appStore.setCity(cityId, cityName);
  showCityMenu.value = false;
  window.location.reload();
};

const handleClickOutside = (e) => {
  if (cityDropdownRef.value && !cityDropdownRef.value.contains(e.target)) {
    showCityMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
