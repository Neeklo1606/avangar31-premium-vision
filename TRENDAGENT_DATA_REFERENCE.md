# TrendAgent: полный справочник получаемых данных

**Дата:** 09.02.2026  
**Источник:** trendagent.ru, интеграция через API проекта figma-trendagent.

Документ описывает **все типы данных**, которые можно получить через интеграцию с TrendAgent: каталоги, детальные страницы, справочники, фильтры и медиа.

---

## 1. Обзор источников API

| Домен | Назначение | Версия | Требует auth_token |
|-------|------------|--------|---------------------|
| **api.trendagent.ru** | ЖК, квартиры, дома, здания, секции, медиа, ипотека | v4_29 | Да |
| **apartment-api.trendagent.ru** | Справочники (directories) для квартир/ЖК | v1 | Да |
| **parkings-api.trendagent.ru** | Паркинги (машиноместа), справочники (enums) | — | Да* |
| **house-api.trendagent.ru** | Участки, посёлки, проекты домов, фильтры | v1 | Да |
| **commerce-api.trendagent.ru** | Коммерческая недвижимость, фильтры | — | Да |
| **video.trendagent.ru** | Видео по блокам | — | — |
| **files.trendagent.ru** | Документы по блокам | — | — |
| **sso-api.trend.tech** | SSO (получение auth_token) | — | — |

\* В отчёте TRENDAGENT_API_REPORT указано, что для parking/plots/commerce/villages/house_projects токен мог не добавляться; в текущем ObjectTypeResolver у всех endpoint'ов в requiredParams указан auth_token.

---

## 2. Типы объектов (ObjectType)

Всего **8 типов** объектов недвижимости:

| Тип (API) | Название | Описание |
|-----------|----------|----------|
| `blocks` | Жилые комплексы (ЖК) | ЖК с корпусами, сроками сдачи, застройщиком |
| `apartments` | Квартиры | Квартиры в ЖК (номер, комнаты, этаж, площадь, цена) |
| `parking` | Паркинги | Машиноместа (подземные, наземные, многоуровневые) |
| `houses` | Дома | Коттеджи (room=30) и таунхаусы (room=40), данные как у квартир + тип дома, участок |
| `plots` | Участки | Земельные участки в посёлках, коммуникации, категория |
| `commerce` | Коммерция | Нежилые помещения (офисы, торговля, склады и т.д.) |
| `house_projects` | Проекты домов | Типовые проекты домов (площадь, этажи, материал, чертежи) |
| `villages` | Поселки | Коттеджные посёлки с участками и инфраструктурой |

---

## 3. Каталог (Catalog) — данные списков

**Маршруты:**
- `GET /api/trendagent/catalog/{type}` — список объектов с пагинацией и фильтрами.
- `GET /api/trendagent/catalog/{type}/count` — общее количество для дашборда.
- `POST /api/trendagent/catalog/search` — поиск по нескольким типам.

**Параметры запроса (общие):**
- `page`, `per_page` — пагинация.
- `city` — ID города (обязателен; по умолчанию из config: СПб).
- `filter[*]` — фильтры (см. раздел 6).

**Структура ответа каталога:**
- `data` — массив объектов (нормализованные Entity в виде массивов через Resources).
- `meta` — `total`, `page`, `per_page`, `total_pages`, `has_more`, `object_type`, `city`.
- `filters` — применённые фильтры (опционально).
- `dictionaries` — справочники для фильтров (опционально, при `with_dictionaries`).

Ниже — **полный перечень полей по каждому типу** в каталоге/детали (как они определены в Entity и мапперах).

---

## 4. Детальные данные по типам объектов

### 4.1. Базовые поля (все Entity)

- **id** (string) — уникальный идентификатор (_id/id из API).
- **created_at**, **updated_at** (datetime|null) — даты создания и обновления.
- **rawData** (array) — сырые данные API (для совместимости).

---

### 4.2. BlockEntity — Жилой комплекс (ЖК)

**Источник:** `api.trendagent.ru`, `/v4_29/blocks/search/`, `/v4_29/blocks/{id}/unified/`.

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | Идентификатор |
| name | string | Название ЖК |
| guid | string\|null | GUID |
| slug | string\|null | URL-slug |
| description | string\|null | Описание (about) |
| priceFrom | Price\|null | Цена от |
| priceTo | Price\|null | Цена до |
| areaFrom | Area\|null | Площадь от (м²) |
| areaTo | Area\|null | Площадь до (м²) |
| location | Location | Адрес, координаты, район, метро |
| status | string\|null | Статус (state) |
| deadline | datetime\|null | Срок сдачи |
| developer | string\|null | Застройщик |
| class | string\|null | Класс жилья |
| apartmentsCount | int\|null | Количество квартир |
| buildingsCount | int\|null | Количество корпусов |
| floorsCount | int\|null | Этажность |
| contact | Contact\|null | Телефон, email, сайт |
| images | array | Фото (images/photos/gallery) |

