<template>
  <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-800">{{ count.toLocaleString('ru-RU') }}</p>
      </div>
      <div :class="`p-3 bg-${color}-100 rounded-full`">
        <svg class="w-8 h-8" :class="`text-${color}-600`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      </div>
    </div>
    <router-link
      :to="link"
      :class="`mt-4 inline-block text-sm text-${color}-600 hover:text-${color}-800 transition`"
    >
      Смотреть все →
    </router-link>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: 'blue',
  },
  link: {
    type: String,
    required: true,
  },
});
</script>
