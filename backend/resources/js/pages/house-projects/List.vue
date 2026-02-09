<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-semibold">Проекты домов</h3>
      <p class="text-sm text-gray-500">Всего: {{ total.toLocaleString('ru-RU') }}</p>
    </div>
    
    <div class="bg-white rounded-lg shadow divide-y">
      <div v-for="project in projects" :key="project.id" class="p-6 hover:bg-gray-50 cursor-pointer" @click="router.push(`/admin/house-projects/${project.id}`)">
        <div class="flex items-start space-x-4">
          <div v-if="project.images?.main" class="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
            <img :src="project.images.main" :alt="project.name" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold">{{ project.name }}</h3>
            <div class="mt-2 space-y-1 text-sm text-gray-600">
              <p>Комнат: {{ project.rooms }}</p>
              <p>Этажей: {{ project.floors }}</p>
              <p>{{ project.area?.formatted }}</p>
            </div>
            <div class="flex gap-2 mt-2">
              <span v-if="project.material" class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">{{ project.material }}</span>
              <span v-if="project.style" class="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">{{ project.style }}</span>
            </div>
          </div>
          <div v-if="project.price" class="text-right">
            <p class="text-xl font-bold">{{ project.price.formatted }}</p>
          </div>
        </div>
      </div>
      <div v-if="projects.length === 0" class="p-12 text-center text-gray-500">Проекты не найдены</div>
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
const projects = ref([]);
const total = ref(0);
const pagination = ref({ page: 1, per_page: 20, total_pages: 1 });

onMounted(() => loadData());
watch(() => route.query, () => loadData());

const loadData = async () => {
  try {
    const page = parseInt(route.query.page) || 1;
    const result = await api.catalog.get('house_projects', { page, per_page: 20 });
    projects.value = result.data || [];
    total.value = result.meta?.total || 0;
    pagination.value = result.meta || { page: 1, per_page: 20, total_pages: 1 };
  } catch (error) {
    appStore.setError(error.message);
  }
};

const changePage = (page) => router.push({ query: { page } });
</script>
