import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TiposView from '../views/TiposView.vue' 
import HabitacionesView from '../views/HabitacionesView.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/tipos',
      name: 'tipos',
      component: TiposView
    },
    {
      path: '/habitaciones',
      name: 'habitaciones',
      component: HabitacionesView
    }
  ]
})

export default router
