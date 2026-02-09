import { createRouter, createWebHistory } from 'vue-router';

// Layouts
import AdminLayout from '@/layouts/AdminLayout.vue';

// Pages
import Dashboard from '@/pages/Dashboard.vue';
import BlocksList from '@/pages/blocks/List.vue';
import BlocksDetail from '@/pages/blocks/Detail.vue';
import ApartmentsList from '@/pages/apartments/List.vue';
import ApartmentsDetail from '@/pages/apartments/Detail.vue';
import ParkingList from '@/pages/parking/List.vue';
import ParkingDetail from '@/pages/parking/Detail.vue';
import HousesList from '@/pages/houses/List.vue';
import HousesDetail from '@/pages/houses/Detail.vue';
import PlotsList from '@/pages/plots/List.vue';
import PlotsDetail from '@/pages/plots/Detail.vue';
import CommerceList from '@/pages/commerce/List.vue';
import CommerceDetail from '@/pages/commerce/Detail.vue';
import VillagesList from '@/pages/villages/List.vue';
import VillagesDetail from '@/pages/villages/Detail.vue';
import HouseProjectsList from '@/pages/house-projects/List.vue';
import HouseProjectsDetail from '@/pages/house-projects/Detail.vue';

const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
        meta: { title: 'Dashboard' }
      },
      
      // ЖК (Blocks)
      {
        path: 'blocks',
        name: 'blocks.list',
        component: BlocksList,
        meta: { title: 'ЖК (Комплексы)' }
      },
      {
        path: 'blocks/:id',
        name: 'blocks.detail',
        component: BlocksDetail,
        meta: { title: 'Детали ЖК' }
      },
      
      // Квартиры (Apartments)
      {
        path: 'apartments',
        name: 'apartments.list',
        component: ApartmentsList,
        meta: { title: 'Квартиры' }
      },
      {
        path: 'apartments/:id',
        name: 'apartments.detail',
        component: ApartmentsDetail,
        meta: { title: 'Детали квартиры' }
      },
      
      // Паркинги (Parking)
      {
        path: 'parking',
        name: 'parking.list',
        component: ParkingList,
        meta: { title: 'Паркинги' }
      },
      {
        path: 'parking/:id',
        name: 'parking.detail',
        component: ParkingDetail,
        meta: { title: 'Детали паркинга' }
      },
      
      // Дома (Houses)
      {
        path: 'houses',
        name: 'houses.list',
        component: HousesList,
        meta: { title: 'Дома' }
      },
      {
        path: 'houses/:id',
        name: 'houses.detail',
        component: HousesDetail,
        meta: { title: 'Детали дома' }
      },
      
      // Участки (Plots)
      {
        path: 'plots',
        name: 'plots.list',
        component: PlotsList,
        meta: { title: 'Участки' }
      },
      {
        path: 'plots/:id',
        name: 'plots.detail',
        component: PlotsDetail,
        meta: { title: 'Детали участка' }
      },
      
      // Коммерция (Commerce)
      {
        path: 'commerce',
        name: 'commerce.list',
        component: CommerceList,
        meta: { title: 'Коммерция' }
      },
      {
        path: 'commerce/:id',
        name: 'commerce.detail',
        component: CommerceDetail,
        meta: { title: 'Детали коммерции' }
      },
      
      // Поселки (Villages)
      {
        path: 'villages',
        name: 'villages.list',
        component: VillagesList,
        meta: { title: 'Поселки' }
      },
      {
        path: 'villages/:id',
        name: 'villages.detail',
        component: VillagesDetail,
        meta: { title: 'Детали поселка' }
      },
      
      // Проекты домов (House Projects)
      {
        path: 'house-projects',
        name: 'house-projects.list',
        component: HouseProjectsList,
        meta: { title: 'Проекты домов' }
      },
      {
        path: 'house-projects/:id',
        name: 'house-projects.detail',
        component: HouseProjectsDetail,
        meta: { title: 'Детали проекта' }
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Set page title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - TrendAgent Admin` : 'TrendAgent Admin';
  next();
});

export default router;
