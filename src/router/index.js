import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// ---------------↓↓追記部①ここから↓↓---------------
// @ts-ignore
import store from '../store'
// @ts-ignore
import { AmplifyEventBus, AmplifyPlugin, components } from 'aws-amplify-vue'

import * as AmplifyModules from 'aws-amplify'


Vue.use(AmplifyPlugin, AmplifyModules)
// ---------------↑↑追記部①ここまで↑↑---------------

Vue.use(VueRouter)

// ---------------↓↓追記部②ここから↓↓---------------
let user: any;

function getUser() {
  return Vue.prototype.$Amplify.Auth.currentAuthenticatedUser()
    .then((data: any) => {
      if (data && data.signInUserSession) {
        store.commit('setUser', data);
        return data;
      }
    }).catch(() => {
      store.commit('setUser', null);
      return null;
    });
}
// ---------------↑↑追記部②ここまで↑↑---------------

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }    // 追記
    },
    {                  // 追記
      path: '/auth',   // 追記
      name: 'auth',    // 追記
      component: components.Authenticator  // 追記
    },                 // 追記
    {
      path: '/about',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
      meta: { requiresAuth: true }    // 追記
    }
  ]
})

// ---------------↓↓追記部③ここから↓↓---------------
// ユーザー管理
getUser().then((user: any) => {
  if (user) {
    router.push({ path: '/' }, () => { }, () => { });
  }
});

// ログイン状態管理
AmplifyEventBus.$on('authState', async (state: any) => {
  if (state === 'signedOut') {
    user = null;
    store.commit('setUser', null);
    router.push({ path: '/auth' }, () => { }, () => { });
  } else if (state === 'signedIn') {
    user = await getUser();
    router.push({ path: '/' }, () => { }, () => { });
  }
});

router.beforeResolve(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    user = await getUser();
    if (!user) {
      return next({
        path: "/auth",
        query: {
          redirect: to.fullPath
        }
      });
    }
    return next();
  }
  return next();
});
// ---------------↑↑追記部③ここまで↑↑---------------

export default router
