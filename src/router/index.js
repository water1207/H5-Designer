import { createRouter, createWebHistory } from 'vue-router'
import DesignView from '../views/DesignView.vue'
import show from '../views/user/show.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DesignView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/page/:id', // :id是路由参数
      name: 'show',
      component: show,
      props: true // 允许将路由参数作为props传递给组件
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import('../views/ExcelDownloader.vue'),
    },
    {
      path:'/test',
      name:'test',
      component: () => import('../views/Test.vue'),
    },{
      path:'/workspace',
      name:'workspace',
      component: () => import('../views/WorkSpaceView.vue'),
    }
  ]
})

export default router
