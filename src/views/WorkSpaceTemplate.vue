<template>
<main>
	<a-layout-content
		:style="{ padding: '0 80px', margin: 0, minHeight: '100vh', }"
	>
		<a-card title="你创建的模版" :bordered="false" style="width: 100%; margin-top: 20px;">
			<a-table :columns="columns" :data-source="data" :row-key="record => record.id">
				<template #headerCell="{ column }">
					<template v-if="column.key === 'name'">
						<span>
							<smile-outlined />
							Name
						</span>
					</template>
				</template>

				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'name'">
							{{ record.name }}
					</template>
					<template v-if="column.key === 'usage'">
							---
					</template>
					<template v-else-if="column.key === 'tags'">
						<a-tag color="processing">
						<template #icon>
							<sync-outlined :spin="true" />
						</template>
						运行正常
						</a-tag>
					</template>
					<template v-else-if="column.key === 'creationDate'">
						{{ dayjs(record.creationDate).format('YYYY/MM/DD HH:mm:ss') }}
						<!-- {{ formatDate(record.createdAt) }} -->
					</template>
					<template v-else-if="column.key === 'lastUpdated'">
						{{ dayjs(record.lastUpdated).format('YYYY/MM/DD HH:mm:ss') }}
						<!-- {{ formatDate(record.createdAt) }} -->
					</template>
					<template v-else-if="column.key === 'action'">
						<a-space>
							<a-button @click="navigate(record.id)">编辑</a-button>
							<a-button danger @click="handleDel(record.id,record.name)">删除</a-button>
						</a-space>
					</template>
				</template>
			</a-table>
		</a-card>
	</a-layout-content>
</main>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
const router = useRouter();
const statistics = ref({ totalPages: 0, singlePages: 0, batchPages: 0 });
const navigate = (tId) => {
  router.push({ name: 'design', params: { id: tId } });
};

const handleDel = async (tId, tName) => {
  axios.post("http://124.222.242.75:8088/api/templates/delete?id=" + tId).then((res) => {
	console.log(res);
	message.success("模版: "+tName+" 删除成功", 1.5);
	fetchData();
  }).catch((err) => {
	message.error("模版: "+tName+' 删除失败', 1.5);
	console.log(err);
  });
};


function formatDate(dateString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('default', options).format(date).replace(/\//g, '-').replace(',', '');
}
const columns = [
  {
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		customRender: ({ index }) => `${index + 1}`, 
  },
  {
    name: '页面名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '创建时间',
    dataIndex: 'creationDate',
    key: 'creationDate',
  },
  {
    title: '最近更新',
    dataIndex: 'lastUpdated',
    key: 'lastUpdated',
  },
  {
    title: '使用量',
    dataIndex: 'usage',
    key: 'usage',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: '操作',
    key: 'action',
  },

];
const data = ref(null)
async function fetchData() {
  try {
    const response1 = await axios.get('http://124.222.242.75:8088/api/templates/getAll');
		const response2 = await axios.get('http://124.222.242.75:8088/api/space/static');
    data.value = response1.data; // 将响应数据赋值给 myData
		statistics.value = response2.data;
  } catch (error) {
    console.error('请求失败:', error);
  }
}

onMounted(fetchData);
</script>