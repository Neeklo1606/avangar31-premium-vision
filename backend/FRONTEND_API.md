# FRONTEND API DOCUMENTATION

## 📋 ОПИСАНИЕ

Стабильный API-контракт для фронтенда (React / Telegram MiniApp / Mobile).

**Ключевые принципы:**
- ❌ Entity НЕ возвращаются напрямую
- ✅ Стабильный контракт через API Resources
- ✅ Версионирование через URL
- ✅ JSON Schema для валидации

---

## 🔗 BASE URL

```
Production:  https://api.yourdomain.com/api/trendagent
Development: http://localhost:8000/api/trendagent
```

---

## 📦 ОБЩАЯ СТРУКТУРА ОТВЕТОВ

### Catalog Response

```json
{
  "data": [
    {
      "id": "123",
      "name": "Название",
      "price": {
        "value": 5000000,
        "currency": "RUB",
        "formatted": "5 000 000 ₽"
      },
      ...
    }
  ],
  "meta": {
    "total": 353,
    "page": 1,
    "per_page": 20,
    "total_pages": 18,
    "has_more": true,
    "object_type": "blocks",
    "city": "58c665588b6aa52311afa01b"
  },
  "filters": {
    "price_from": 1000000,
    "rooms": [2, 3]
  },
  "dictionaries": {
    "districts": [...],
    "metro": [...]
  }
}
```

### Detail Response

```json
{
  "data": {
    "id": "123",
    "name": "Название",
    "description": "Полное описание",
    "price": {...},
    "area": {...},
    "location": {...},
    ...
  },
  "media": {
    "photos": [...],
    "videos": [...],
    "plans": [...],
    "has_content": true
  },
  "related": {
    "apartments": [...],
    "parking": [...]
  },
  "meta": {
    "object_type": "blocks",
    "id": "123",
    "is_complete": true,
    "failed_endpoints": []
  }
}
```

---

## 🏗 ТИПЫ ОБЪЕКТОВ

| Type | Description | Example |
|------|-------------|---------|
| `blocks` | ЖК (Жилые комплексы) | GET /catalog/blocks |
| `apartments` | Квартиры | GET /catalog/apartments |
| `parking` | Паркинги | GET /catalog/parking |
| `houses` | Дома | GET /catalog/houses |
| `plots` | Участки | GET /catalog/plots |
| `commerce` | Коммерческая недвижимость | GET /catalog/commerce |
| `house_projects` | Проекты домов | GET /catalog/house_projects |
| `villages` | Поселки | GET /catalog/villages |

---

## 📡 CATALOG ENDPOINTS

### GET /catalog/{type}

Получить список объектов определенного типа.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Номер страницы (default: 1) |
| `per_page` | integer | No | Количество на странице (default: 20, max: 100) |
| `filter[*]` | mixed | No | Фильтры (см. раздел Filters) |
| `with_dictionaries` | boolean | No | Включить справочники в ответ |

**Examples:**

```http
# Все ЖК
GET /api/trendagent/catalog/blocks

# Квартиры с фильтрами
GET /api/trendagent/catalog/apartments?filter[rooms]=2&filter[price_from]=5000000&page=1&per_page=50

# Паркинги в конкретном ЖК
GET /api/trendagent/catalog/parking?filter[block_id]=59fc27538bcb2468a6174402

# Дома со справочниками
GET /api/trendagent/catalog/houses?with_dictionaries=true
```

**Response:**

```json
{
  "data": [
    {
      "id": "59fc27538bcb2468a6174402",
      "guid": "d290f1ee-6c54-4b01-90e6-d701748f0851",
      "name": "Villa Marina",
      "slug": "villa-marina",
      "description": "Элитный жилой комплекс...",
      "price": {
        "from": {
          "value": 5000000,
          "currency": "RUB",
          "formatted": "5 000 000 ₽"
        },
        "to": {
          "value": 15000000,
          "currency": "RUB",
          "formatted": "15 000 000 ₽"
        },
        "has_range": true
      },
      "area": {
        "from": {
          "value": 40.5,
          "unit": "м²",
          "formatted": "40.5 м²"
        },
        "to": {
          "value": 120.0,
          "unit": "м²",
          "formatted": "120.0 м²"
        },
        "has_range": true
      },
      "location": {
        "coordinates": {
          "lat": 59.9342802,
          "lng": 30.3350986
        },
        "address": "Санкт-Петербург, Приморский район",
        "district": "Приморский",
        "metro": [
          {
            "name": "Комендантский проспект",
            "line": "Фиолетовая",
            "distance": 1500
          }
        ]
      },
      "developer": {
        "id": "dev123",
        "name": "ПСК",
        "logo": "https://..."
      },
      "class": "comfort",
      "type": "residential",
      "stats": {
        "total_apartments": 352,
        "available_apartments": 127,
        "total_buildings": 3,
        "floors_min": 10,
        "floors_max": 25
      },
      "status": "in_progress",
      "deadline": "2025-12-31T00:00:00Z",
      "images": {
        "main": "https://...",
        "gallery": ["https://...", "https://..."]
      },
      "created_at": "2023-01-15T10:30:00Z",
      "updated_at": "2024-02-09T15:00:00Z"
    }
  ],
  "meta": {
    "total": 353,
    "page": 1,
    "per_page": 20,
    "total_pages": 18,
    "has_more": true,
    "object_type": "blocks",
    "city": "58c665588b6aa52311afa01b"
  },
  "filters": {},
  "dictionaries": null
}
```

