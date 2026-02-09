<template>
  <div class="dashboard-page">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Панель управления</h1>
      <p class="text-gray-600 mt-1">Обзор по объектам недвижимости TrendAgent</p>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div class="h-8 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        v-for="stat in stats"
        :key="stat.type"
        :title="stat.title"
        :count="stat.count"
        :color="stat.color"
        :link="stat.link"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useAppStore } from '@/stores/app';
import StatsCard from '@/components/blocks/StatsCard.vue';

const appStore = useAppStore();
const stats = ref([]);
const loading = ref(true);

const statsConfig = [
  { type: 'blocks', title: 'ЖК (Комплексы)', color: 'blue', link: '/admin/blocks' },
  { type: 'apartments', title: 'Квартиры', color: 'green', link: '/admin/apartments' },
  { type: 'parking', title: 'Паркинги', color: 'purple', link: '/admin/parking' },
  { type: 'houses', title: 'Дома', color: 'yellow', link: '/admin/houses' },
  { type: 'plots', title: 'Участки', color: 'indigo', link: '/admin/plots' },
  { type: 'commerce', title: 'Коммерция', color: 'red', link: '/admin/commerce' },
  { type: 'villages', title: 'Поселки', color: 'teal', link: '/admin/villages' },
  { type: 'house_projects', title: 'Проекты домов', color: 'pink', link: '/admin/house-projects' },
];

onMounted(async () => {
  loading.value = true;
  try {
    const promises = statsConfig.map(async (config) => {
      try {
        const result = await api.catalog.count(config.type);
        return {
          ...config,
          count: result.data?.count ?? result.count ?? 0,
        };
      } catch {
        return { ...config, count: 0 };
      }
    });
    stats.value = await Promise.all(promises);
  } catch (error) {
    appStore.setError(error?.message || 'Ошибка загрузки');
    stats.value = statsConfig.map((c) => ({ ...c, count: 0 }));
  } finally {
    loading.value = false;
  }
});
</script>
