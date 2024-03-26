<template>

	<a-layout-content
		:style="{ padding: '0 80px', margin: 0, minHeight: '100vh', }"
	>
		
		<a-card title="页面访问量" :bordered="false" style="width: 60%; margin-top: 20px;">
			<a-statistic
            title="Feedback"
            :value="11.28"
            :precision="2"
            suffix="%"
            :value-style="{ color: '#3f8600' }"
            style="margin-right: 50px"
          >
            <template #prefix>
              <arrow-up-outlined />
            </template>
          </a-statistic>
    </a-card>
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
					<template v-else-if="column.key === 'tags'">
						<span>
							<a-tag
								v-for="tag in record.tags"
								:key="tag"
								:color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
							>
								{{ tag.toUpperCase() }}
							</a-tag>
						</span>
					</template>
					<template v-else-if="column.key === 'createdAt'">
						{{ dayjs(record.createdAt).format('YYYY/MM/DD HH:mm:ss') }}
						<!-- {{ formatDate(record.createdAt) }} -->
					</template>
					<template v-else-if="column.key === 'qrcode'">
						<a-qrcode ref="qrcodeCanvasRef" :value="`http://127.0.0.1:3000/page/${record.pageId}`" size="100" />
					</template>
					<template v-else-if="column.key === 'action'">
						<a-space>
							<a-button type="primary" @click="dowloadChange">下载二维码</a-button>
							<a-button @click="navigate(record.pageId)">编辑</a-button>
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
const router = useRouter();
const navigate = (pageId) => {
  router.push({ name: 'pagedesign', params: { id: pageId } });
};

const qrcodeCanvasRef = ref();
const dowloadChange = async () => {
  const url = await qrcodeCanvasRef.value.toDataURL();
  const a = document.createElement('a');
  a.download = 'QRCode.png';
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
    dataIndex: 'address',
    key: 'address',
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