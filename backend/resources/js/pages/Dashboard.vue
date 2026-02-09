<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
const loaded = ref(false);

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
  if (loaded.value) return;
  loaded.value = true;
  appStore.setLoading(true);

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
    appStore.setLoading(false);
  }
});
</script>
