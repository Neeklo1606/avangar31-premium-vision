<template>
  <div class="flex items-center justify-between p-6 bg-white rounded-lg shadow">
    <div class="text-sm text-gray-500">
      Показано {{ Math.min(perPage, total) }} из {{ total.toLocaleString('ru-RU') }}
    </div>
    
    <div class="flex space-x-2">
      <button
        v-if="currentPage > 1"
        @click="$emit('change', currentPage - 1)"
        class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        Назад
      </button>
      
      <span class="px-4 py-2 text-gray-700">
        Страница {{ currentPage }} из {{ totalPages }}
      </span>
      
      <button
        v-if="currentPage < totalPages"
        @click="$emit('change', currentPage + 1)"
        class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        Далее
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    required: true,
  },
});

defineEmits(['change']);
</script>