---

### GET /catalog/{type}/count

Получить только количество объектов (без данных).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filter[*]` | mixed | No | Фильтры |

**Example:**

```http
GET /api/trendagent/catalog/apartments/count?filter[rooms]=2&filter[price_from]=5000000
```

**Response:**

```json
{
  "success": true,
  "data": {
    "count": 1523,
    "type": "apartments",
    "filters": {
      "rooms": 2,
      "price_from": 5000000
    }
  }
}
```

---

### POST /catalog/search

Поиск по нескольким типам объектов одновременно.

**Body:**

```json
{
  "types": ["blocks", "apartments"],
  "filters": {
    "price_from": 1000000,
    "price_to": 10000000
  },
  "page": 1,
  "per_page": 20
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "blocks": {
      "items": [...],
      "total": 45,
      "pagination": {...}
    },
    "apartments": {
      "items": [...],
      "total": 1234,
      "pagination": {...}
    }
  }
}
```

---

## 🔍 DETAIL ENDPOINTS

### GET /{type}/{id}

Получить детальную информацию по ID.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `with_media` | boolean | No | Загрузить медиа (default: false) |
| `with_aggregation` | boolean | No | Использовать агрегацию (default: true) |

**Examples:**

```http
# Детали ЖК
GET /api/trendagent/blocks/59fc27538bcb2468a6174402

# Квартира с медиа
GET /api/trendagent/apartments/63c5614728d3bcf2420860b1?with_media=true

