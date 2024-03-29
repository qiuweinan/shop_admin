import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'
import moment from 'moment'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 定义全局的过滤器
Vue.filter('dateFilter', function (value) {
  return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
})

// 把axios添加在vue原型上
Vue.prototype.$axios = axios
// 设置axios全局的base-url，设置了之后会默认拼接上base-url
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 配置axios的请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 统一的给config设置 token
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log(response)
  return response.data
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 使用element-ui
Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
