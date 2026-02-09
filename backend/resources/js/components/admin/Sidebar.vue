<template>
  <aside
    class="relative flex flex-col bg-gray-900 text-white transition-all duration-300 border-r border-gray-800 shrink-0"
    :class="[
      'lg:flex',
      isMobileMenuOpen ? 'flex' : 'hidden',
      'lg:relative fixed lg:inset-auto inset-y-0 left-0 z-50 lg:z-auto',
      isCollapsed ? 'lg:w-16 w-72' : 'lg:w-72 w-72',
      'lg:translate-x-0 transition-transform duration-300 ease-in-out',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <div class="flex h-16 items-center border-b border-gray-800 justify-between px-6 shrink-0">
      <h1 v-if="!isCollapsed" class="text-xl font-bold text-white">TrendAgent</h1>
      <button
        @click="toggleCollapse"
        class="rounded-xl p-2 hover:bg-gray-800 transition-all"
        :title="isCollapsed ? 'Развернуть меню' : 'Свернуть меню'"
      >
        <svg class="h-5 w-5 transition-transform duration-300" :class="isCollapsed ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
    </div>
    <nav class="flex-1 overflow-y-auto space-y-1 p-4 min-h-0">
      <router-link
        to="/admin"
        class="flex items-center rounded-xl text-sm font-medium transition-all px-4 py-3 gap-3"
        :class="[
          isCollapsed ? 'justify-center' : '',
          route.name === 'dashboard' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        ]"
        @click="handleMobileMenuClick"
      >
        <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        <span v-if="!isCollapsed">Панель управления</span>
      </router-link>

      <!-- Trendagent: каталог -->
      <div class="space-y-1">
        <button
          @click="toggleTrendagentMenu"
          class="w-full flex items-center rounded-xl text-sm font-medium transition-all px-4 py-3 gap-3"
          :class="[
            isCollapsed ? 'justify-center' : '',
            isTrendagentMenuOpen || isTrendagentRoute
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <span v-if="!isCollapsed" class="flex-1 text-left">Trendagent</span>
          <svg v-if="!isCollapsed" class="h-4 w-4 transition-transform" :class="{ 'rotate-180': isTrendagentMenuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div v-if="!isCollapsed && isTrendagentMenuOpen" class="ml-4 space-y-1 pl-4 border-l-2 border-gray-700">
          <router-link to="/admin/blocks" class="flex items-center rounded-lg text-sm font-medium transition-all px-4 py-2 gap-3" :class="isRoute('blocks') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'" @click="handleMobileMenuClick">
            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            <span>ЖК (Комплексы)</span>
          </router-link>
          <router-link to="/admin/apartments" class="flex items-center rounded-lg text-sm font-medium transition-all px-4 py-2 gap-3" :class="isRoute('apartments') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'" @click="handleMobileMenuClick">
            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span>Квартиры</span>
          </router-link>
          <router-link to="/admin/parking" class="flex items-center rounded-lg text-sm font-medium transition-all px-4 py-2 gap-3" :class="isRoute('parking') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'" @click="handleMobileMenuClick">
            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            <span>Паркинги</span>
          </router-link>
          <router-link to="/admin/houses" class="flex items-center rounded-lg text-sm font-medium transition-all px-4 py-2 gap-3" :class="isRoute('houses') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'" @click="handleMobileMenuClick">
            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span>Дома</span>
          </router-link>
          <router-link to="/admin/plots" class="flex items-center rounded-lg text-sm font-medium transition-all px-4 py-2 gap-3" :class="isRoute('plots') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'" @click="handleMobileMenuClick">
            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
            <span>Участки</span>
          </router-link>
          <router-link to="/admin/commerce" class="flex items-center rounded-lg text-sm font-medium transition-all px-4 py-2 gap-3" :class="isRoute('commerce') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'" @click="handleMobileMenuClick">
            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            <span>Коммерция</span>
          </router-link>
          <router-link to="/admin/villages" class="flex items-center rounded-lg text-sm font-medium transition-all px-4 py-2 gap-3" :class="isRoute('villages') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'" @click="handleMobileMenuClick">
            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span>Поселки</span>
          </router-link>
          <router-link to="/admin/house-projects" class="flex items-center rounded-lg text-sm font-medium transition-all px-4 py-2 gap-3" :class="isRoute('house-projects') ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'" @click="handleMobileMenuClick">
            <svg class="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span>Проекты домов</span>
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, computed, inject, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const mobileMenu = inject('mobileMenu', null);

const isCollapsed = ref(localStorage.getItem('trendagent_sidebarCollapsed') === 'true');
const isTrendagentMenuOpen = ref(localStorage.getItem('trendagent_catalogMenuOpen') !== 'false');

const isMobileMenuOpen = computed(() => mobileMenu?.isOpen?.value ?? false);

const trendagentRouteNames = [
  'blocks.list', 'blocks.detail', 'apartments.list', 'apartments.detail',
  'parking.list', 'parking.detail', 'houses.list', 'houses.detail',
  'plots.list', 'plots.detail', 'commerce.list', 'commerce.detail',
  'villages.list', 'villages.detail', 'house-projects.list', 'house-projects.detail'
];

const isTrendagentRoute = computed(() => trendagentRouteNames.includes(route.name));

const isRoute = (segment) => {
  const name = route.name?.toString() ?? '';
  return name.includes(segment);
};

const toggleTrendagentMenu = () => {
  if (isCollapsed.value) return;
  isTrendagentMenuOpen.value = !isTrendagentMenuOpen.value;
  localStorage.setItem('trendagent_catalogMenuOpen', isTrendagentMenuOpen.value.toString());
};

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('trendagent_sidebarCollapsed', isCollapsed.value.toString());
};

const handleMobileMenuClick = () => {
  if (mobileMenu && window.innerWidth < 1024) mobileMenu.close();
};

watch(() => route.path, () => {
  if (isTrendagentRoute.value && !isTrendagentMenuOpen.value) {
    isTrendagentMenuOpen.value = true;
    localStorage.setItem('trendagent_catalogMenuOpen', 'true');
  }
});
</script>
