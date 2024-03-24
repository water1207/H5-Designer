<template>
    <a-layout class="layout">
      <a-layout-header 
        style="background: #fff; box-shadow: 0 3px 5px rgba(71, 71, 71, 0.3);">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="light"
          mode="horizontal"
          :style="{ lineHeight: '64px' , display:'block', fontSize: '16px' }"
        >
          <a-menu-item key="1" >
            <a-flex align="center">
              <template #icon>
                <ExperimentTwoTone style="font-size: 35px;" />
              </template>
              Designer with QRCode
            </a-flex>
          </a-menu-item>
          <a-menu-item key="2" :style="{float:'right'}">nav 2</a-menu-item>
          <a-menu-item key="3" :style="{float:'right'}">nav 3</a-menu-item>
          <a-menu-item key="4" :style="{float:'right'}">nav 3</a-menu-item>
        </a-menu>
      </a-layout-header>
      
      <a-layout-content>
        <RouterView />
        
      </a-layout-content>
    </a-layout>

</template>

<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const selectedKeys = ref(['1']);
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
} 
</style>