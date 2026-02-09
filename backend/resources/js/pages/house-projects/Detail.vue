<template>
  <div class="space-y-6">
    <button @click="router.back()" class="flex items-center text-gray-600 hover:text-gray-900">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Назад
    </button>
    
    <div v-if="project" class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <h1 class="text-3xl font-bold">{{ project.name }}</h1>
        <p v-if="project.price" class="text-2xl font-bold text-gray-900 mt-2">{{ project.price.formatted }}</p>
      </div>
      
      <div v-if="project.images?.main" class="h-96 bg-gray-200">
        <img :src="project.images.main" :alt="project.name" class="w-full h-full object-cover" />
      </div>
      
      <div class="p-6">
        <p v-if="project.description" class="text-gray-700 mb-6">{{ project.description }}</p>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Комнат</p>
            <p class="text-xl font-bold">{{ project.rooms }}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Этажей</p>
            <p class="text-xl font-bold">{{ project.floors }}</p>
          </div>
          <div v-if="project.area?.total" class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Площадь</p>
            <p class="text-xl font-bold">{{ project.area.total.formatted }}</p>
          </div>
          <div v-if="project.material" class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Материал</p>
            <p class="text-lg">{{ project.material }}</p>
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
const project = ref(null);

onMounted(async () => {
  appStore.setLoading(true);
  try {
    const result = await api.detail.get('house_projects', route.params.id, { with_media: true });
    project.value = result.data;
  } catch (error) {
    appStore.setError(error.message);
    router.push('/admin/house-projects');
  } finally {
    appStore.setLoading(false);
  }
});
</script>
