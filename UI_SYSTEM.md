# Система единых UI-компонентов LiveGrid

## Цель
Обеспечить консистентность интерфейса во всем проекте. **Все одинаковые по сути элементы должны выглядеть одинаково.**

## Базовые принципы

### 1. Единые размеры
Все компоненты используют только 3 размера:
- **sm** (small) - маленькие элементы
- **md** (medium) - стандартные элементы (по умолчанию)
- **lg** (large) - крупные элементы

### 2. Единые радиусы скругления
- Кнопки/инпуты: `8px` (основной)
- Малые элементы: `6px`
- Карточки: `16px`
- Модальные окна: `12px`

### 3. Единая цветовая палитра
Используются только цвета из `theme.js`:
- **Primary**: `#3CA4F4` (основной синий)
- **Primary Dark**: `#2A8FD9` (темнее при hover)
- **Dark**: `#1E1E1E` (основной текст)
- **Gray Light**: `#DFDFDF` (рамки)
- **Gray Medium**: `#8E8E8E` (второстепенный текст)

---

## Компоненты

### Button
**Использовать для всех кнопок в проекте**

```jsx
import { Button } from '@/components/ui'

// Primary кнопка (по умолчанию)
<Button>Показать объекты</Button>
<Button variant="primary" size="lg">Показать 121 563 объекта</Button>

// Secondary кнопка (белая с рамкой)
<Button variant="secondary">Войти</Button>

// Outline кнопка
<Button variant="outline">Сбросить</Button>

// С иконкой
<Button icon={<Icon />} iconPosition="left">Все объекты</Button>

// Ссылка
<Button to="/catalog">Перейти в каталог</Button>
```

**Размеры:**
- `sm`: высота 40px, текст 13px
- `md`: высота 48px, текст 14px (по умолчанию)
- `lg`: высота 56px, текст 16px

**Варианты:**
- `primary` - синяя кнопка (основные действия)
- `secondary` - белая с рамкой (второстепенные действия)
- `outline` - прозрачная с рамкой
- `ghost` - прозрачная без рамки
- `danger` - красная (удаление)

---

### Input
**Использовать для всех полей ввода**

```jsx
import { Input } from '@/components/ui'

// Обычное поле
<Input placeholder="Введите текст" />

// С иконкой слева
<Input 
  placeholder="Поиск по сайту"
  icon={<SearchIcon />}
  iconPosition="left"
/>

// С кнопкой справа
<Input 
  placeholder="Поиск"
  rightElement={<IconButton icon={<FilterIcon />} />}
/>

// С ошибкой
<Input 
  error={true}
  errorMessage="Обязательное поле"
/>
```

**Размеры:**
- `sm`: высота 40px, текст 13px
- `md`: высота 48px, текст 14px (по умолчанию)
- `lg`: высота 56px, текст 16px

---

### Tab
**Использовать для переключателей/табов**

```jsx
import { Tab, TabGroup } from '@/components/ui'

<TabGroup>
  <Tab active={activeTab === 0} onClick={() => setActiveTab(0)}>
    Квартиры
  </Tab>
  <Tab active={activeTab === 1} onClick={() => setActiveTab(1)}>
    Паркинги
  </Tab>
  <Tab active={activeTab === 2} onClick={() => setActiveTab(2)}>
    Дома с участками
  </Tab>
</TabGroup>
```

**Стили:**
- Активный: синяя заливка, белый текст, тень
- Неактивный: белый фон, серый текст, рамка

---

### IconButton
**Использовать для кнопок только с иконкой**

```jsx
import { IconButton } from '@/components/ui'

// Обычная
<IconButton icon={<UserIcon />} ariaLabel="Профиль" />

// Primary стиль
<IconButton 
  variant="primary" 
  icon={<CloseIcon />}
  ariaLabel="Закрыть"
/>

// С размером
<IconButton 
  size="lg"
  icon={<FilterIcon />}
  ariaLabel="Фильтры"
/>
```

**Размеры:**
- `sm`: 32×32px
- `md`: 40×40px (по умолчанию)
- `lg`: 48×48px

---

## Правила использования

### ✅ Правильно
```jsx
// Использовать единые компоненты
import { Button, Input, Tab } from '@/components/ui'

<Button variant="primary" size="lg">
  Показать объекты
</Button>
```

### ❌ Неправильно
```jsx
// НЕ создавать кнопки напрямую с разными стилями
<button className="px-5 py-2.5 bg-primary rounded-[5px]">
  Кнопка 1
</button>

<button className="px-6 py-3 bg-primary rounded-[8px]">
  Кнопка 2  {/* Другие размеры! */}
</button>
```

---

## Контрольный список при создании новых компонентов

- [ ] Используются только размеры `sm`, `md`, `lg`
- [ ] Используется единый радиус скругления `8px`
- [ ] Используются цвета из `theme.js`
- [ ] Используется шрифт Rubik
- [ ] Hover-эффекты одинаковы для похожих элементов
- [ ] Тени (`shadow-md`, `shadow-lg`) применяются единообразно
- [ ] Transitions везде `duration-300`

---

## Миграция старых компонентов

При обновлении существующих компонентов:

1. **Найти все кнопки**
   ```bash
   # Искать: <button, className=".*bg-primary
   ```

2. **Заменить на `<Button>`**
   - Определить вариант (primary/secondary/outline)
   - Определить размер (sm/md/lg)
   - Заменить

3. **Проверить консистентность**
   - Все кнопки одного типа выглядят одинаково
   - Размеры соответствуют контексту

---

## Примеры распространенных паттернов

### Форма поиска
```jsx
<div className="flex gap-3">
  <Input 
    size="lg"
    placeholder="Поиск по сайту"
    icon={<SearchIcon />}
    rightElement={
      <IconButton 
        variant="primary" 
        icon={<FilterIcon />}
        ariaLabel="Фильтры"
      />
    }
  />
  <Button variant="primary" size="lg">
    Показать объекты
  </Button>
</div>
```

### Группа табов
```jsx
<TabGroup>
  {tabs.map((tab, index) => (
    <Tab 
      key={tab}
      active={activeIndex === index}
      onClick={() => setActiveIndex(index)}
    >
      {tab}
    </Tab>
  ))}
</TabGroup>
```

### Кнопки действий
```jsx
<div className="flex gap-3">
  <Button variant="outline" onClick={onReset}>
    Сбросить
  </Button>
  <Button variant="primary" onClick={onApply}>
    Применить
  </Button>
</div>
```

---

## Полезные ссылки

- `src/constants/theme.js` - все константы цветов, размеров, шрифтов
- `tailwind.config.js` - конфигурация Tailwind
- `src/components/ui/` - все UI-компоненты
- `src/components/ui/index.js` - экспорт всех компонентов

---

**Помните: консистентность = профессионализм. Используйте единую систему компонентов везде!**
