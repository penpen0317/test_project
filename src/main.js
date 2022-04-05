import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// ---------------↓ここから追記↓---------------
import Amplify, * as AmplifyModules from 'aws-amplify'
// @ts-ignore
import { AmplifyPlugin } from 'aws-amplify-vue'
// @ts-ignore
import aws_exports from './aws-exports'
Amplify.configure(aws_exports)

Vue.use(AmplifyPlugin, AmplifyModules)
// ---------------↑ここまで追記↑---------------
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