**Детальная страница ЖК (агрегация):** объединяются данные с многих endpoint'ов (см. раздел 7).

---

### 4.3. ApartmentEntity — Квартира

**Источник:** `api.trendagent.ru`, `/v4_29/apartments/search/`, `/v4_29/apartments/{id}/`.

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | Идентификатор |
| number | string\|null | Номер квартиры |
| rooms | int | Количество комнат (0 = студия) |
| area | Area | Общая площадь |
| kitchenArea | Area\|null | Площадь кухни |
| livingArea | Area\|null | Жилая площадь |
| floor | int | Этаж |
| floorsTotal | int\|null | Всего этажей в доме |
| section | string\|null | Секция/подъезд |
| price | Price | Цена |
| pricePerMeter | Price\|null | Цена за м² |
| blockId | string\|null | ID ЖК |
| blockName | string\|null | Название ЖК |
| buildingId | string\|null | ID корпуса |
| layoutId | string\|null | ID планировки |
| layoutType | string\|null | Тип планировки |
| finishing | string\|null | Отделка |
| status | string\|null | Статус |
| deadline | datetime\|null | Срок сдачи |
| images | array | Фото |
| floorPlans | array | Планировки (floor_plans/plans) |

---

### 4.4. ParkingEntity — Паркинг (машиноместо)

**Источник:** `parkings-api.trendagent.ru`, `/search/places/`, `/parkings/{id}/`.

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | Идентификатор |
| number | string\|null | Номер места |
| type | string\|null | Тип: underground, ground, multi-level |
| area | Area | Площадь |
| price | Price | Цена |
| floor | int\|null | Этаж |
| section | string\|null | Секция |
| blockId | string\|null | ID ЖК |
| blockName | string\|null | Название ЖК |
| height | float\|null | Высота (м) |
| status | string\|null | Статус |
| location | Location\|null | Адрес/координаты |

---

### 4.5. HouseEntity — Дом (Коттедж / Таунхаус)

**Источник:** те же endpoint'ы, что и квартиры, с параметром `room=30` (коттедж) или `room=40` (таунхаус). Наследует все поля ApartmentEntity плюс:

| Поле | Тип | Описание |
|------|-----|----------|
| houseType | string\|null | cottage / townhouse |
| plotArea | Area\|null | Площадь участка |
| floorsInHouse | int\|null | Этажей в доме |

Остальные поля — как у ApartmentEntity (rooms, area, price, blockId, images и т.д.).

---

### 4.6. PlotEntity — Участок

**Источник:** `house-api.trendagent.ru`, `/search/plots`, `/plots/{id}`.

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | Идентификатор |
| number | string\|null | Номер участка |
| area | Area | Площадь (м²/сотки/га) |
| price | Price | Цена |
| pricePerSotka | Price\|null | Цена за сотку |
| villageId | string\|null | ID посёлка |
| villageName | string\|null | Название посёлка |
| category | string\|null | Категория земли |
| purpose | string\|null | Назначение |
| communications | array | Коммуникации (electricity, water, gas, sewage и др.) |
| location | Location\|null | Адрес, координаты |
| status | string\|null | Статус |
| images | array | Фото |

---

### 4.7. CommerceEntity — Коммерческая недвижимость

**Источник:** `commerce-api.trendagent.ru`, `/search/premises`, `/premises/{id}`.

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | Идентификатор |
| number | string\|null | Номер помещения |
| type | string\|null | Тип: office, retail, warehouse, restaurant и др. |
| area | Area | Площадь |
| price | Price | Цена |
| pricePerMeter | Price\|null | Цена за м² |
| floor | int\|null | Этаж |
| section | string\|null | Секция |
| blockId | string\|null | ID ЖК |
| blockName | string\|null | Название ЖК |
| finishing | string\|null | Отделка |
| separateEntrance | bool\|null | Отдельный вход |
| ceilingHeight | float\|null | Высота потолков (м) |
| status | string\|null | Статус |
| location | Location\|null | Адрес |
| images | array | Фото |
| floorPlans | array | Планы |

---

### 4.8. HouseProjectEntity — Проект дома

**Источник:** `house-api.trendagent.ru`, `/projects/search`, `/projects/{id}`.

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | Идентификатор |
| name | string | Название проекта |
| slug | string\|null | URL-slug |
| description | string\|null | Описание |
| area | Area | Площадь |
| livingArea | Area\|null | Жилая площадь |
| floors | int\|null | Этажность |
| rooms | int\|null | Комнат |
| bedrooms | int\|null | Спален |
| bathrooms | int\|null | Санузлов |
| material | string\|null | Материал (brick, wood, concrete, frame) |
| foundation | string\|null | Фундамент |
| roof | string\|null | Кровля |
| walls | string\|null | Материал стен |
| priceFrom | Price\|null | Цена от |
| contractor | string\|null | Подрядчик |
| buildDuration | int\|null | Срок строительства (мес.) |
| images | array | Фото |
| blueprints | array | Чертежи |
| renders | array | 3D-рендеры |

