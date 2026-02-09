<template>
  <div 
    class="p-6 hover:bg-gray-50 transition cursor-pointer"
    @click="goToDetail"
  >
    <div class="flex items-start space-x-4">
      <!-- Image -->
      <div class="flex-shrink-0 w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
        <img
          v-if="block.images?.main"
          :src="block.images.main"
          :alt="block.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      </div>
      
      <!-- Info -->
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 hover:text-blue-600 transition">
          {{ block.name }}
        </h3>
        
        <p v-if="block.location?.address" class="text-sm text-gray-500 mt-1 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          {{ block.location.address }}
        </p>
        
        <p v-if="block.short_description" class="text-sm text-gray-600 mt-2 line-clamp-2">
          {{ block.short_description }}
        </p>
        
        <!-- Stats -->
        <div class="flex flex-wrap gap-3 mt-4 text-sm">
          <span v-if="block.class" class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
            {{ block.class }}
          </span>
          <span v-if="block.status" class="px-3 py-1 bg-green-50 text-green-700 rounded-full">
            {{ block.status }}
          </span>
          <span v-if="block.stats?.total_apartments" class="text-gray-600">
            🏠 Квартир: {{ block.stats.total_apartments }}
          </span>
          <span v-if="block.stats?.total_buildings" class="text-gray-600">
            🏢 Корпусов: {{ block.stats.total_buildings }}
          </span>
        </div>
      </div>
      
      <!-- Price -->
      <div v-if="block.price?.from" class="text-right flex-shrink-0">
        <p class="text-sm text-gray-500">от</p>
        <p class="text-xl font-bold text-gray-900">
          {{ block.price.from.formatted }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const goToDetail = () => {
  router.push(`/admin/blocks/${props.block.id}`);
};
</script>
