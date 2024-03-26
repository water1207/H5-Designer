import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/user/Home.vue'
import show from '../views/user/show.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children:[
        {
          path: 'design/template/:id?',
          name: 'design',
          component: () => import('../views/DesignView.vue'),
        },
        {
          path: 'design/page/:id?',
          name: 'pagedesign',
          props: true ,
          component: () => import('../views/PageDesignView.vue'),
        },
        {
          path:'test',
          name:'test',
          component: () => import('../views/Test.vue'),
        },{
          path:'result/pagesave',
          name:'pageSave',
          component: () => import('../views/result/PageSave.vue'),
        },{
          path:'result/templatesave',
          name:'templateSave',
          component: () => import('../views/result/TemplateSave.vue'),
        },{
          path:'demo',
          name:'demo',
          component: () => import('../views/Demo2.vue'),
        }
      ]
    },
    {
      path:'/workspace',
      name:'workspace',
      component: () => import('../views/WorkSpace.vue'),
      children:[{
        path:'home',
        name:'workspaceHome',
        component: () => import('../views/WorkSpaceHome.vue')
      },{
        path:'batch',
        name:'workspaceBatch',
        component: () => import('../views/WorkSpaceBatch.vue')
      },{
        path:'page',
        name:'workspacePage',
        component: () => import('../views/WorkSpacePages.vue')
      }
      ]
    },
    {
      path: '/page/:id', // :id是路由参数
      name: 'show',
      component: show,
      props: true // 允许将路由参数作为props传递给组件
    },
  ]
})

export default router
