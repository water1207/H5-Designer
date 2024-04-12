import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/user/Home.vue'
import show from '../views/user/show.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/workspace/home'
    },
    {
      path: '/design',
      name: 'home',
      component: Home,
      children:[
        {
          path: 'template/:id?',
          name: 'design',
          component: () => import('../views/DesignView.vue'),
        },
        {
          path: 'page/:id?',
          name: 'pagedesign',
          props: true ,
          component: () => import('../views/PageDesignView.vue'),
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
        path:'batchAll',
        name:'workspaceBatchAll',
        component: () => import('../views/WorkSpaceBatchAll.vue')
      },{
        path:'page',
        name:'workspacePage',
        component: () => import('../views/WorkSpacePages.vue')
      },{
        path:'template',
        name:'workspaceTemplate',
        component: () => import('../views/WorkSpaceTemplate.vue')
      }]
    },
    {
      path: '/page/:id', // :id是路由参数
      name: 'show',
      component: show,
      props: true // 允许将路由参数作为props传递给组件
    },
    {
      path:'/result',
      name:'result',
      component: Home,
      children:[{
        path:'pagesave',
        name:'pageSave',
        component: () => import('../views/result/PageSave.vue'),
      },{
        path:'templatesave/:id?',
        name:'templateSave',
        props: true,
        component: () => import('../views/result/TemplateSave.vue'),
      },{
        path: 'templateExport',
        name: 'templateExport',
        component: () => import('../views/result/TemplateExport.vue'),
      }]
    }
  ]
})

export default router
