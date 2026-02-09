<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <button
      @click="router.back()"
      class="flex items-center text-gray-600 hover:text-gray-900 transition"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      Назад к списку
    </button>
    
    <div v-if="block" class="bg-white rounded-lg shadow">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ block.name }}</h1>
            <p v-if="block.location?.address" class="text-gray-500 mt-2 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ block.location.address }}
            </p>
          </div>
          <div v-if="block.price?.from" class="text-right">
            <p class="text-sm text-gray-500">Цена от</p>
            <p class="text-2xl font-bold text-gray-900">{{ block.price.from.formatted }}</p>
            <p v-if="block.price?.to && block.price.has_range" class="text-sm text-gray-500">
              до {{ block.price.to.formatted }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Main Image -->
      <div v-if="block.images?.main" class="relative h-96 bg-gray-200">
        <img
          :src="block.images.main"
          :alt="block.name"
          class="w-full h-full object-cover"
        />
      </div>
      
      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Description -->
        <div v-if="block.description">
          <h2 class="text-xl font-semibold mb-3">Описание</h2>
          <p class="text-gray-700 whitespace-pre-line">{{ block.description }}</p>
        </div>
        
        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-if="block.stats?.total_apartments" class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Квартир</p>
            <p class="text-2xl font-bold text-gray-900">{{ block.stats.total_apartments }}</p>
          </div>
          <div v-if="block.stats?.available_apartments" class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Доступно</p>
            <p class="text-2xl font-bold text-green-600">{{ block.stats.available_apartments }}</p>
          </div>
          <div v-if="block.stats?.total_buildings" class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Корпусов</p>
            <p class="text-2xl font-bold text-gray-900">{{ block.stats.total_buildings }}</p>
          </div>
          <div v-if="block.stats?.floors_max" class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">Этажей</p>
            <p class="text-2xl font-bold text-gray-900">до {{ block.stats.floors_max }}</p>
          </div>
        </div>
        
        <!-- Features -->
        <div v-if="block.features && block.features.length > 0">
          <h2 class="text-xl font-semibold mb-3">Особенности</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(feature, index) in block.features"
              :key="index"
              class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
            >
              {{ feature }}
            </span>
          </div>
        </div>
        
        <!-- Advantages -->
        <div v-if="block.advantages && block.advantages.length > 0">
          <h2 class="text-xl font-semibold mb-3">Преимущества</h2>
          <ul class="space-y-2">
            <li
              v-for="(advantage, index) in block.advantages"
              :key="index"
              class="flex items-start"
            >
              <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-gray-700">{{ advantage }}</span>
            </li>
          </ul>
        </div>
        
        <!-- Developer -->
        <div v-if="block.developer">
          <h2 class="text-xl font-semibold mb-3">Застройщик</h2>
          <div class="flex items-center space-x-4">
            <img
              v-if="block.developer.logo"
              :src="block.developer.logo"
              :alt="block.developer.name"
              class="w-16 h-16 object-contain"
            />
            <div>
              <p class="font-semibold text-gray-900">{{ block.developer.name }}</p>
            </div>
          </div>
        </div>
        
        <!-- Contact -->
        <div v-if="block.contact?.phone || block.contact?.email">
          <h2 class="text-xl font-semibold mb-3">Контакты</h2>
          <div class="space-y-2">
            <p v-if="block.contact.phone" class="text-gray-700">
              📞 Телефон: <a :href="`tel:${block.contact.phone}`" class="text-blue-600 hover:text-blue-800">{{ block.contact.phone }}</a>
            </p>
            <p v-if="block.contact.email" class="text-gray-700">
              ✉️ Email: <a :href="`mailto:${block.contact.email}`" class="text-blue-600 hover:text-blue-800">{{ block.contact.email }}</a>
            </p>
            <p v-if="block.contact.website" class="text-gray-700">
              🌐 Сайт: <a :href="block.contact.website" target="_blank" class="text-blue-600 hover:text-blue-800">{{ block.contact.website }}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading -->
    <div v-else class="bg-white rounded-lg shadow p-12 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-500 mt-4">Загрузка...</p>
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

const block = ref(null);

onMounted(async () => {
  await loadBlock();
});

const loadBlock = async () => {
  appStore.setLoading(true);
  
  try {
    const result = await api.detail.get('blocks', route.params.id, {
      with_media: true,
      with_aggregation: true,
    });
    
    block.value = result.data;
  } catch (error) {
    appStore.setError(error.message);
    router.push('/admin/blocks');
  } finally {
    appStore.setLoading(false);
  }
};
</script>
