<template>
  <div class="space-y-6">
    <button @click="router.back()" class="flex items-center text-gray-600 hover:text-gray-900">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Назад
    </button>
    
    <div v-if="apartment" class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ apartment.rooms.label }}</h1>
            <p v-if="apartment.block?.name" class="text-blue-600 mt-2">{{ apartment.block.name }}</p>
          </div>
          <div v-if="apartment.price" class="text-right">
            <p class="text-sm text-gray-500">Цена</p>
            <p class="text-2xl font-bold text-gray-900">{{ apartment.price.formatted }}</p>
          </div>
        </div>
      </div>
      
      <div class="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Площадь</p>
          <p class="text-xl font-bold">{{ apartment.area.total?.formatted }}</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Этаж</p>
          <p class="text-xl font-bold">{{ apartment.floor }} / {{ apartment.floors_total }}</p>
        </div>
        <div v-if="apartment.area.living" class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Жилая</p>
          <p class="text-xl font-bold">{{ apartment.area.living.formatted }}</p>
        </div>
        <div v-if="apartment.area.kitchen" class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Кухня</p>
          <p class="text-xl font-bold">{{ apartment.area.kitchen.formatted }}</p>
        </div>
      </div>
      
      <div v-if="apartment.images?.plan" class="p-6">
        <h2 class="text-xl font-semibold mb-4">Планировка</h2>
        <img :src="apartment.images.plan" alt="Планировка" class="max-w-full rounded-lg shadow" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useAppStore } from '@/stores/app';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const apartment = ref(null);

onMounted(async () => {
  appStore.setLoading(true);
  try {
    const result = await api.detail.get('apartments', route.params.id, { with_media: true });
    apartment.value = result.data;
  } catch (error) {
    appStore.setError(error.message);
    router.push('/admin/apartments');
  } finally {
    appStore.setLoading(false);
  }
});
</script>
