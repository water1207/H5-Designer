<template>
<main>
  <a-affix>
  <a-page-header
    style="padding: 5px 24px; background: #fff; border: 1px solid rgb(235, 237, 240)"
    title="页面设计"
    :sub-title="pageName"
    @back="navigator()">
    <template #tags>
        <a-tag color="blue">编辑中</a-tag>
      </template>
    <template #extra>
        <a-button v-if="pageId == ''" key="1" type="primary" @click = "open = true;" >保存并发布</a-button>
        <a-button v-else key="2" type="primary" @click = "updatePage()" >更新页面</a-button>
      </template>
  </a-page-header>
  </a-affix>
  <a-row>
    <a-col :span="2"><div class="grid-content ep-bg-purple-dark" /></a-col>
    <a-col :span="6">
      <a-affix :offset-top="160">
        <a-card title="样式库" :bordered="false" style="width: 300px">
          <a-flex :gap="10"  vertical >
          <a-button @click="addWidget('TitleWidget')">Add 标题</a-button>
          <a-button @click="addWidget('SubTitleWidget')">Add 子标题</a-button>
          <a-button @click="addWidget('ProductWidget')">Add 产品描述</a-button>
          <a-button @click="addWidget('ImageWidget')">Add 弹性图片</a-button>
          <a-button @click="addWidget('Image2Widget')">Add 16:9固定比例图片</a-button>
          <a-button @click="addWidget('Image3Widget')">Add 与内容齐平的图片</a-button>
          <a-button @click="addWidget('CombineWidget')">Add 测试组件</a-button>
          <a-button @click="addWidget('RadioWidget')">Add 音频组件</a-button>
          </a-flex>
        </a-card>
      </a-affix>
    </a-col>
    <a-col :span="8">
      <div class="canvas">
        <div v-for="(item, index) in widgets" :key="index" class="widget"      >
          <a-popover placement="right">
            <template #content>
              <a-flex :gap="2" vertical>
              <a-button @click="moveUp(index)">
                <template #icon>
                  <CaretUpOutlined style="color:#3875f6" />
                </template>
              </a-button>
              <a-button  @click="moveDown(index)">
                <template #icon>
                  <CaretDownOutlined style="color:#3875f6" />
                </template>
              </a-button>
              <a-button @click="removeWidget(index)" danger>
                <template #icon>
                  <DeleteOutlined />
                </template>
              </a-button>
              </a-flex>
            </template>
            <component
            :is="item.type + 'Widget2'"
            :key="index"
            v-bind="item.props"
            @update:content="(eventData) => handleWidgetUpdate(eventData, index)"
          ></component>
          </a-popover>
        </div>
      </div>
    </a-col>
    <a-col :span="6" :offset="1">
      <a-affix :offset-top="220">
        <a-card title="编辑指南">
        <a-timeline>
          <a-timeline-item v-for="item in timelines">
            {{ item }}
          </a-timeline-item>
        </a-timeline>
        </a-card>
      </a-affix>
    </a-col>
  </a-row>
  <a-modal v-model:open="open" title="页面名称" @ok="savePage()" width="400px" cancelText="取消" okText="发布">
    <a-input v-model:value="pageName" autofocus placeholder="请输入页面名称" />
  </a-modal>
</main>
</template>

<script>
import CombineWidget2 from '@/components/widgets2/CombineWidget2.vue'
import RadioWidget2 from '@/components/widgets2/RadioWidget2.vue'
import SubTitleWidget2 from '@/components/widgets2/SubTitleWidget2.vue'
import TitleWidget2 from '@/components/widgets2/TitleWidget2.vue'
import ProductWidget2 from '@/components/widgets2/ProductWidget2.vue'
import ImageWidget2 from '@/components/widgets2/ImageWidget2.vue'
import Image2Widget2 from '@/components/widgets2/Image2Widget2.vue'
import Image3Widget2 from '@/components/widgets2/Image3Widget2.vue'
import { message } from 'ant-design-vue';
import { saveAs } from 'file-saver';
import axios from 'axios'
import * as XLSX from 'xlsx'