# Без агрегации (только основной endpoint)
GET /api/trendagent/blocks/59fc27538bcb2468a6174402?with_aggregation=false
```

**Response:**

```json
{
  "data": {
    "id": "59fc27538bcb2468a6174402",
    "guid": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "name": "Villa Marina",
    "slug": "villa-marina",
    "description": "Полное описание жилого комплекса...",
    "short_description": "Краткое описание...",
    "price": {
      "from": {...},
      "to": {...},
      "has_range": true
    },
    "area": {
      "from": {...},
      "to": {...},
      "has_range": true
    },
    "location": {
      "coordinates": {
        "lat": 59.9342802,
        "lng": 30.3350986
      },
      "address": "Санкт-Петербург, Приморский район",
      "district": "Приморский",
      "metro": [...]
    },
    "developer": {
      "id": "dev123",
      "name": "ПСК",
      "logo": "https://..."
    },
    "class": "comfort",
    "type": "residential",
    "stats": {
      "total_apartments": 352,
      "available_apartments": 127,
      "total_buildings": 3
    },
    "status": "in_progress",
    "deadline": "2025-12-31T00:00:00Z",
    "contact": {
      "phone": "+7 (812) 123-45-67",
      "email": "sales@villa-marina.ru",
      "website": "https://villa-marina.ru"
    },
    "features": ["Детская площадка", "Парковка", "Консьерж"],
    "advantages": ["Близко к метро", "Развитая инфраструктура"],
    "images": {
      "main": "https://...",
      "gallery": ["https://...", "https://..."]
    },
    "created_at": "2023-01-15T10:30:00Z",
    "updated_at": "2024-02-09T15:00:00Z"
  },
  "media": {
    "photos": [
      {
        "url": "https://...",
        "title": "Фасад",
        "order": 1
      }
    ],
    "videos": [
      {
        "url": "https://...",
        "title": "Видео обзор",
        "thumbnail": "https://..."
      }
    ],
    "documents": [
      {
        "url": "https://...",
        "title": "Планировки.pdf",
        "type": "pdf"
      }
    ],
    "plans": [...],
    "progress": [...],
    "has_content": true
  },
  "related": {
    "apartments": [...],
    "parking": [...]
  },
  "meta": {
    "object_type": "blocks",
    "id": "59fc27538bcb2468a6174402",
    "is_complete": true,
    "failed_endpoints": [],
    "dictionaries_used": ["districts", "metro"]
  }
}
```

---

### GET /{type}/by-slug/{slug}

Получить детальную информацию по slug (человекочитаемому URL).

**Example:**

```http
GET /api/trendagent/blocks/by-slug/villa-marina
```

**Response:** Аналогичен GET /{type}/{id}

---

### GET /{type}/{id}/media

Получить только медиа для объекта.

**Example:**

```http
GET /api/trendagent/blocks/59fc27538bcb2468a6174402/media
```

**Response:**

```json
{
  "success": true,
  "data": {
    "photos": [...],
    "videos": [...],
    "documents": [...],
    "plans": [...],
    "progress": [...],
    "has_content": true
  }
}
```

---

### POST /{type}/batch

Batch получение детальной информации по нескольким ID.

**Body:**

```json
{
  "ids": ["id1", "id2", "id3"],
  "with_aggregation": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id1": {
      "success": true,
      "entity": {...},
      "related": {...}
    },
    "id2": {
      "success": false,
      "error": "Not found"
    },
    "id3": {
      "success": true,
      "entity": {...}
    }
  }
}
```

---

## 📚 DICTIONARIES ENDPOINTS

### GET /dictionaries/{type}

Получить все справочники для типа объекта.

**Example:**

```http
GET /api/trendagent/dictionaries/blocks
```

**Response:**

```json
{
  "success": true,
  "data": {
    "districts": [
      {"id": "1", "name": "Приморский"},
      {"id": "2", "name": "Невский"}
    ],
    "metro": [...],
    "class": [
      {"value": "economy", "label": "Эконом"},
      {"value": "comfort", "label": "Комфорт"},
      {"value": "business", "label": "Бизнес"},
      {"value": "elite", "label": "Элитный"}
    ]
  }
}
```

---

### GET /dictionaries/{type}/{key}

Получить конкретный справочник.

**Example:**

```http
GET /api/trendagent/dictionaries/apartments/rooms
```

**Response:**

```json
{
  "success": true,
  "data": {
    "key": "rooms",
    "values": [
      {"value": 1, "label": "1-комнатная"},
      {"value": 2, "label": "2-комнатная"},
      {"value": 3, "label": "3-комнатная"},
      {"value": 0, "label": "Студия"}
    ]
  }
}
```

---

## 🎯 FILTERS

Фильтры передаются через query параметры с префиксом `filter[*]`.

### Общие фильтры

| Filter | Type | Description | Example |
|--------|------|-------------|---------|
| `price_from` | integer | Цена от | `filter[price_from]=5000000` |
| `price_to` | integer | Цена до | `filter[price_to]=10000000` |
| `area_from` | float | Площадь от | `filter[area_from]=40.5` |
| `area_to` | float | Площадь до | `filter[area_to]=100` |
| `district` | string | Район | `filter[district]=Primorsky` |

### Фильтры для apartments

| Filter | Type | Description | Example |
|--------|------|-------------|---------|
| `rooms` | array | Комнаты | `filter[rooms][]=1&filter[rooms][]=2` |
| `floor_from` | integer | Этаж от | `filter[floor_from]=5` |
| `floor_to` | integer | Этаж до | `filter[floor_to]=15` |
| `block_id` | string | ID ЖК | `filter[block_id]=123` |

### Фильтры для blocks

| Filter | Type | Description | Example |
|--------|------|-------------|---------|
| `class` | string | Класс | `filter[class]=comfort` |
| `status` | string | Статус | `filter[status]=in_progress` |
| `deadline_from` | string | Срок сдачи от | `filter[deadline_from]=2025-01-01` |

---

## 📖 ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ

### React (fetch)

```javascript
// Получить каталог ЖК
async function getBlocks(page = 1) {
  const response = await fetch(
    `${API_BASE}/catalog/blocks?page=${page}&per_page=20`,
    {
      headers: {
        'Accept': 'application/json',
      }
    }
  );
  
  const data = await response.json();
  return data;
}

// Получить детали ЖК
async function getBlockDetail(id) {
  const response = await fetch(
    `${API_BASE}/blocks/${id}?with_media=true`,
    {
      headers: {
        'Accept': 'application/json',
      }
    }
  );
  
  const data = await response.json();
  return data;
}

// Поиск с фильтрами
async function searchApartments(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(`filter[${key}][]`, v));
    } else {
      params.append(`filter[${key}]`, value);
    }
  });
  
  const response = await fetch(
    `${API_BASE}/catalog/apartments?${params.toString()}`,
    {
      headers: {
        'Accept': 'application/json',
      }
    }
  );
  
  return await response.json();
}

