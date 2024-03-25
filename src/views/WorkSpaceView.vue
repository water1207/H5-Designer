<template>
	<a-layout-sider width="200" style="background: #fff">
		<a-menu
			v-model:selectedKeys="selectedKeys2"
			v-model:openKeys="openKeys"
			mode="inline"
			:style="{ height: '100%', borderRight: 0}"
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
						<span>
							<a>编辑</a>
							<a-button type="primary" @click="dowloadChange">Downlaod</a-button>
						</span>
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
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: 'Address',
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