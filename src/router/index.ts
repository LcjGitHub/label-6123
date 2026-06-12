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
  ],
})

export default router
