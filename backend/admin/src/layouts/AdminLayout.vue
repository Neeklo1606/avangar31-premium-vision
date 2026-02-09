<template>
  <div class="flex h-screen w-full overflow-hidden bg-gray-50">
    <div
      v-if="isMobileMenuOpen"
      @click="closeMobileMenu"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
      :class="isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    ></div>

    <AdminSidebar />
    <div class="flex flex-1 flex-col overflow-hidden min-w-0">
      <AdminHeader />
      <main class="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div class="max-w-[1600px] mx-auto">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, watch } from 'vue';
import { useRoute } from 'vue-router';
import AdminSidebar from '../components/admin/Sidebar.vue';
import AdminHeader from '../components/admin/Header.vue';

const route = useRoute();
const isMobileMenuOpen = ref(false);

function openMobileMenu() {
  isMobileMenuOpen.value = true;
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = '';
}

function toggleMobileMenu() {
  if (isMobileMenuOpen.value) closeMobileMenu();
  else openMobileMenu();
}

watch(
  () => route.path,
  () => {
    if (isMobileMenuOpen.value) closeMobileMenu();
  }
);

provide('mobileMenu', {
  isOpen: isMobileMenuOpen,
  open: openMobileMenu,
  close: closeMobileMenu,
  toggle: toggleMobileMenu,
});
</script>
