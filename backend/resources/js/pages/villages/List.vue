<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-semibold">Поселки</h3>
      <p class="text-sm text-gray-500">Всего: {{ total.toLocaleString('ru-RU') }}</p>
    </div>
    
    <div class="bg-white rounded-lg shadow divide-y">
      <div v-for="village in villages" :key="village.id" class="p-6 hover:bg-gray-50 cursor-pointer" @click="router.push(`/admin/villages/${village.id}`)">
        <div class="flex items-start space-x-4">
          <div v-if="village.images?.main" class="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
            <img :src="village.images.main" :alt="village.name" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold">{{ village.name }}</h3>
            <p v-if="village.location?.address" class="text-sm text-gray-500 mt-1">{{ village.location.address }}</p>
            <div class="flex gap-2 mt-2">
              <span v-if="village.class" class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">{{ village.class }}</span>
              <span v-if="village.stats?.total_plots" class="text-sm text-gray-600">Участков: {{ village.stats.total_plots }}</span>
            </div>
          </div>
          <div v-if="village.price?.from" class="text-right">
            <p class="text-sm text-gray-500">от</p>
            <p class="text-xl font-bold">{{ village.price.from.formatted }}</p>
          </div>
        </div>
      </div>
      <div v-if="villages.length === 0" class="p-12 text-center text-gray-500">Поселки не найдены</div>
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
const villages = ref([]);
const total = ref(0);
const pagination = ref({ page: 1, per_page: 20, total_pages: 1 });

onMounted(() => loadData());
watch(() => route.query, () => loadData());

const loadData = async () => {
  try {
    const page = parseInt(route.query.page) || 1;
    const result = await api.catalog.get('villages', { page, per_page: 20 });
    villages.value = result.data || [];
    total.value = result.meta?.total || 0;
    pagination.value = result.meta || { page: 1, per_page: 20, total_pages: 1 };
  } catch (error) {
    appStore.setError(error.message);
  }
};

const changePage = (page) => router.push({ query: { page } });
</script>
