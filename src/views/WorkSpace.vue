<template>
<main>
    <a-layout>
      <a-layout-header 
          style="background: #fff; box-shadow: 0 3px 3px rgba(75, 75, 75, 0.3); z-index: 100; width: 100%;"
          :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <a-menu
            v-model:selectedKeys="selectedKeys"
            theme="light"
            mode="horizontal"
            :style="{ lineHeight: '63px' , display:'block', fontSize: '16px' ,width: '100%'}"
            @click="headerClick">
            <a-menu-item key="1" style="pointer-events:none">
              <a-flex align="center">
                <ExperimentTwoTone style="font-size: 30px;" />
                H5 Designer for K.o.
              </a-flex>
            </a-menu-item>
            <a-menu-item key="workspaceHome" :style="{float:'right'}">工作台</a-menu-item>
            <a-menu-item key="pagedesign" :style="{float:'right'}">页面设计</a-menu-item>
            <a-menu-item key="design" :style="{float:'right'}">模版构建</a-menu-item>
        </a-menu>
      </a-layout-header>

			<a-layout :style="{  marginTop: '64px' }" has-sider>
				<a-layout-sider width="200" style="background: #fff;" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: '64px', bottom: 0 }">
					<a-menu
						v-model:selectedKeys="selectedKeys2"
						v-model:openKeys="openKeys"
						mode="inline"
						:style="{ height: '100%', borderRight: 0 }"
						@click="headerClick2"
					>
						<div style="margin-top:40px"> </div>
						<a-menu-item key="workspaceHome">
							<AppstoreTwoTone />
							<span>数据总览</span>
						</a-menu-item>
            <a-menu-item key="workspacePage">
							<DatabaseTwoTone />
							<span>所有页面</span>
						</a-menu-item>
						<a-sub-menu key="sub1">
							<template #title>
                <BuildTwoTone />
								<span>批量页面</span>
							</template>
							<a-menu-item key="workspaceBatch">搜索与筛选</a-menu-item>
							<a-menu-item key="workspaceBatchAll">所有批次</a-menu-item>
						</a-sub-menu>
						<a-menu-item key="workspaceTemplate">
							<LayoutTwoTone />
							<span>我的模版</span>
						</a-menu-item>
					</a-menu>
				</a-layout-sider>
				<a-layout :style="{ marginLeft: '200px' }">	
				<RouterView />
				</a-layout>
			</a-layout>
    </a-layout>
</main>
  </template>
  
  <script setup>
  import {ExperimentTwoTone} from '@ant-design/icons-vue'
  import {ref} from 'vue'
  import { useRouter } from 'vue-router';
  const selectedKeys2 = ref(['1']);
  const openKeys = ref(['sub1']);

  const selectedKeys = ref(['workspaceHome']);
  const router = useRouter();
  const headerClick = (item) => {
    console.log(item.key);
    selectedKeys.value = [item.key];
    router.push({ name: item.key });
  };
	const headerClick2 = (item) => {
    console.log(item.key);
    selectedKeys2.value = [item.key];
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