---

### 4.9. VillageEntity — Поселок

**Источник:** `house-api.trendagent.ru`, `/search/villages`, `/villages/{id}`.

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | Идентификатор |
| name | string | Название посёлка |
| slug | string\|null | URL-slug |
| description | string\|null | Описание |
| priceFrom | Price\|null | Цена от |
| priceTo | Price\|null | Цена до |
| plotsCount | int\|null | Количество участков |
| totalArea | Area\|null | Общая площадь |
| plotAreaFrom | Area\|null | Площадь участка от |
| plotAreaTo | Area\|null | Площадь участка до |
| infrastructure | array | Инфраструктура (коммуникации и т.п.) |
| amenities | array | Удобства (facilities) |
| location | Location | Адрес, координаты |
| distanceToCity | int\|null | Расстояние до города (км) |
| developer | string\|null | Застройщик |
| contact | Contact\|null | Контакты |
| status | string\|null | Статус |
| images | array | Фото |
| masterPlan | array | Генплан (master_plan/plan) |

---

## 5. Value Objects (общие структуры)

Используются внутри Entity и в API Resources.

### 5.1. Price

- **value** (float) — сумма.
- **currency** (string) — RUB, USD, EUR (по умолчанию RUB).
- **formatted** — строка вида "5 000 000 ₽" (через метод format()).

### 5.2. Area

- **value** (float) — число.
- **unit** (string) — м², га, сот и т.д. (по умолчанию m²).
- **formatted** — строка вида "85.50 m²".

### 5.3. Location

- **latitude**, **longitude** (float\|null) — координаты.
- **address** (string\|null) — полный адрес.
- **district** (string\|null) — район.
- **metro** (array\|null) — массив станций метро (объекты с name и др.).

### 5.4. Contact

- **phone** (string\|null).
- **email** (string\|null).
- **website** (string\|null).

---

## 6. Справочники (Dictionaries)

**Маршруты:**
- `GET /api/trendagent/dictionaries/{type}` — все справочники для типа.
- `GET /api/trendagent/dictionaries/{type}/{key}` — один справочник по ключу.

**Форматы внешних API (внутри проекта нормализуются в единый вид):**

- **directories** (apartment-api): блоки/квартиры/дома — `data: { metro, districts, ... }`.
- **enums** (parkings-api): паркинги — перечисления по типу.
- **filters** (commerce-api): коммерция — имя фильтра и options/values.
- **filter** (house-api): участки, посёлки, проекты домов — `filters: { section: { values }, ... }`.

**Нормализованная структура одного справочника:**
- **key** (string) — имя справочника.
- **items** (array) — массив элементов с полями **id**, **name** и при необходимости **data** (исходный объект).

Конкретный состав справочников зависит от ответов TrendAgent (metro, districts, rooms, finishing, parking_type, commerce_type, material, deadline, class и т.д.). Полный список ключей не захардкожен — он приходит из API и кэшируется (DictionaryService, CacheManager).

---

## 7. Детальная страница ЖК (агрегация endpoint'ов)

Для типа **blocks** детальная информация собирается с нескольких URL (BlockDetailStrategy):

| Ключ | URL (шаблон) | Назначение |
|------|--------------|------------|
| unified | `/v4_29/blocks/{id}/unified/` | Основные данные ЖК |
| advantages | `/v4_29/blocks/{id}/advantages/` | Преимущества |
| finishings | `/v4_29/finishings/block/{id}/` | Варианты отделки |
| nearby_places | `/v4_29/blocks/{id}/nearby_places/` | Инфраструктура рядом |
| geo_buildings | `/v4_29/blocks/{id}/geo/buildings/` | Геометрия корпусов |
| media_plans | `/v4_29/media/block/{id}/plans/` | Планы |
| media_progress_years | `/v4_29/media/block/{id}/progress/years/` | Года хода строительства |
| media_progress_{year} | `/v4_29/media/block/{id}/progress/{year}/` | Фото строительства по году |
| videos | `https://video.trendagent.ru/videos/block/{id}` | Видео |
| documents | `https://files.trendagent.ru/fs/list/block/{id}` | Документы |
| bank | `/v4_29/blocks/{id}/bank/` | Банковские продукты |
| mortgage | `/v4_29/blocks/{id}/mortgage/` | Ипотека |
| buildings | `/v4_29/buildings/block/{id}/` | Корпуса |
| sections | `/v4_29/sections/block/{id}/` | Секции |

