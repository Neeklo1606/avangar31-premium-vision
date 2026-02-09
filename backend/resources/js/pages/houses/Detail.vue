<template>
  <div class="space-y-6">
    <button @click="router.back()" class="flex items-center text-gray-600 hover:text-gray-900">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Назад
    </button>
    
    <div v-if="house" class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <h1 class="text-3xl font-bold">{{ house.rooms.label }}</h1>
        <p v-if="house.price" class="text-2xl font-bold text-gray-900 mt-2">{{ house.price.formatted }}</p>
      </div>
      <div class="p-6 grid grid-cols-4 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Площадь дома</p>
          <p class="text-xl font-bold">{{ house.area.total?.formatted }}</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Участок</p>
          <p class="text-xl font-bold">{{ house.area.land?.formatted }}</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Этажей</p>
          <p class="text-xl font-bold">{{ house.floors_total }}</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Статус</p>
          <p class="text-lg" :class="house.is_available ? 'text-green-600' : 'text-red-600'">
            {{ house.is_available ? 'Доступен' : 'Продан' }}
          </p>
        </div>
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
const house = ref(null);

onMounted(async () => {
  appStore.setLoading(true);
  try {
    const result = await api.detail.get('houses', route.params.id, { with_media: true });
    house.value = result.data;
  } catch (error) {
    appStore.setError(error.message);
    router.push('/admin/houses');
  } finally {
    appStore.setLoading(false);
  }
});
</script>
