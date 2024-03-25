<template>
    <a-result
      status="success"
      title="太好了，页面发布成功!"
      sub-title="恭喜您成功发布了页面,可至工作台查看页面详情。"
    >
			<template #icon>
				<smile-twoTone />
			</template>
      <template #extra>
				<!-- <a-button key="buy">返回</a-button> -->
        <a-button key="console" type="primary" @click="navigate">前往工作台</a-button>
      </template>
    </a-result>
  </template>

	<script setup>
	import { useRouter } from 'vue-router';
	const router = useRouter();
	const navigate = (pageId) => {
		router.push({ name: 'workspace' });
	};
	</script>