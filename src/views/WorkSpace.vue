<template>
	<main>
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
				<a-layout-sider width="200" style="background: #fff">
					<a-menu
						v-model:selectedKeys="selectedKeys2"
						v-model:openKeys="openKeys"
						mode="inline"
						:style="{ height: '100vh', borderRight: 0 }"
					>
						<div style="margin-top:40px"> </div>
						<a-menu-item key="1">
							<AppstoreTwoTone />
							<span>数据总览</span>
						</a-menu-item>
						<a-sub-menu key="sub1">
							<template #title>
								<span>
									<user-outlined />
									subnav 1
								</span>
							</template>
							<a-menu-item key="1">option1</a-menu-item>
							<a-menu-item key="2">option2</a-menu-item>
							<a-menu-item key="3">option3</a-menu-item>
							<a-menu-item key="4">option4</a-menu-item>
						</a-sub-menu>
						<a-sub-menu key="sub2">
							<template #title>
								<span>
									<laptop-outlined />
									subnav 2
								</span>
							</template>
							<a-menu-item key="5">option5</a-menu-item>
							<a-menu-item key="6">option6</a-menu-item>
							<a-menu-item key="7">option7</a-menu-item>
							<a-menu-item key="8">option8</a-menu-item>
						</a-sub-menu>
						<a-sub-menu key="sub3">
							<template #title>
								<span>
									<notification-outlined />
									subnav 3
								</span>
							</template>
							<a-menu-item key="9">option9</a-menu-item>
							<a-menu-item key="10">option10</a-menu-item>
							<a-menu-item key="11">option11</a-menu-item>
							<a-menu-item key="12">option12</a-menu-item>
						</a-sub-menu>
					</a-menu>
				</a-layout-sider>	
				<RouterView />
			</a-layout>
    </a-layout>
</main>
  </template>
  
  <script setup>
  import {ExperimentTwoTone} from '@ant-design/icons-vue'
  import {ref} from 'vue'
  const selectedKeys2 = ref(['1']);
  const openKeys = ref(['sub1']);
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