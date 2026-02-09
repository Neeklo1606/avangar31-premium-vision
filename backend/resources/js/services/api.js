import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api/trendagent',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add city parameter from localStorage
    const cityId = localStorage.getItem('selectedCity') || '58c665588b6aa52311afa01b';
    
    if (config.params) {
      config.params.city = cityId;
    } else {
      config.params = { city: cityId };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle errors
    const message = error.response?.data?.message || error.message || 'Произошла ошибка';
    
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// API methods
export default {
  // Catalog
  catalog: {
    get(type, params = {}) {
      return api.get(`/catalog/${type}`, { params });
    },
    
    count(type, filters = {}) {
      return api.get(`/catalog/${type}/count`, { params: { filter: filters } });
    },
    
    search(data) {
      return api.post('/catalog/search', data);
    },
  },
  
  // Detail
  detail: {
    get(type, id, params = {}) {
      return api.get(`/${type}/${id}`, { params });
    },
    
    getBySlug(type, slug, params = {}) {
      return api.get(`/${type}/by-slug/${slug}`, { params });
    },
    
    media(type, id) {
      return api.get(`/${type}/${id}/media`);
    },
    
    batch(type, ids, withAggregation = true) {
      return api.post(`/${type}/batch`, { ids, with_aggregation: withAggregation });
    },
  },
  
  // Dictionaries
  dictionaries: {
    getAll(type) {
      return api.get(`/dictionaries/${type}`);
    },
    
    get(type, key) {
      return api.get(`/dictionaries/${type}/${key}`);
    },
  },
};
