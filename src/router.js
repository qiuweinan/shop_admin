import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/index.vue'
import Users from './components/users/Users.vue'
import Rights from './components/rights/Rights.vue'
import Roles from './components/rights/Roles.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'inex',
      redirect: '/index'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      component: Index,
      name: 'index',
      children: [
        { path: '/users', name: 'users', component: Users },
        { path: '/rights', name: 'rights', component: Rights },
        { path: '/roles', name: 'roles', component: Roles }
      ]
    }
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
