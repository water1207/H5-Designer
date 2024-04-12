<template>
    <a-result
      status="success"
      title="太好了，导出页面成功!"
      sub-title="恭喜您成功使用模版导出批量页面,可至工作台查看批量页面。"
    >
			<template #icon>
				<smile-twoTone />
			</template>
      <template #extra>
        <a-button key="console" type="primary" @click="navigate">前往工作台</a-button>
      </template>
    </a-result>
  </template>

	<script setup>
	import { useRouter } from 'vue-router';
	const router = useRouter();
	const navigate = () => {
		router.push({ name: 'workspaceBatchAll' });
	};
	</script>