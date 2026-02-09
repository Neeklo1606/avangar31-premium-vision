<template>
  <div class="space-y-6">
    <!-- Header Stats -->
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-semibold text-gray-900">Квартиры</h3>
      <p class="text-sm text-gray-500">Всего найдено: {{ total.toLocaleString('ru-RU') }}</p>
    </div>
    
    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="applyFilters" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Комнаты -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Комнат</label>
            <select
              v-model="filters.rooms"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Все</option>
              <option value="0">Студия</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4+</option>
            </select>
          </div>
          
          <!-- Цена от -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Цена от (₽)</label>
            <input
              v-model.number="filters.price_from"
              type="number"
              placeholder="От..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <!-- Площадь от -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Площадь от (м²)</label>
            <input
              v-model.number="filters.area_from"
              type="number"
              placeholder="От..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <!-- Этаж от -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Этаж от</label>
            <input
              v-model.number="filters.floor_from"
              type="number"
              placeholder="От..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            @click="resetFilters"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Сбросить
          </button>
          <button type="submit" class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Применить
          </button>
        </div>
      </form>
    </div>
    
    <!-- List -->
    <div class="bg-white rounded-lg shadow divide-y divide-gray-200">
      <div
        v-for="apartment in apartments"
        :key="apartment.id"
        class="p-6 hover:bg-gray-50 cursor-pointer transition"
        @click="router.push(`/admin/apartments/${apartment.id}`)"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">{{ apartment.rooms.label }}</h3>
            <div class="mt-2 space-y-1 text-sm text-gray-600">
              <p>Этаж: {{ apartment.floor }} / {{ apartment.floors_total }}</p>
              <p>Площадь: {{ apartment.area.total?.formatted }}</p>
              <p v-if="apartment.block?.name" class="text-blue-600">ЖК: {{ apartment.block.name }}</p>
            </div>
            <div class="flex gap-2 mt-3">
              <span v-if="apartment.is_available" class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                Доступно
              </span>
              <span v-if="apartment.decoration" class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                {{ apartment.decoration }}
              </span>
            </div>
          </div>
          <div v-if="apartment.price" class="text-right">
            <p class="text-2xl font-bold text-gray-900">{{ apartment.price.formatted }}</p>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="apartments.length === 0 && !loading" class="p-12 text-center text-gray-500">
        <p class="text-lg">Квартиры не найдены</p>
      </div>
    </div>
    
    <!-- Pagination -->
    <Pagination
      v-if="pagination.total_pages > 1"
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
import Pagination from '@/components/ui/Pagination.vue';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const apartments = ref([]);
const total = ref(0);
const pagination = ref({ page: 1, per_page: 20, total_pages: 1 });
const loading = ref(false);

const filters = ref({
  rooms: route.query.rooms || '',
  price_from: route.query.price_from || null,
  area_from: route.query.area_from || null,
  floor_from: route.query.floor_from || null,
});

onMounted(() => loadApartments());
watch(() => route.query, () => loadApartments());

const loadApartments = async () => {
  loading.value = true;
  try {
    const page = parseInt(route.query.page) || 1;
    const filterParams = {};
    Object.keys(route.query).forEach(key => {
      if (key !== 'page') filterParams[key] = route.query[key];
    });
    
    const result = await api.catalog.get('apartments', {
      page,
      per_page: 20,
      filter: filterParams,
    });
    
    apartments.value = result.data || [];
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
    if (filters.value[key] !== '' && filters.value[key] !== null) {
      cleanFilters[key] = filters.value[key];
    }
  });
  router.push({ query: { ...cleanFilters, page: 1 } });
};

const resetFilters = () => {
  filters.value = { rooms: '', price_from: null, area_from: null, floor_from: null };
  router.push({ query: {} });
};

const changePage = (page) => {
  router.push({ query: { ...route.query, page } });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>
