<template>
	<a-layout-content
		:style="{ padding: '0 80px', margin: 0, minHeight: '100vh', }"
	>
		<a-card title="已发布的页面" :bordered="false" style="width: 100%; margin-top: 20px;">
			<a-table :columns="columns" :data-source="data" :row-key="(record, index) => index">
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
          <template v-else-if="column.key === 'usage'">
                ---
					</template>
					<template v-else-if="column.key === 'tags'">
						<span v-if="record.batchId == null">
              <a-tag color="blue">单例页面</a-tag>
						</span>
            <span v-else>
              <a-tag color="purple">批量页面</a-tag>
            </span>
					</template>
					<template v-else-if="column.key === 'createdAt'">
						{{ dayjs(record.createdAt).format('YYYY/MM/DD HH:mm:ss') }}
						<!-- {{ formatDate(record.createdAt) }} -->
					</template>
					<template v-else-if="column.key === 'qrcode'">
						<a-qrcode ref="qrcodeCanvasRef" :value="`http://127.0.0.1/page/${record.pageId}`" size="100"/>
					</template>
					<template v-else-if="column.key === 'action'">
						<a-space>
							<a-button type="primary" @click="dowloadChange(record.name)">下载二维码</a-button>
							<a-button @click="navigate(record.pageId)">编辑</a-button>
              <a-button @click="handleDel(record.pageId, record.name)" danger>删除</a-button>
						</a-space>
					</template>
				</template>
			</a-table>
		</a-card>
	</a-layout-content>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
const router = useRouter();
const navigate = (pageId) => {
  router.push({ name: 'pagedesign', params: { id: pageId } });
};

const qrcodeCanvasRef = ref();
const dowloadChange = async (name) => {
  const url = await qrcodeCanvasRef.value.toDataURL();
  const a = document.createElement('a');
  a.download = name;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

async function handleDel(pageId, pageName) {
  axios.post("http://127.0.0.1:8088/api/page/delete?id=" + pageId).then((res) => {
	console.log(res);
  message.success("页面: "+pageName+" 删除成功", 1.5);
	fetchData();
  }).catch((err) => {
    message.success("页面: "+pageName+" 删除失败", 1.5);
	console.log(err);
  });
};

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
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '访问量',
    dataIndex: 'usage',
    key: 'usage',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
	title: 'QRCode',
	key: 'qrcode',
  },
  {
    title: 'Action',
    key: 'action',
  },

];
const data = ref(null)
async function fetchData() {
  try {
    const response = await axios.get('http://127.0.0.1:8088/api/page/getAll');
    data.value = response.data; // 将响应数据赋值给 myData
  } catch (error) {
    console.error('请求失败:', error);
  }
}

onMounted(fetchData);
</script>