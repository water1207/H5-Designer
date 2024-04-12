<template>
<a-result
	status="success"
	title="太好了，模版保存成功!"
	sub-title="恭喜您成功保存了模版,可至工作台查看模版详情。"
>
	<template #icon>
		<smile-twoTone />
	</template>
	<template #extra>
		<a-button @click="back(tId)">进行批量导出</a-button>
		<a-button key="console" type="primary" @click="navigate">前往工作台</a-button>
	</template>
</a-result>
</template>

	<script setup>
	import { useRouter } from 'vue-router';
	const router = useRouter();
	const tId = router.currentRoute.value.params.id;
	const navigate = () => {
		router.push({ name: 'workspaceTemplate' });
	};
	const back = (tId) => {
		router.push({ name: 'design', params: { id: tId } });
	};
	</script>