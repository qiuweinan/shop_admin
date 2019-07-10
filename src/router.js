import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/index.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/index' },
    { path: '/login', component: Login },
    { path: '/index', component: Index }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
