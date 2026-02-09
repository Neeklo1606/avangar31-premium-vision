# VUE.JS ADMIN PANEL - ПОЛНОЕ РУКОВОДСТВО

**Дата:** 09.02.2026  
**Статус:** НАСТРОЕН (База готова)  
**Stack:** Laravel 11 + Vue 3 + Vite + Pinia + Vue Router + Tailwind CSS

---

## ✅ ЧТО УЖЕ СДЕЛАНО

### 1. Установлены пакеты
```bash
npm install vue@latest vue-router@latest pinia axios
npm install @vitejs/plugin-vue @heroicons/vue
```

### 2. Настроен Vite (`vite.config.js`)
- ✅ Vue 3 plugin
- ✅ Tailwind CSS
- ✅ Alias `@` → `/resources/js`

### 3. Создана структура Vue приложения
```
resources/js/
├── App.vue                          ✅ Главный компонент
├── app.js                           ✅ Entry point
├── layouts/
│   └── AdminLayout.vue              ✅ Layout с sidebar
├── router/
│   └── index.js                     ✅ Vue Router с маршрутами
├── stores/
│   └── app.js                       ✅ Pinia store
└── services/
    └── api.js                       ✅ API service
```

### 4. Реализованные функции
- ✅ Vue Router с 16 маршрутами (Dashboard + 8 типов × 2 страницы)
- ✅ Pinia store для управления состоянием
- ✅ API service с axios interceptors
- ✅ AdminLayout с sidebar навигацией
- ✅ Выбор города (localStorage)
- ✅ Loading states
- ✅ Error handling

---

## 📁 ФАЙЛОВАЯ СТРУКТУРА

```
backend/
├── resources/
│   ├── js/
│   │   ├── App.vue                  ✅ СОЗДАН
│   │   ├── app.js                   ✅ СОЗДАН
│   │   ├── layouts/
│   │   │   └── AdminLayout.vue      ✅ СОЗДАН
│   │   ├── router/
│   │   │   └── index.js             ✅ СОЗДАН
│   │   ├── stores/
│   │   │   └── app.js               ✅ СОЗДАН
│   │   ├── services/
│   │   │   └── api.js               ✅ СОЗДАН
│   │   ├── pages/                   ❌ СОЗДАТЬ
│   │   │   ├── Dashboard.vue
│   │   │   ├── blocks/
│   │   │   │   ├── List.vue
│   │   │   │   └── Detail.vue
│   │   │   ├── apartments/
│   │   │   │   ├── List.vue
│   │   │   │   └── Detail.vue
│   │   │   └── ... (остальные типы)
│   │   └── components/              ❌ СОЗДАТЬ
│   │       ├── ui/
│   │       │   ├── Button.vue
│   │       │   ├── Card.vue
│   │       │   ├── Input.vue
│   │       │   └── Pagination.vue
│   │       └── blocks/
│   │           ├── FilterPanel.vue
│   │           ├── BlockCard.vue
│   │           └── StatsCard.vue
│   └── views/
│       └── admin.blade.php          ❌ СОЗДАТЬ
└── vite.config.js                   ✅ ОБНОВЛЁН
```

---

## 🚀 СЛЕДУЮЩИЕ ШАГИ

### ШАГ 1: Создать главный Blade файл

**Файл:** `resources/views/admin.blade.php`

```blade
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TrendAgent Admin</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

### ШАГ 2: Обновить routes/web.php

```php
Route::get('/admin{any}', function () {
    return view('admin');
})->where('any', '.*');
```

### ШАГ 3: Создать Dashboard компонент

**Файл:** `resources/js/pages/Dashboard.vue`

```vue
<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Карточка статистики для каждого типа -->
      <StatsCard
        v-for="stat in stats"
        :key="stat.type"
        :title="stat.title"
        :count="stat.count"
        :icon="stat.icon"
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

onMounted(async () => {
  appStore.setLoading(true);
  
  try {
    // Загрузка статистики для всех типов
    const types = ['blocks', 'apartments', 'parking', 'houses', 'plots', 'commerce', 'villages', 'house_projects'];
    
    const promises = types.map(async (type) => {
      const result = await api.catalog.count(type);
      return {
        type,
        title: getTitleByType(type),
        count: result.data.count,
        icon: getIconByType(type),
        color: getColorByType(type),
        link: `/admin/${type}`,
      };
    });
    
    stats.value = await Promise.all(promises);
  } catch (error) {
    appStore.setError(error.message);
  } finally {
    appStore.setLoading(false);
  }
});

