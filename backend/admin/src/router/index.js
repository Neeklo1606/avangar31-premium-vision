import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';

const routes = [
  {
    path: '/',
    component: AdminLayout,
    children: [
      {
        path: '',
        redirect: { name: 'dashboard' },
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/DashboardPage.vue'),
        meta: { title: 'Панель управления' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes,
});

export default router;
