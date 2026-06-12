import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'list',
      component: () => import('@/views/ColorList.vue'),
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/Favorites.vue'),
    },
    {
      path: '/discover',
      name: 'discover',
      component: () => import('@/views/RandomDiscover.vue'),
    },
    {
      path: '/color/:id',
      name: 'detail',
      component: () => import('@/views/ColorDetail.vue'),
    },
    {
      path: '/color/:id/scheme',
      name: 'colorScheme',
      component: () => import('@/views/ColorScheme.vue'),
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('@/views/StatsOverview.vue'),
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/BrowseHistory.vue'),
    },
    {
      path: '/compare',
      name: 'compare',
      component: () => import('@/views/ColorCompare.vue'),
    },
  ],
})

export default router
