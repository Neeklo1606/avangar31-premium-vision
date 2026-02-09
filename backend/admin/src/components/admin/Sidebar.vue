<template>
  <aside
    class="relative flex flex-col bg-gray-900 text-white transition-all duration-300 border-r border-gray-800"
    :class="[
      'lg:flex',
      isMobileMenuOpen ? 'flex' : 'hidden',
      'lg:relative fixed lg:inset-auto inset-y-0 left-0 z-50 lg:z-auto',
      isCollapsed ? 'lg:w-16 w-72' : 'lg:w-72 w-72',
      'lg:translate-x-0 transition-transform duration-300 ease-in-out',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div class="flex h-16 items-center border-b border-gray-800 justify-between px-6">
      <h1 v-if="!isCollapsed" class="text-xl font-bold text-white">Админ</h1>
      <button
        @click="toggleCollapse"
        class="rounded-xl p-2 hover:bg-gray-800 transition-all"
        :title="isCollapsed ? 'Развернуть меню' : 'Свернуть меню'"
      >
        <svg
          class="h-5 w-5 transition-transform duration-300"
          :class="isCollapsed ? 'rotate-180' : ''"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
    <nav class="flex-1 overflow-y-auto space-y-1 p-4">
      <router-link
        to="/dashboard"
        class="flex items-center rounded-xl text-sm font-medium transition-all px-4 py-3 gap-3"
        :class="[
          isCollapsed ? 'justify-center' : '',
          isDashboard
            ? 'bg-gray-800 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
        @click="handleMobileMenuClick"
      >
        <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span v-if="!isCollapsed">Панель управления</span>
      </router-link>
    </nav>
    <div class="border-t border-gray-800 space-y-3 p-4">
      <div class="flex items-center gap-3 px-2" :class="isCollapsed ? 'justify-center' : ''">
        <div
          class="h-10 w-10 rounded-full bg-blue-600 border border-blue-500 flex items-center justify-center text-sm font-bold text-white shrink-0"
        >
          A
        </div>
        <div v-if="!isCollapsed" class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white">Администратор</p>
          <p class="text-xs text-gray-400 truncate">admin@example.com</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const mobileMenu = inject('mobileMenu', null);

const isCollapsed = ref(false);
const isMobileMenuOpen = computed(() => mobileMenu?.isOpen?.value ?? false);
const isDashboard = computed(() => route.name === 'dashboard');

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value;
}

function handleMobileMenuClick() {
  if (mobileMenu && window.innerWidth < 1024) {
    mobileMenu.close();
  }
}
</script>