// Использование
const blocks = await getBlocks(1);
console.log(`Всего ЖК: ${blocks.meta.total}`);
console.log(`Объектов: ${blocks.data.length}`);

const detail = await getBlockDetail('59fc27538bcb2468a6174402');
console.log(`Название: ${detail.data.name}`);
console.log(`Цена от: ${detail.data.price.from.formatted}`);

const apartments = await searchApartments({
  rooms: [2, 3],
  price_from: 5000000,
  price_to: 10000000
});
```

---

### React (axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/trendagent',
  headers: {
    'Accept': 'application/json',
  }
});

// Получить каталог
export const getCatalog = async (type, filters = {}, page = 1, perPage = 20) => {
  const params = { page, per_page: perPage };
  
  Object.entries(filters).forEach(([key, value]) => {
    params[`filter[${key}]`] = value;
  });
  
  const { data } = await api.get(`/catalog/${type}`, { params });
  return data;
};

// Получить детали
export const getDetail = async (type, id, withMedia = true) => {
  const { data } = await api.get(`/${type}/${id}`, {
    params: { with_media: withMedia }
  });
  return data;
};

// Использование
const blocks = await getCatalog('blocks', {}, 1, 20);
const apartment = await getDetail('apartments', '63c5614728d3bcf2420860b1', true);
```

---

### Telegram MiniApp

```javascript
// В Telegram MiniApp используется Telegram.WebApp API
import { WebApp } from '@twa-dev/sdk';

const API_BASE = 'https://api.yourdomain.com/api/trendagent';

// Telegram WebApp готов
WebApp.ready();

// Получить каталог
async function getCatalog(type, page = 1) {
  WebApp.MainButton.showProgress();
  
  try {
    const response = await fetch(
      `${API_BASE}/catalog/${type}?page=${page}`,
      {
        headers: {
          'Accept': 'application/json',
          // Можно передать данные пользователя Telegram
          'X-Telegram-Init-Data': WebApp.initData
        }
      }
    );
    
    const data = await response.json();
    return data;
  } catch (error) {
    WebApp.showAlert('Ошибка загрузки данных');
    throw error;
  } finally {
    WebApp.MainButton.hideProgress();
  }
}

// Открыть детали в новом окне
function openDetail(type, id) {
  const url = `${API_BASE}/${type}/${id}`;
  WebApp.openLink(url);
}

// Использование
const blocks = await getCatalog('blocks', 1);
WebApp.MainButton.setText(`Найдено ЖК: ${blocks.meta.total}`);
WebApp.MainButton.onClick(() => {
  // Переход на следующую страницу
  loadNextPage();
});
```

---

## 📄 JSON SCHEMA

Схемы доступны для валидации ответов:

- **Catalog:** `GET /schemas/catalog.schema.json`
- **Detail:** `GET /schemas/detail.schema.json`

Использование в TypeScript:

```typescript
import catalogSchema from './schemas/catalog.schema.json';
import { Validator } from 'jsonschema';

const validator = new Validator();
const result = validator.validate(apiResponse, catalogSchema);

if (!result.valid) {
  console.error('Invalid API response:', result.errors);
}
```

---

## ⚠️ ERROR HANDLING

### Error Response Format

```json
{
  "success": false,
  "error": "Not found",
  "message": "Object with slug 'villa-marina' not found"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request (invalid object type, invalid filters) |
| `404` | Not Found |
| `500` | Internal Server Error |

---

## 🔄 ВЕРСИОНИРОВАНИЕ

API версионируется через URL:

```
v1: /api/trendagent/...  (текущая)
v2: /api/v2/trendagent/... (будущая)
```

---

## 📊 RATE LIMITING

```
Limit: 1000 requests/hour
Headers:
  X-RateLimit-Limit: 1000
  X-RateLimit-Remaining: 999
  X-RateLimit-Reset: 1707494400
```

---

## ✅ CHECKLIST ДЛЯ ФРОНТЕНД-РАЗРАБОТЧИКА

- [ ] Использовать TypeScript для типобезопасности
- [ ] Валидировать ответы по JSON Schema
- [ ] Обрабатывать `meta.has_more` для пагинации
- [ ] Проверять `meta.is_complete` для детальных страниц
- [ ] Кэшировать `dictionaries` локально
- [ ] Использовать `slug` для SEO-friendly URL
- [ ] Обрабатывать `location.coordinates` для карт
- [ ] Форматировать цены через `price.formatted`
- [ ] Учитывать `price.has_range` для диапазонов
- [ ] Проверять `has_content` перед отображением медиа

---

**Документация актуальна на:** 09.02.2026  
**API Version:** 1.0  
**Schema Version:** 1.0