export default {
  components: {
    CombineWidget2,
    RadioWidget2,
    SubTitleWidget2,
    TitleWidget2,
    ProductWidget2,
    ImageWidget2,
    Image2Widget2,
    Image3Widget2,
  },
  data() {
    return {
      widgets: [],
      pages: [],
      hoverIndex: null, // 用于跟踪鼠标悬浮的组件索引
      hideTimeoutId: null,
      open: false,
      pageName: '未命名的页面',
      pageId: this.$route.params.id,
      timelines: ['创建页面', '添加组件', '编辑组件', '发布页面']
    }
  },
  created() {
    if (this.pageId) {
      this.loadPage(this.pageId)
    }else{
      this.pageId = ''
    }
  },
  methods: {
    // 添加组件至画布
    addWidget(type) {
      const defaultProps = {
          CombineWidget: {
              type: 'Combine',
              props: {
                title: '默认标题',
                content: '默认描述',
                src:  'https://raw.githubusercontent.com/WontonData/ArtShore/vue3/src/static/img/twitter-card.png',
                switchStates: [false, false, false],
                notes: ['动态标题', '动态描述', ''],
              },
          },
          ImageWidget: {
              type: 'Image',
              props: {
                src: 'https://raw.githubusercontent.com/WontonData/ArtShore/vue3/src/static/img/twitter-card.png',
                switchStates: [false],
                notes: ['弹性图片-资源'],
              },
          },
          Image2Widget: {
              type: 'Image2',
              props: {
                src: 'https://raw.githubusercontent.com/WontonData/ArtShore/vue3/src/static/img/twitter-card.png',
                switchStates: [false],
                notes: ['固定比例图片-资源'],
              },
          },
          Image3Widget: {
              type: 'Image3',
              props: {
                src: 'https://raw.githubusercontent.com/WontonData/ArtShore/vue3/src/static/img/twitter-card.png',
                switchStates: [false],
                notes: ['齐平图片-资源'],
              },
          },
          RadioWidget: {
              type: 'Radio',
              props: {
                title: '默认标题',
                src:  'https://raw.githubusercontent.com/WontonData/ArtShore/vue3/src/static/img/twitter-card.png',
                switchStates: [false, false],
                notes: ['音频组件-标题', '', ''],
              },
          },
          SubTitleWidget: {
              type: 'SubTitle',
              props: {
                title: '默认标题',
                switchStates: [false],
                notes: ['子标题'],
              },
          },
          TitleWidget: {
              type: 'Title',
              props: {
                title: '默认标题',
                switchStates: [false],
                notes: ['标题'],
              },
          },
          ProductWidget: {
              type: 'Product',
              props: {
                name: '默认名称',
                desc: '默认描述',
                switchStates: [false, false],
                notes: ['产品-名称', '产品-描述'],
              },
          },
          // 可以添加其他类型组件的默认属性
      };
      this.widgets.push(defaultProps[type]);
    },
    // 处理widget子组件内容的更新
    handleWidgetUpdate(eventData, index) {
      this.widgets[index] = {
        ...this.widgets[index],
        props: {
          ...this.widgets[index].props,
          ...eventData.content,
        },
      };
    },
    savePage() {
      let key = 'pageSave';
      message.loading({ content: 'Loading...', key });

      const widgets = this.widgets;

      const pageData = { 
        name: this.pageName,
        data: JSON.stringify({widgets}),
      };

      // 根据需要返回或使用 dynamics 和 dynamicsNotes
      axios.post('http://127.0.0.1:8088/api/page/create', pageData).then(response => { 
        message.success({ content: '页面发布成功', key , duration: 2});
        console.log('页面发布成功', response);
        this.$router.push('/result/pagesave'); 
        this.open = false;
      }).catch(error => {
        message.error({ content: '页面发布失败', key , duration: 2 });
        console.error('页面发布失败', error);
        this.open = false;
      });


    },
    // 更新模版
    updatePage() {
      let key = 'pageUpdate';
      message.loading({ content: 'Loading...', key });

      const widgets = this.widgets;

      const pageData = { 
        id: this.pageId,
        name: this.pageName,
        data: JSON.stringify({widgets}),
      };

      // 根据需要返回或使用 dynamics 和 dynamicsNotes
      axios.post('http://127.0.0.1:8088/api/page/update', pageData).then(response => { 
        message.success({ content: '页面更新成功', key , duration: 2});
        this.$router.push('/result/pagesave');  
        console.log('页面更新成功', response);
      }).catch(error => {
        message.error({ content: '页面更新失败', key , duration: 2 });
        console.error('页面更新失败', error);
      });
    },

    // 加载模版
    loadPage(id) {
      let key = 'init';
      axios.get(`http://127.0.0.1:8088/api/page/get?id=${id}`, ).then(response => {
        const pageData = JSON.parse(response.data.content);
        this.widgets = pageData.widgets
        this.pageName = response.data.name
        message.success({ content: '加载页面成功', key , duration: 2});
        console.log('加载页面数据成功', response);
      }).catch(error => {
        message.error({ content: '加载页面失败', key , duration: 2});
        console.error("加载页面数据失败", error);
      });
    },
    // 应用模版 
    applyTemplate(templateData) {
      this.widgets = templateData.widgets;
      console.log('模板数据', templateData);
      // this.dynamics = templateData.dynamics;
      // this.dynamicsNotes = templateData.dynamicsNotes;
    },

    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    submitFile() {
      const formData = new FormData();
      formData.append('file', this.file);

      axios.post('http://127.0.0.1:8088/api/page/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        this.widgets = response.data;
        console.log('上传successfully', response);
      })
      .catch(error => {
        console.error('Error uploading file', error);
      });
    },

    // 移除组件
    removeWidget(index) {
      this.widgets.splice(index, 1);
    },
    // 上移组件
    moveUp(index) {
      if (index > 0) {
        const itemToMove = this.widgets[index];
        this.widgets.splice(index, 1);
        this.widgets.splice(index - 1, 0, itemToMove);
      }
    },
    // 下移组件
    moveDown(index) {
      if (index < this.widgets.length - 1) {
        const itemToMove = this.widgets[index];
        this.widgets.splice(index, 1);
        this.widgets.splice(index + 1, 0, itemToMove);
      }
    },
    delayHide(index) {
      this.hideTimeoutId = setTimeout(() => {
        if (this.hoverIndex === index) {
          this.hoverIndex = null;
        }
      }, 500); // 延迟 500 毫秒后隐藏，您可以根据需要调整这个时间
    },  
    cancelDelay() {
      if (this.hideTimeoutId) {
        clearTimeout(this.hideTimeoutId);
      }
      this.hideTimeoutId = null;
    },
    navigator() {
      this.$router.push('/workspace/page'); 
    }
  }
}

</script>

<style scoped>
  .canvas {
    max-width: 450px; /* 或者使用 100vw 来确保宽度在视口宽度内 */
    min-height: 833px; /* 模拟常见的H5页面高度 */
    border: 1px solid #ccc;
    margin: 15px auto;
    overflow: hidden;
    position: relative;
    padding: 10px 0;
    background: #fff;
    /* box-shadow: 0 4px 5px rgba(71, 71, 71, 0.3); */
    /* border-radius: 5px; */
  }
  
  
  .widget {
    margin: 3px;
    padding: 3px 5px;
    position: relative; 
    border: 1px solid #ccc;
  }

  .toolBox {
    display: none;
    position: absolute; 
    bottom: 10px;
    right: -60px; 
    z-index: 10;  
    display: flex; 
    flex-direction: column;
    justify-content:flex-start; 
    flex-wrap: wrap; 
    width: 50px;
    .a-button + .a-button {
      margin-left: 0px;
    }
  }

</style>
