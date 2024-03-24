<template>
  <a-affix>
  <a-page-header
    style="padding: 5px 24px; background: #fff; border: 1px solid rgb(235, 237, 240)"
    title="页面设计"
    :sub-title="pageName"
    @back="() => null">
    <template #tags>
        <a-tag color="blue">编辑中</a-tag>
      </template>
    <template #extra>
        <a-button key="1" type="primary" @click = "open = true;">保存并发布</a-button>
    </template>
  </a-page-header>
  </a-affix>
  <a-row>
    <a-col :span="2"><div class="grid-content ep-bg-purple-dark" /></a-col>
    <a-col :span="6">
      <a-affix :offset-top="220">
        <a-card title="样式库" :bordered="false" style="width: 300px">
          <a-flex :gap="10"  vertical >
          <a-button @click="addWidget('CombineWidget')">Add CombineWidget</a-button>
          <a-button @click="addWidget('RadioWidget')">Add RadioWidget</a-button>
          <a-button @click="addWidget('SubTitleWidget')">Add TitleWithLine</a-button>
          <a-button @click="addWidget('TitleWidget')">Add TitleWidget</a-button>
          <a-button @click="addWidget('ProductWidget')">Add ProductWidget</a-button>
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
            :is="item.type + 'Widget'"
            :key="index"
            v-bind="item.props"
            @update:content="(eventData) => handleWidgetUpdate(eventData, index)"
          ></component>
          </a-popover>
        </div>
      </div>
    </a-col>
    <a-col :span="7" :offset="1">
      <a-affix :offset-top="220">
        <a-button type="primary">Offset top 120px</a-button><br>
        <input type="text" v-model="tName" placeholder="模版名称"><br>
        <button @click="saveTemplate()">保存并发布</button><br>  
        <input type="text" v-model="tId" placeholder="模版ID"><br>
        <button @click="loadTemplate()">页面加载</button><br>
        <button @click="updateTemplate()">页面更新</button><br>
      </a-affix>
    </a-col>
  </a-row>
  <a-modal v-model:open="open" title="页面名称" @ok="savePage()" width="400px" cancelText="取消" okText="发布">
    <a-input v-model:value="pageName" autofocus placeholder="请输入页面名称" />
  </a-modal>
</template>

<script>
import CombineWidget from '../components/widgets/CombineWidget.vue'
import RadioWidget from '../components/widgets/RadioWidget.vue'
import SubTitleWidget from '../components/widgets/SubTitleWidget.vue'
import TitleWidget from '@/components/widgets/TitleWidget.vue'
import ProductWidget from '@/components/widgets/ProductWidget.vue'
import { message } from 'ant-design-vue';
import { saveAs } from 'file-saver';
import axios from 'axios'
import * as XLSX from 'xlsx'

export default {
  components: {
    CombineWidget,
    RadioWidget,
    SubTitleWidget,
    TitleWidget,
    ProductWidget,
  },
  data() {
    return {
      widgets: [],
      pages: [],
      hoverIndex: null, // 用于跟踪鼠标悬浮的组件索引
      hideTimeoutId: null,
      open: false,
      pageName: '未命名的页面',
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
                notes: ['', '', ''],
              },
          },
          RadioWidget: {
              type: 'Radio',
              props: {
                title: '默认标题',
                src:  'https://raw.githubusercontent.com/WontonData/ArtShore/vue3/src/static/img/twitter-card.png',
                switchStates: [false, false],
                notes: ['', '', ''],
              },
          },
          SubTitleWidget: {
              type: 'SubTitle',
              props: {
                title: '默认标题',
                switchStates: [false],
                notes: [''],
              },
          },
          TitleWidget: {
              type: 'Title',
              props: {
                title: '默认标题',
                switchStates: [false],
                notes: [''],
              },
          },
          ProductWidget: {
              type: 'Product',
              props: {
                name: '默认名称',
                desc: '默认描述',
                switchStates: [false, false],
                notes: ['', ''],
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
      }).catch(error => {
        message.error({ content: '页面发布失败', key , duration: 2 });
        console.error('页面发布失败', error);
      });
    },
    // 更新模版
    updateTemplate() {
      let key = 'templateUpdate';
      message.loading({ content: 'Loading...', key });

      const templateData = { 
        id: this.tId,
        data: JSON.stringify({widgets: this.widgets, dynamics: this.dynamics, dynamicsNotes: this.dynamicsNotes}),
      };

      axios.post('http://127.0.0.1:8088/api/templates/update', templateData).then(response => {
        message.success({ content: '模板更新成功', key , duration: 2});
        console.log('模板更新成功', response);
      }).catch(error => {
        message.error({ content: '模板更新失败', key , duration: 2 });
        console.error('模板更新失败', error);
      });
    },
    // 加载模版
    loadTemplate() {
      let key = 'templateLoad';
      message.loading({ content: 'Loading...', key });
      axios.get(`http://127.0.0.1:8088/api/templates/get?id=${this.tId}`, ).then(response => {
        const templateData = JSON.parse(response.data.data);
        this.applyTemplate(templateData);
        message.success({ content: '加载模版成功', key , duration: 2});
        console.log('加载模板数据成功', response);
      }).catch(error => {
        message.error({ content: '加载模版失败', key , duration: 2 });
        console.error("加载模板数据失败", error);
      });
    },
    // 应用模版 
    applyTemplate(templateData) {
      this.widgets = templateData.widgets;
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

  }
}

</script>

<style scoped>
  .canvas {
    max-width: 450px; /* 或者使用 100vw 来确保宽度在视口宽度内 */
    min-height: 833px; /* 模拟常见的H5页面高度 */
    border: 1px solid #ccc;
    margin: 0 auto;
    /* overflow: hidden; */
    position: relative;
    padding-top: 10px;
    background: #fff;
    box-shadow: 0 5px 5px rgba(71, 71, 71, 0.3);
  }
  
  
  .widget {
    margin: 5px;
    padding: 5px;
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