function getTitleByType(type) {
  const titles = {
    blocks: 'ЖК (Комплексы)',
    apartments: 'Квартиры',
    parking: 'Паркинги',
    houses: 'Дома',
    plots: 'Участки',
    commerce: 'Коммерция',
    villages: 'Поселки',
    house_projects: 'Проекты домов',
  };
  return titles[type] || type;
}

function getIconByType(type) {
  // Возвращает название иконки
  return 'HomeIcon';
}

function getColorByType(type) {
  const colors = {
    blocks: 'blue',
    apartments: 'green',
    parking: 'purple',
    houses: 'yellow',
    plots: 'indigo',
    commerce: 'red',
    villages: 'teal',
    house_projects: 'pink',
  };
  return colors[type] || 'gray';
}
</script>
```

### ШАГ 4: Создать компоненты UI

**1. StatsCard.vue**

```vue
<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-800">{{ count.toLocaleString() }}</p>
      </div>
      <div :class="`p-3 bg-${color}-100 rounded-full`">
        <component :is="icon" class="w-8 h-8" :class="`text-${color}-600`" />
      </div>
    </div>
    <router-link
      :to="link"
      :class="`mt-4 text-sm text-${color}-600 hover:text-${color}-800`"
    >
      Смотреть все →
    </router-link>
  </div>
</template>

<script setup>
import { HomeIcon, BuildingOfficeIcon, /* другие иконки */ } from '@heroicons/vue/24/outline';

defineProps({
  title: String,
  count: Number,
  icon: String,
  color: String,
  link: String,
});
</script>
```

**2. BlockCard.vue** (для списка ЖК)

```vue
<template>
  <div class="p-6 hover:bg-gray-50 transition cursor-pointer" @click="goToDetail">
    <div class="flex items-start space-x-4">
      <!-- Image -->
      <div class="flex-shrink-0 w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
        <img
          v-if="block.images?.main"
          :src="block.images.main"
          :alt="block.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      </div>
      
      <!-- Info -->
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 hover:text-blue-600">
          {{ block.name }}
        </h3>
        
        <p v-if="block.location?.address" class="text-sm text-gray-500 mt-1">
          📍 {{ block.location.address }}
        </p>
        
        <p v-if="block.short_description" class="text-sm text-gray-600 mt-2 line-clamp-2">
          {{ block.short_description }}
        </p>
        
        <!-- Stats -->
        <div class="flex flex-wrap gap-4 mt-4 text-sm">
          <span v-if="block.class" class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
            {{ block.class }}
          </span>
          <span v-if="block.status" class="px-3 py-1 bg-green-50 text-green-700 rounded-full">
            {{ block.status }}
          </span>
          <span v-if="block.stats?.total_apartments">
            🏠 Квартир: {{ block.stats.total_apartments }}
          </span>
        </div>
      </div>
      
      <!-- Price -->
      <div v-if="block.price?.from" class="text-right">
        <p class="text-sm text-gray-500">от</p>
        <p class="text-xl font-bold text-gray-900">
          {{ block.price.from.formatted }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  block: Object,
});

const router = useRouter();

const goToDetail = () => {
  router.push(`/admin/blocks/${props.block.id}`);
};
</script>
```

**3. FilterPanel.vue** (панель фильтров)

```vue
<template>
  <div class="bg-white rounded-lg shadow p-6">
    <form @submit.prevent="applyFilters" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Поиск -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Поиск</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Название..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <!-- Класс -->
        <div v-if="dictionaries.class">
          <label class="block text-sm font-medium text-gray-700 mb-2">Класс</label>
          <select
            v-model="filters.class"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Все</option>
            <option
              v-for="item in dictionaries.class"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
        </div>
        
        <!-- Цена от -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Цена от (₽)</label>
          <input
            v-model.number="filters.price_from"
            type="number"
            placeholder="От..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <!-- Цена до -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Цена до (₽)</label>
          <input
            v-model.number="filters.price_to"
            type="number"
            placeholder="До..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <button
          type="submit"
          class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Применить
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  dictionaries: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['apply', 'reset']);

const filters = reactive({
  search: '',
  class: '',
  price_from: null,
  price_to: null,
});

const applyFilters = () => {
  emit('apply', filters);
};

