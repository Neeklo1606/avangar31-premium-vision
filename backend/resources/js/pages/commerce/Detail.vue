<template>
  <div class="space-y-6">
    <button @click="router.back()" class="flex items-center text-gray-600 hover:text-gray-900">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Назад
    </button>
    
    <div v-if="item" class="bg-white rounded-lg shadow p-6">
      <h1 class="text-3xl font-bold mb-4">Помещение №{{ item.number || item.id.slice(-8) }}</h1>
      <div class="grid grid-cols-3 gap-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Цена</p>
          <p class="text-xl font-bold">{{ item.price?.formatted }}</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Площадь</p>
          <p class="text-xl font-bold">{{ item.area?.formatted }}</p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Тип</p>
          <p class="text-lg">{{ item.type }}</p>
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
const item = ref(null);

onMounted(async () => {
  appStore.setLoading(true);
  try {
    const result = await api.detail.get('commerce', route.params.id);
    item.value = result.data;
  } catch (error) {
    appStore.setError(error.message);
    router.push('/admin/commerce');
  } finally {
    appStore.setLoading(false);
  }
});
</script>
