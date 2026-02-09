<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg border border-gray-200 p-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">ЖК (Жилые комплексы)</h3>
          <p class="text-sm text-gray-500">Всего найдено: {{ total.toLocaleString('ru-RU') }}</p>
        </div>
      </div>
    </div>
    
    <!-- Filters -->
    <FilterPanel
      :dictionaries="dictionaries"
      :initial-filters="currentFilters"
      @apply="applyFilters"
      @reset="resetFilters"
    />
    
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="divide-y divide-gray-200">
        <BlockCard
          v-for="block in blocks"
          :key="block.id"
          :block="block"
        />
        
        <!-- Empty State -->
        <div v-if="blocks.length === 0 && !loading" class="p-12 text-center text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
          <p class="text-lg font-medium">ЖК не найдены</p>
          <p class="text-sm mt-2">Попробуйте изменить параметры фильтрации</p>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-500 mt-4">Загрузка...</p>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <Pagination
      v-if="pagination.total_pages > 1 && blocks.length > 0"
      :current-page="pagination.page"
      :total-pages="pagination.total_pages"
      :total="total"
      :per-page="pagination.per_page"
      @change="changePage"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useAppStore } from '@/stores/app';
import FilterPanel from '@/components/blocks/FilterPanel.vue';
import BlockCard from '@/components/blocks/BlockCard.vue';
import Pagination from '@/components/ui/Pagination.vue';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const blocks = ref([]);
const total = ref(0);
const pagination = ref({ page: 1, per_page: 20, total_pages: 1 });
const dictionaries = ref({});
const currentFilters = ref({});
const loading = ref(false);

onMounted(async () => {
  await loadDictionaries();
  await loadBlocks();
});

// Watch route changes
watch(() => route.query, () => {
  loadBlocks();
});

const loadDictionaries = async () => {
  try {
    const result = await api.dictionaries.getAll('blocks');
    dictionaries.value = result.data || {};
  } catch (error) {
    console.error('Error loading dictionaries:', error);
  }
};

const loadBlocks = async () => {
  loading.value = true;
  
  try {
    const page = parseInt(route.query.page) || 1;
    
    // Extract filters from query
    const filters = {};
    Object.keys(route.query).forEach(key => {
      if (key !== 'page') {
        filters[key] = route.query[key];
      }
    });
    
    currentFilters.value = filters;
    
    const result = await api.catalog.get('blocks', {
      page,
      per_page: 20,
      filter: filters,
    });
    
    blocks.value = result.data || [];
    total.value = result.meta?.total || 0;
    pagination.value = result.meta || { page: 1, per_page: 20, total_pages: 1 };
  } catch (error) {
    appStore.setError(error.message);
    blocks.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

const applyFilters = (filters) => {
  const query = { ...filters };
  if (Object.keys(query).length > 0) {
    query.page = 1;
  }
  router.push({ query });
};

const resetFilters = () => {
  router.push({ query: {} });
};

const changePage = (page) => {
  router.push({ query: { ...route.query, page } });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>
