<template>
    <a-layout>
      <a-layout-header 
          style="background: #fff; box-shadow: 0 3px 3px rgba(75, 75, 75, 0.3); z-index: 100; width: 100%;">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            theme="light"
            mode="horizontal"
            :style="{ lineHeight: '63px' , display:'block', fontSize: '16px' ,width: '100%'}"
          >
            <a-menu-item key="1" >
              <a-flex align="center">
                <!-- <template #icon> -->
                <ExperimentTwoTone style="font-size: 30px;" />
                <!-- </template> -->
                H5 Designer for K.o.
              </a-flex>
            </a-menu-item>
            <a-menu-item key="2" :style="{float:'right'}">nav 2</a-menu-item>
            <a-menu-item key="3" :style="{float:'right'}">nav 3</a-menu-item>
            <a-menu-item key="4" :style="{float:'right'}">nav 3</a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout>
        <RouterView />
      </a-layout>
    </a-layout>
  </template>
  
  <script setup>
  import {ExperimentTwoTone} from '@ant-design/icons-vue'
  </script>
  
  <style scoped>
  #components-layout-demo-top-side-2 .logo {
    float: left;
    width: 120px;
    height: 31px;
    margin: 16px 24px 16px 0;
    background: rgba(255, 255, 255, 0.3);
  }
  
  .ant-row-rtl #components-layout-demo-top-side-2 .logo {
    float: right;
    margin: 16px 0 16px 24px;
  }
  
  .site-layout-background {
    background: #fff;
  }
  </style>