const resetFilters = () => {
  filters.search = '';
  filters.class = '';
  filters.price_from = null;
  filters.price_to = null;
  emit('reset');
};
</script>
```

### ШАГ 5: Создать страницу списка ЖК

**Файл:** `resources/js/pages/blocks/List.vue`

```vue
<template>
  <div class="space-y-6">
    <!-- Фильтры -->
    <FilterPanel
      :dictionaries="dictionaries"
      @apply="applyFilters"
      @reset="resetFilters"
    />
    
    <!-- Список ЖК -->
    <div class="bg-white rounded-lg shadow divide-y divide-gray-200">
      <BlockCard
        v-for="block in blocks"
        :key="block.id"
        :block="block"
      />
      
      <!-- Empty State -->
      <div v-if="blocks.length === 0" class="p-12 text-center text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
        <p class="text-lg">ЖК не найдены</p>
        <p class="text-sm mt-2">Попробуйте изменить параметры фильтрации</p>
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';
import { useAppStore } from '@/stores/app';
import FilterPanel from '@/components/blocks/FilterPanel.vue';
import BlockCard from '@/components/blocks/BlockCard.vue';
import Pagination from '@/components/ui/Pagination.vue';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const blocks = ref([]);
const total = ref(0);
const pagination = ref({});
const dictionaries = ref({});
const currentFilters = ref({});

onMounted(async () => {
  await loadDictionaries();
  await loadBlocks();
});

const loadDictionaries = async () => {
  try {
    const result = await api.dictionaries.getAll('blocks');
    dictionaries.value = result.data;
  } catch (error) {
    console.error('Error loading dictionaries:', error);
  }
};

const loadBlocks = async () => {
  appStore.setLoading(true);
  
  try {
    const page = parseInt(route.query.page) || 1;
    const filters = {
      ...currentFilters.value,
      ...route.query,
    };
    
    const result = await api.catalog.get('blocks', {
      page,
      per_page: 20,
      filter: filters,
    });
    
    blocks.value = result.data;
    total.value = result.meta.total;
    pagination.value = result.meta;
  } catch (error) {
    appStore.setError(error.message);
  } finally {
    appStore.setLoading(false);
  }
};

const applyFilters = (filters) => {
  currentFilters.value = filters;
  router.push({ query: { ...filters, page: 1 } });
  loadBlocks();
};

const resetFilters = () => {
  currentFilters.value = {};
  router.push({ query: {} });
  loadBlocks();
};

const changePage = (page) => {
  router.push({ query: { ...route.query, page } });
  loadBlocks();
};
</script>
```

---

## 🔧 ЗАПУСК И РАЗРАБОТКА

### 1. Запустить Vite dev server

```bash
cd backend
npm run dev
```

### 2. Запустить Laravel сервер

```bash
php artisan serve
```

### 3. Открыть браузер

```
http://localhost:8000/admin
```

---

## 📋 TODO LIST

### Высокий приоритет
- [ ] Создать `resources/views/admin.blade.php`
- [ ] Создать все page компоненты (Dashboard, List, Detail для каждого типа)
- [ ] Создать UI компоненты (Button, Card, Input, Pagination)
- [ ] Создать компоненты для каждого типа объектов

### Средний приоритет
- [ ] Добавить детальные страницы с табами
- [ ] Добавить галерею изображений
- [ ] Добавить карту (Yandex Maps / Google Maps)
- [ ] Добавить экспорт в Excel/CSV

### Низкий приоритет
- [ ] Добавить тёмную тему
- [ ] Добавить локализацию
- [ ] Добавить избранное
- [ ] Добавить сравнение объектов

---

## 📚 ПОЛЕЗНЫЕ КОМАНДЫ

```bash
# Установить зависимости
npm install

# Запустить dev server
npm run dev

# Собрать для production
npm run build

# Запустить Laravel
php artisan serve

# Очистить кэш
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

---

## 🎯 ИТОГ

**Что готово:**
- ✅ Vue 3 + Vite настроены
- ✅ Vue Router с маршрутами
- ✅ Pinia store
- ✅ API service
- ✅ AdminLayout с навигацией
- ✅ Структура файлов

**Что нужно сделать:**
- ❌ Создать все page компоненты
- ❌ Создать все UI компоненты
- ❌ Создать Blade entry point
- ❌ Протестировать

**Время разработки (оценка):**
- Базовая настройка: ✅ 3 часа (выполнено)
- Все page компоненты: ~8-10 часов
- UI компоненты: ~4-6 часов
- Тестирование и доработка: ~2-3 часа
- **Итого:** ~17-22 часа

---

**Автор:** TrendAgent Architecture Team  
**Дата:** 09.02.2026  
**Версия:** 1.0  
**Статус:** ⚠️ БАЗОВАЯ НАСТРОЙКА ГОТОВА, ТРЕБУЕТСЯ СОЗДАНИЕ КОМПОНЕНТОВ
