<template>
  <div class="flex h-screen w-full overflow-hidden bg-gray-50">
    <!-- Overlay для мобильного меню -->
    <div
      v-if="isMobileMenuOpen"
      @click="closeMobileMenu"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
      :class="isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    ></div>

    <Sidebar />
    <div class="flex flex-1 flex-col overflow-hidden min-w-0">
      <Header />
      <main class="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div class="max-w-[1600px] mx-auto">
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

          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, watch } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '@/components/admin/Sidebar.vue';
import Header from '@/components/admin/Header.vue';
import { useAppStore } from '@/stores/app';

const route = useRoute();
const appStore = useAppStore();
const isMobileMenuOpen = ref(false);

const openMobileMenu = () => {
  isMobileMenuOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = '';
};

const toggleMobileMenu = () => {
  if (isMobileMenuOpen.value) closeMobileMenu();
  else openMobileMenu();
};

watch(() => route.path, () => {
  if (isMobileMenuOpen.value) closeMobileMenu();
});

provide('mobileMenu', {
  isOpen: isMobileMenuOpen,
  open: openMobileMenu,
  close: closeMobileMenu,
  toggle: toggleMobileMenu,
});
</script>
