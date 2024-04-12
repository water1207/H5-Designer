<template><main>
	<a-layout-content
		:style="{ padding: '0 80px', margin: 0, minHeight: '100vh', }"
	>
  <a-flex gap="middle" vertical style="margin-top: 20px">
  <a-card v-for="batch in batches" :key="batch.batchId" class="batch-container" style="">
    <div class="batch-header" style="margin-bottom: 15px;">
      <h3>{{ batch.name }}</h3>
      <span>生成时间: {{ dayjs(batch.createdAt).format('YYYY/MM/DD HH:mm:ss') }}</span>
    </div>
    <!-- <a-table pagination=false :columns="pageColumns" :data-source="batch.pages" row-key="pageId" > -->
      <a-table :columns="pageColumns" :data-source="batch.pages" :row-key="batch.pages.pageId">
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
                <a-tag color="purple">批量页面</a-tag>
					</template>
					<template v-else-if="column.key === 'createdAt'">
						{{ dayjs(record.createdAt).format('YYYY/MM/DD HH:mm:ss') }}
					</template>
					<template v-else-if="column.key === 'qrcode'">
						<a-qrcode type="svg" ref="qrcodeCanvasRef" :value="`http://124.222.242.75/page/${record.pageId}`" :size=100  />
					</template>
					<template v-else-if="column.key === 'action'">
						<a-space>
							<a-button @click="navigate(record.pageId)">编辑</a-button>
						</a-space>
					</template>
				</template>
			</a-table>
  </a-card>
  <div>
  </div>
</a-flex>
	</a-layout-content>
  </main>
</template>

<script setup>
import { ref, onMounted,reactive } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { useRouter } from 'vue-router';
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


const batches = ref([]);

// 页面表格列配置
const pageColumns = [
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
const fetchBatches = async () => {
  try {
    const response = await axios.get('http://124.222.242.75:8088/api/batches/getAll');
    batches.value = response.data;
  } catch (error) {
    console.error('Error fetching batches:', error);
  }
};
onMounted(() => {
  fetchBatches();
});
</script>