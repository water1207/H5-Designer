<template>
    <a-layout>
      <a-layout-header 
          style="background: #fff; box-shadow: 0 3px 3px rgba(75, 75, 75, 0.3); z-index: 100; width: 100%;">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            theme="light"
            mode="horizontal"
            :style="{ lineHeight: '63px' , display:'block', fontSize: '16px' ,width: '100%'}"
            @click="headerClick"
          >
            <a-menu-item key="1" >
              <a-flex align="center">
                <!-- <template #icon> -->
                <ExperimentTwoTone style="font-size: 30px;" />
                <!-- </template> -->
                H5 Designer for K.o.
              </a-flex>
            </a-menu-item>
            <a-menu-item key="workspaceHome" :style="{float:'right'}">工作台</a-menu-item>
            <a-menu-item key="pagedesign" :style="{float:'right'}">页面设计</a-menu-item>
            <a-menu-item key="design" :style="{float:'right'}">模版构建</a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout>
        <RouterView />
      </a-layout>
    </a-layout>
  </template>
  
  <script setup>
  import {ExperimentTwoTone} from '@ant-design/icons-vue'
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  const router = useRouter();
  const selectedKeys = ref(['1']);
  const headerClick = (item) => {
    console.log(item.key);
    selectedKeys.value = [item.key];
    router.push({ name: item.key });
  };
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