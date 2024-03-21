<template>
  <a-row>
    <a-col :span="2"><div class="grid-content ep-bg-purple-dark" /></a-col>
    <a-col :span="6" align="middle">
      <a-affix :offset-top="120">
      <a-button type="primary">Offset top 120px</a-button>
        <div class="panel">
          <a-button @click="addWidget('CombineWidget')">Add CombineWidget</a-button>
          <a-button @click="addWidget('RadioWidget')">Add RadioWidget</a-button>
          <a-button @click="addWidget('SubTitleWidget')">Add TitleWithLine</a-button>
          <a-button @click="addWidget('TitleWidget')">Add TitleWidget</a-button>
          <a-button @click="addWidget('ProductWidget')">Add ProductWidget</a-button>
        </div>
      </a-affix>
    </a-col>
    <a-col :span="8">
      <div class="canvas">
        <div v-for="(item, index) in widgets" :key="index" class="widget"      
          @mouseenter="cancelDelay();hoverIndex = index" 
          @mouseleave="delayHide(index)"
          >
          <component
            :is="item.type + 'Widget'"
            :key="index"
            v-bind="item.props"
            @update:content="(eventData) => handleWidgetUpdate(eventData, index)"
          ></component>
          <div class="toolBox" v-show="hoverIndex === index">
            <a-button size="small" type="primary" icon="ArrowUpBold" @click="moveUp(index)" circle plain style="margin-bottom: 5px;"/>
            <a-button size="small" type="primary" icon="ArrowDownBold" @click="moveDown(index)" circle plain style="margin-bottom: 5px;"/> 
            <a-button size="small" type="danger" icon="Delete" @click="removeWidget(index)" circle plain/> 
          </div>
        </div>
      </div>
    </a-col>
    <a-col :span="7" :offset="1">
      <a-affix :offset-top="120">
        <a-button type="primary">Offset top 120px</a-button><br>
        <input type="text" v-model="tName" placeholder="模版名称"><br>
        <button @click="saveTemplate()">模版保存</button><br>  
        <input type="text" v-model="tId" placeholder="模版ID"><br>
        <button @click="loadTemplate()">模版加载</button><br>
        <button @click="updateTemplate(1)">模版更新</button><br>
        <input type="file" @change="handleFileUpload" />
        <button @click="submitFile">上传 Excel</button>
        <!-- <input type="file" @change="handleFileUpload"> -->
      </a-affix>
    </a-col>
  </a-row>
  <el-backtop :right="400" :bottom="100" />
</template>

<script>
import CombineWidget from '../components/widgets/CombineWidget.vue'
import RadioWidget from '../components/widgets/RadioWidget.vue'
import SubTitleWidget from '../components/widgets/SubTitleWidget.vue'
import TitleWidget from '@/components/widgets/TitleWidget.vue'
import ProductWidget from '@/components/widgets/ProductWidget.vue'
import { notification, message } from 'ant-design-vue';
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
      dynamics: [],
      dynamicsNotes: [],
      pages: [],
      hoverIndex: null, // 用于跟踪鼠标悬浮的组件索引
      hideTimeoutId: null,
      tName: "",
      tId: "",
      file: null,
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
    saveTemplate() {
      let key = 'templateSave';
      message.loading({ content: 'Loading...', key });

      const widgets = this.widgets;

      const templateData = { 
        name: this.tName,
        data: JSON.stringify({widgets}),
      };

      // 根据需要返回或使用 dynamics 和 dynamicsNotes
      axios.post('http://127.0.0.1:8088/api/templates/save', templateData).then(response => { 
        message.success({ content: '模板保存成功', key , duration: 2});
        console.log('模板保存成功', response);
      }).catch(error => {
        message.error({ content: '模板保存失败', key , duration: 2 });
        console.error('模板保存失败', error);
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
      this.dynamics = templateData.dynamics;
      this.dynamicsNotes = templateData.dynamicsNotes;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        this.processExcelData(jsonData);
      };
      reader.readAsBinaryString(file);
    },
    processExcelData(excelData) {
      // excelData 是一个数组，每个元素代表一行Excel数据
      // 初始化一个数组，用于存储每个页面的数据
      const pages = excelData.map(row => {
        // 根据Excel行数据和widgets模板创建页面数据结构
        return this.generateHtmls(row);
      });
      this.pages = pages;
      // this.exportHtmlPages(pages);
    },
    publishHtml() {
      const content = this.generateHtmls();
      axios.post('http://127.0.0.1:8088/api/pages/publish', {content: content}).then(response => {
        ElNotification({
          title: 'Success',
          message: '页面发布成功',
          type: 'success',
          duration: 2000,
        })
        console.log('页面发布成功', response);
      }).catch(error => {
        ElNotification({
          title: 'Error',
          message: '页面发布失败',
          type: 'error',
          duration: 2000,
        })
        console.error('页面发布失败', error);
      });
    },

    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    submitFile() {
      const formData = new FormData();
      formData.append('file', this.file);

      axios.post('http://124.222.242.75//api/page/upload', formData, {
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

    generateWorksheetFromData(data) {
      const ws = XLSX.utils.aoa_to_sheet([]);

      // 填充标题行
      XLSX.utils.sheet_add_aoa(ws, [['ID', 'Name']], {origin: 'A1'});

  
      data.forEach((name, index) => {
        const cellRef = XLSX.utils.encode_cell({r: index + 1, c: 1}); // r 行号，c 列号，从 0 开始
        ws[cellRef] = {t: 's', v: name}; // t: 类型（s = 字符串），v: 值
      });

      return ws;
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
