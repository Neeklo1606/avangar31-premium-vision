<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-semibold">Участки</h3>
      <p class="text-sm text-gray-500">Всего: {{ total.toLocaleString('ru-RU') }}</p>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="applyFilters" class="grid grid-cols-4 gap-4">
        <input v-model.number="filters.price_from" type="number" placeholder="Цена от" class="px-4 py-2 border rounded-lg" />
        <input v-model.number="filters.area_from" type="number" placeholder="Площадь от (сот)" class="px-4 py-2 border rounded-lg" />
        <select v-model="filters.category" class="px-4 py-2 border rounded-lg">
          <option value="">Все категории</option>
          <option value="izhs">ИЖС</option>
          <option value="snt">СНТ</option>
        </select>
        <button type="submit" class="px-6 py-2 text-white bg-blue-600 rounded-lg">Применить</button>
      </form>
    </div>
    
    <div class="bg-white rounded-lg shadow divide-y">
      <div v-for="plot in plots" :key="plot.id" class="p-6 hover:bg-gray-50 cursor-pointer" @click="router.push(`/admin/plots/${plot.id}`)">
        <div class="flex justify-between">
          <div>
            <h3 class="text-lg font-semibold">Участок №{{ plot.number || plot.id.slice(-8) }}</h3>
            <p class="text-sm text-gray-600">{{ plot.area?.formatted }}</p>
            <p class="text-sm text-gray-600">{{ plot.category }}</p>
            <p v-if="plot.village?.name" class="text-blue-600 mt-1">{{ plot.village.name }}</p>
          </div>
          <div v-if="plot.price">
            <p class="text-xl font-bold">{{ plot.price.formatted }}</p>
          </div>
        </div>
      </div>
      <div v-if="plots.length === 0" class="p-12 text-center text-gray-500">Участки не найдены</div>
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
const plots = ref([]);
const total = ref(0);
const pagination = ref({ page: 1, per_page: 20, total_pages: 1 });
const filters = ref({ price_from: null, area_from: null, category: '' });

onMounted(() => loadData());
watch(() => route.query, () => loadData());

const loadData = async () => {
  try {
    const page = parseInt(route.query.page) || 1;
    const filterParams = {};
    Object.keys(route.query).forEach(key => { if (key !== 'page') filterParams[key] = route.query[key]; });
    const result = await api.catalog.get('plots', { page, per_page: 20, filter: filterParams });
    plots.value = result.data || [];
    total.value = result.meta?.total || 0;
    pagination.value = result.meta || { page: 1, per_page: 20, total_pages: 1 };
  } catch (error) {
    appStore.setError(error.message);
  }
};

const applyFilters = () => {
  const clean = {};
  Object.keys(filters.value).forEach(k => { if (filters.value[k]) clean[k] = filters.value[k]; });
  router.push({ query: { ...clean, page: 1 } });
};

const changePage = (page) => router.push({ query: { ...route.query, page } });
</script>
