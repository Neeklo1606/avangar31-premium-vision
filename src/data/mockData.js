// Mock data для демонстрации

export const propertyListings = [
  {
    id: 1,
    title: 'Дом 125 м.кв. 3 комнаты',
    price: '15 600 000',
    location: 'Москва, Кантемировская',
    area: '125',
    rooms: 3,
    tags: ['Распродажа', 'Ипотека 6%'],
    type: 'house'
  },
  {
    id: 2,
    title: 'Квартира 85 м.кв. 2 комнаты',
    price: '12 500 000',
    location: 'Москва, Новокузнецкая',
    area: '85',
    rooms: 2,
    tags: ['Ипотека 6%'],
    type: 'apartment'
  },
  {
    id: 3,
    title: 'Квартира 52 м.кв. 1 комната',
    price: '8 900 000',
    location: 'Москва, Полянка',
    area: '52',
    rooms: 1,
    tags: ['Новостройка'],
    type: 'apartment'
  }
]

export const residentialComplexes = [
  {
    id: 1,
    name: 'ЖК Снегири',
    priceFrom: 'От 5.6 млн',
    apartmentsCount: 'В продаже 226 квартир',
    location: 'Московская область',
    tags: ['Рассрочка 1 год', 'Ипотека 6%'],
    apartments: [
      { type: 'Студия', area: 'от 24 м.кв.', price: 'от 5.6 млн' },
      { type: '1-комнатная', area: 'от 32 м.кв.', price: 'от 7.2 млн' },
      { type: '2-комнатная', area: 'от 52 м.кв.', price: 'от 10.5 млн' },
      { type: '3-комнатная', area: 'от 79 м.кв.', price: 'от 14.2 млн' }
    ]
  },
  {
    id: 2,
    name: 'ЖК Лесной квартал',
    priceFrom: 'От 6.2 млн',
    apartmentsCount: 'В продаже 156 квартир',
    location: 'Москва, СЗАО',
    tags: ['Рассрочка 2 года', 'Ипотека 5%'],
    apartments: [
      { type: 'Студия', area: 'от 26 м.кв.', price: 'от 6.2 млн' },
      { type: '1-комнатная', area: 'от 35 м.кв.', price: 'от 7.8 млн' },
      { type: '2-комнатная', area: 'от 55 м.кв.', price: 'от 11.5 млн' },
      { type: '3-комнатная', area: 'от 82 м.кв.', price: 'от 15.2 млн' }
    ]
  }
]

export const categories = [
  { id: 1, name: 'Новостройки', slug: 'novostrojki' },
  { id: 2, name: 'Вторичная недвижимость', slug: 'vtorichnaya' },
  { id: 3, name: 'Коммерческая недвижимость', slug: 'kommercheskaya' },
  { id: 4, name: 'Аренда', slug: 'arenda' },
  { id: 5, name: 'Ипотека', slug: 'ipoteka' },
  { id: 6, name: 'Дома', slug: 'doma' },
  { id: 7, name: 'Квартиры', slug: 'kvartiry' },
  { id: 8, name: 'Участки', slug: 'uchastki' },
  { id: 9, name: 'Паркинги', slug: 'parkingi' },
  { id: 10, name: 'Подобрать объект', slug: 'podobrat' }
]

export const cities = [
  { id: 1, name: 'Москва и МО', slug: 'moscow' },
  { id: 2, name: 'Санкт-Петербург', slug: 'spb' },
  { id: 3, name: 'Казань', slug: 'kazan' },
  { id: 4, name: 'Екатеринбург', slug: 'ekb' },
  { id: 5, name: 'Новосибирск', slug: 'novosibirsk' }
]

export const platformStats = [
  { value: '100K+', label: 'Объектов недвижимости' },
  { value: '50+', label: 'Городов России' },
  { value: '24/7', label: 'Поддержка клиентов' },
  { value: '1000+', label: 'Партнеров' }
]
