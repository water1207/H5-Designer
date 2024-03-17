<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
<div class="common-layout">
  <el-container>
    <!-- <el-header> -->
      <!-- <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
      <el-menu-item index="0">
        <el-text tag="b" size="large">H5 Designer</el-text>
      </el-menu-item>
      <div class="flex-grow" />
        <el-menu-item index="1">Design Center</el-menu-item>
        <el-sub-menu index="2">
          <template #title>Workspace</template>
          <el-menu-item index="2-1">item one</el-menu-item>
          <el-menu-item index="2-2">item two</el-menu-item>
          <el-menu-item index="2-3">item three</el-menu-item>
          <el-sub-menu index="2-4">
            <template #title>item four</template>
            <el-menu-item index="2-4-1">item one</el-menu-item>
            <el-menu-item index="2-4-2">item two</el-menu-item>
            <el-menu-item index="2-4-3">item three</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
      </el-menu> -->
    <!-- </el-header> -->

    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</div>

</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
} 
/* .el-menu-item:hover {
  background-color: white !important;
} */
</style>