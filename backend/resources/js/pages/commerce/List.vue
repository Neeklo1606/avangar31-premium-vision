<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-semibold">Коммерческая недвижимость</h3>
      <p class="text-sm text-gray-500">Всего: {{ total.toLocaleString('ru-RU') }}</p>
    </div>
    
    <div class="bg-white rounded-lg shadow divide-y">
      <div v-for="item in items" :key="item.id" class="p-6 hover:bg-gray-50 cursor-pointer" @click="router.push(`/admin/commerce/${item.id}`)">
        <div class="flex justify-between">
          <div>
            <h3 class="text-lg font-semibold">Помещение №{{ item.number || item.id.slice(-8) }}</h3>
            <p class="text-sm text-gray-600">{{ item.type }}</p>
            <p class="text-sm text-gray-600">{{ item.area?.formatted }}</p>
            <p v-if="item.block?.name" class="text-blue-600">{{ item.block.name }}</p>
          </div>
          <div v-if="item.price">
            <p class="text-xl font-bold">{{ item.price.formatted }}</p>
          </div>
        </div>
      </div>
      <div v-if="items.length === 0" class="p-12 text-center text-gray-500">Помещения не найдены</div>
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
const items = ref([]);
const total = ref(0);
const pagination = ref({ page: 1, per_page: 20, total_pages: 1 });

onMounted(() => loadData());
watch(() => route.query, () => loadData());

const loadData = async () => {
  try {
    const page = parseInt(route.query.page) || 1;
    const result = await api.catalog.get('commerce', { page, per_page: 20 });
    items.value = result.data || [];
    total.value = result.meta?.total || 0;
    pagination.value = result.meta || { page: 1, per_page: 20, total_pages: 1 };
  } catch (error) {
    appStore.setError(error.message);
  }
};

const changePage = (page) => router.push({ query: { page } });
</script>
