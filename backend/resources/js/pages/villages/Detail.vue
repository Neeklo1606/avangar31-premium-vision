<template>
  <div class="space-y-6">
    <button @click="router.back()" class="flex items-center text-gray-600 hover:text-gray-900">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Назад
    </button>
    
    <div v-if="village" class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <h1 class="text-3xl font-bold">{{ village.name }}</h1>
        <p v-if="village.location?.address" class="text-gray-500 mt-2">{{ village.location.address }}</p>
      </div>
      <div v-if="village.images?.main" class="h-96 bg-gray-200">
        <img :src="village.images.main" :alt="village.name" class="w-full h-full object-cover" />
      </div>
      <div class="p-6">
        <p v-if="village.description" class="text-gray-700 whitespace-pre-line">{{ village.description }}</p>
        <div class="grid grid-cols-2 gap-4 mt-6">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Участков всего</p>
            <p class="text-2xl font-bold">{{ village.stats?.total_plots }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Доступно</p>
            <p class="text-2xl font-bold text-green-600">{{ village.stats?.available_plots }}</p>
          </div>
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
const village = ref(null);

onMounted(async () => {
  appStore.setLoading(true);
  try {
    const result = await api.detail.get('villages', route.params.id, { with_media: true });
    village.value = result.data;
  } catch (error) {
    appStore.setError(error.message);
    router.push('/admin/villages');
  } finally {
    appStore.setLoading(false);
  }
});
</script>
