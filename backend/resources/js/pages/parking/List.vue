<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-semibold text-gray-900">Паркинги</h3>
      <p class="text-sm text-gray-500">Всего найдено: {{ total.toLocaleString('ru-RU') }}</p>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="applyFilters" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Тип</label>
            <select v-model="filters.type" class="w-full px-4 py-2 border rounded-lg">
              <option value="">Все</option>
              <option value="ground">Наземный</option>
              <option value="underground">Подземный</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Цена от (₽)</label>
            <input v-model.number="filters.price_from" type="number" class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Площадь от (м²)</label>
            <input v-model.number="filters.area_from" type="number" class="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" @click="resetFilters" class="px-4 py-2 bg-gray-100 rounded-lg">Сбросить</button>
          <button type="submit" class="px-6 py-2 text-white bg-blue-600 rounded-lg">Применить</button>
        </div>
      </form>
    </div>
    
    <div class="bg-white rounded-lg shadow divide-y">
      <div v-for="parking in parkings" :key="parking.id" class="p-6 hover:bg-gray-50 cursor-pointer" @click="router.push(`/admin/parking/${parking.id}`)">
        <div class="flex justify-between">
          <div>
            <h3 class="text-lg font-semibold">Место №{{ parking.number || parking.id.slice(-8) }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ parking.type }}</p>
            <p class="text-sm text-gray-600">{{ parking.area?.formatted }}</p>
            <p v-if="parking.block?.name" class="text-blue-600 mt-2">{{ parking.block.name }}</p>
          </div>
          <div v-if="parking.price">
            <p class="text-xl font-bold">{{ parking.price.formatted }}</p>
          </div>
        </div>
      </div>
      <div v-if="parkings.length === 0" class="p-12 text-center text-gray-500">Паркинги не найдены</div>
    </div>
    
    <Pagination v-if="pagination.total_pages > 1" :current-page="pagination.page" :total-pages="pagination.total_pages" :total="total" :per-page="pagination.per_page" @change="changePage" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useAppStore } from '@/stores/app';
import Pagination from '@/components/ui/Pagination.vue';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const parkings = ref([]);
const total = ref(0);
const pagination = ref({ page: 1, per_page: 20, total_pages: 1 });
const loading = ref(false);
const filters = ref({ type: '', price_from: null, area_from: null });

onMounted(() => loadData());
watch(() => route.query, () => loadData());

const loadData = async () => {
  loading.value = true;
  try {
    const page = parseInt(route.query.page) || 1;
    const filterParams = {};
    Object.keys(route.query).forEach(key => {
      if (key !== 'page') filterParams[key] = route.query[key];
    });
    
    const result = await api.catalog.get('parking', { page, per_page: 20, filter: filterParams });
    parkings.value = result.data || [];
    total.value = result.meta?.total || 0;
    pagination.value = result.meta || { page: 1, per_page: 20, total_pages: 1 };
  } catch (error) {
    appStore.setError(error.message);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  const cleanFilters = {};
  Object.keys(filters.value).forEach(key => {
    if (filters.value[key] !== '' && filters.value[key] !== null) cleanFilters[key] = filters.value[key];
  });
  router.push({ query: { ...cleanFilters, page: 1 } });
};

const resetFilters = () => {
  filters.value = { type: '', price_from: null, area_from: null };
  router.push({ query: {} });
};

const changePage = (page) => {
  router.push({ query: { ...route.query, page } });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>
