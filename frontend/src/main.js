import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import VueSession from 'vue-session'
import axios from 'axios'
import { createProvider } from './vue-apollo'
import vuetify from '@/plugins/vuetify'

Vue.use(VueSession)


Vue.config.productionTip = false
const base = axios.create({
  baseURL: 'http://localhost:8000'
})
Vue.prototype.$http = base;

new Vue({
  router,
  store,
  vuetify,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
