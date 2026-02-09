<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <form @submit.prevent="applyFilters" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Поиск -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Поиск</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Название..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <!-- Класс -->
        <div v-if="dictionaries.class">
          <label class="block text-sm font-medium text-gray-700 mb-2">Класс</label>
          <select
            v-model="filters.class"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Все</option>
            <option
              v-for="item in dictionaries.class"
              :key="item.value || item.id"
              :value="item.value || item.id"
            >
              {{ item.label || item.name }}
            </option>
          </select>
        </div>
        
        <!-- Цена от -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Цена от (₽)</label>
          <input
            v-model.number="filters.price_from"
            type="number"
            placeholder="От..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <!-- Цена до -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Цена до (₽)</label>
          <input
            v-model.number="filters.price_to"
            type="number"
            placeholder="До..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div class="flex justify-end space-x-2">
        <button
          type="button"
          @click="resetFilters"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          Сбросить
        </button>
        <button
          type="submit"
          class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Применить
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  dictionaries: {
    type: Object,
    default: () => ({}),
  },
  initialFilters: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['apply', 'reset']);

const filters = reactive({
  search: props.initialFilters.search || '',
  class: props.initialFilters.class || '',
  price_from: props.initialFilters.price_from || null,
  price_to: props.initialFilters.price_to || null,
});

const applyFilters = () => {
  const cleanFilters = {};
  Object.keys(filters).forEach(key => {
    if (filters[key] !== '' && filters[key] !== null) {
      cleanFilters[key] = filters[key];
    }
  });
  emit('apply', cleanFilters);
};

const resetFilters = () => {
  filters.search = '';
  filters.class = '';
  filters.price_from = null;
  filters.price_to = null;
  emit('reset');
};
</script>
