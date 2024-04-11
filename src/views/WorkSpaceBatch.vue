<template><main>
	<a-layout-content
		:style="{ padding: '0 80px', margin: 0, minHeight: '100vh', }"
	>
  <a-flex gap="middle" vertical style="margin-top: 20px">
    <a-select
    v-model:value="value"
    show-search
    placeholder="选择或搜索批次"
    style="width: 200px"
    :options="options"
    :filter-option="filterOption"
    @focus="handleFocus"
    @blur="handleBlur"
    @change="handleChange"
  ></a-select>
  <a-card class="batch-container" :title="batch.name">
    <template #extra>
      <a-popconfirm
        title="此操作会删除该批次内所有的页面"
        ok-text="Yes"
        cancel-text="No"
        @confirm="handleDel"
        @cancel="cancel"
      >
        <a-button type="primary"  danger>删除整批</a-button>
      </a-popconfirm>

    </template>
    <div class="batch-header" style="margin-bottom: 15px;">
      <span>生成时间: {{ dayjs(batch.createdAt).format('YYYY/MM/DD HH:mm:ss') }}</span>
    </div>
    <a-table :columns="pageColumns" :data-source="data" :row-key="(record, index) => index">
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
          <a-qrcode ref="qrcodeCanvasRef" :value="`http://124.222.242.75/page/${record.pageId}`" :size=100  />
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-button type="primary" @click="dowloadChange(record.name)">下载二维码</a-button>
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

const batches = ref([]);
const data = ref(null)
const batch = ref({
  name: '',
  createdAt: '',
  pages: [],
  batchId: '',
});

// 删除批次二次确认
const handleDel = async (e) => {
    axios.post("http://127.0.0.1:8088/api/batches/delete?id=" + batch.value.batchId).then((res) => {
    console.log(res);
    message.success('删除成功', 1.5);
    location.reload();
  }).catch((err) => {
    message.error('删除失败', 1.5);
    console.log(err);
  });
};

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

const options = ref([]);
const handleChange = value => {
  if (value) {
    batch.value = batches.value.find(batch => batch.batchId === value);
    data.value = batch.value.pages;
  }
};
const handleBlur = () => {
  console.log('blur');
};
const handleFocus = () => {
  console.log('focus');
};
const filterOption = (input, option) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const value = ref(null);

const fetchBatches = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8088/api/batches/getAll');
    batches.value = response.data;
    options.value = [];
    for (let i = 0; i < batches.value.length; i++) {
      options.value.push({
        value: batches.value[i].batchId,
        label: batches.value[i].name,
      });
    }
  } catch (error) {
    console.error('Error fetching batches:', error);
  }
};
onMounted(() => {
  fetchBatches();
});
</script>