<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-800">{{ count.toLocaleString('ru-RU') }}</p>
      </div>
      <div class="p-3 rounded-full" :class="iconBgClass">
        <svg class="w-8 h-8" :class="iconTextClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      </div>
    </div>
    <router-link :to="link" class="mt-4 inline-block text-sm transition" :class="linkClass">
      Смотреть все →
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
  color: { type: String, default: 'blue' },
  link: { type: String, required: true },
});

const colorMap = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', link: 'text-blue-600 hover:text-blue-800' },
  green: { bg: 'bg-green-100', text: 'text-green-600', link: 'text-green-600 hover:text-green-800' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', link: 'text-purple-600 hover:text-purple-800' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', link: 'text-yellow-600 hover:text-yellow-800' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', link: 'text-indigo-600 hover:text-indigo-800' },
  red: { bg: 'bg-red-100', text: 'text-red-600', link: 'text-red-600 hover:text-red-800' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', link: 'text-teal-600 hover:text-teal-800' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-600', link: 'text-pink-600 hover:text-pink-800' },
};

const iconBgClass = computed(() => colorMap[props.color]?.bg ?? 'bg-blue-100');
const iconTextClass = computed(() => colorMap[props.color]?.text ?? 'text-blue-600');
const linkClass = computed(() => colorMap[props.color]?.link ?? 'text-blue-600 hover:text-blue-800');
</script>