В ответ детальной страницы попадают:
- **entity** — основная сущность (BlockEntity из unified + маппинг).
- **related** — advantages, finishings, nearbyPlaces, geoBuildings, bank, mortgage, buildings, sections.
- **media** — plans, progress (по годам), videos, documents.

---

## 8. Медиа

**Маршруты:**
- `GET /api/trendagent/{type}/{id}/media` — медиа по объекту.
- В деталях ЖК медиа приходят в блоке **media** агрегированного ответа.

**Типы медиа (MediaService, groupByType):**
- **photos** — фотографии.
- **videos** — видео.
- **documents** — документы (в т.ч. PDF).
- **floorPlans** — поэтажные планы, планы.
- **tours3D** — 3D-туры.
- **progress** — фото хода строительства (по годам для ЖК).

Для **блоков** используются:
- Планы: `/v4_29/media/block/{id}/plans/`.
- Года прогресса: `/v4_29/media/block/{id}/progress/years/`.
- Фото по году: `/v4_29/media/block/{id}/progress/{year}/`.
- Видео: `video.trendagent.ru/videos/block/{id}`.
- Документы: `files.trendagent.ru/fs/list/block/{id}`.

Для **квартир** медиа могут приходить в самом объекте (images, floorPlans); отдельный endpoint медиа для квартир в коде не реализован (getApartmentMedia возвращает пустую коллекцию).

---

## 9. Фильтры (доступные для запросов каталога)

Реестр фильтров (FilterRegistry) и применимость по типам:

| Ключ фильтра | Тип | Название | Типы объектов |
|--------------|-----|----------|----------------|
| price | range | Цена | все |
| area | range | Площадь | все |
| room | multiselect | Количество комнат | apartments, houses |
| floor | range | Этаж | apartments |
| finishing | select | Отделка | apartments, houses, blocks |
| block_id | select | ЖК | apartments |
| parking_type | select | Тип паркинга | parking |
| number | select | Номер | parking, commerce |
| plot_area | range | Площадь участка | plots |
| communications | multiselect | Коммуникации | plots |
| commerce_type | select | Тип помещения | commerce |
| floors_count | range | Этажность | house_projects |
| material | select | Материал | house_projects |
| deadline | select | Срок сдачи | blocks |
| class | select | Класс жилья | blocks |
| district | multiselect | Район | blocks, apartments, parking, commerce |
| metro | multiselect | Метро | blocks, apartments, parking, commerce |
| sort | select | Сортировка | все |
| sort_order | select | Порядок сортировки | все |

В запросе каталога фильтры передаются как `filter[key]=value` или `filter[key][]=value1&filter[key][]=value2` для multiselect. Значения для select/multiselect обычно берутся из справочников (dictionaries).

---

## 10. Маршруты API (сводка)

| Метод | Маршрут | Описание |
|-------|---------|----------|
| GET | `/api/trendagent/catalog/{type}` | Каталог по типу |
| GET | `/api/trendagent/catalog/{type}/count` | Количество объектов |
| POST | `/api/trendagent/catalog/search` | Поиск по нескольким типам |
| GET | `/api/trendagent/{type}/{id}` | Детали по ID |
| GET | `/api/trendagent/{type}/by-slug/{slug}` | Детали по slug |
| GET | `/api/trendagent/{type}/{id}/media` | Медиа объекта |
| POST | `/api/trendagent/{type}/batch` | Детали по списку ID |
| GET | `/api/trendagent/dictionaries/{type}` | Все справочники типа |
| GET | `/api/trendagent/dictionaries/{type}/{key}` | Один справочник |

Тип `{type}`: **blocks**, **apartments**, **parking**, **houses**, **plots**, **commerce**, **house_projects**, **villages**.

---

## 11. Параметры запросов к внешнему API (кратко)

- **city** — обязателен для каталога, деталей и справочников (ID города, по умолчанию СПб в config).
- **auth_token** — добавляется EndpointBuilder только если указан в requiredParams у endpoint'а; для работы blocks/apartments/houses и части других нужен SSO (AuthTokenManager).
- **count**, **offset** — пагинация (внешний API); в нашем API — **page**, **per_page** с преобразованием.
- **sort**, **sort_order** — сортировка (опционально).
- Специальные: для **houses** в запрос добавляются **room=30,40** (specialParams в ObjectTypeResolver).

---

Этот документ покрывает **все данные**, которые проект получает и обрабатывает из TrendAgent: типы объектов, поля сущностей, Value Objects, справочники, фильтры, медиа и агрегированные детали ЖК. Для актуального формата ответов внешнего API при расхождениях ориентироваться на ResponseNormalizer и мапперы Entity.
