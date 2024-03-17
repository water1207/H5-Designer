<template>
  <div aria-label="A complete example of page header">
  <el-page-header @back="onBack">
    <template #breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: './page-header.html' }">
          homepage
        </el-breadcrumb-item>
        <el-breadcrumb-item><a href="./page-header.html">route 1</a></el-breadcrumb-item>
        <el-breadcrumb-item>route 2</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <template #content>
        <span class="text-large font-600 mr-3"> Title </span>
        <span
              class="text-sm mr-2"
              style="color: var(--el-text-color-regular)"
            >
              Sub title
            </span>
        <el-tag>Default</el-tag>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button>保存</el-button>
        <el-button type="primary" class="ml-2">Edit</el-button>
      </div>
    </template>
  </el-page-header>
  </div>
  <el-row>
    <el-col :span="2"><div class="grid-content ep-bg-purple-dark" /></el-col>
    <el-col :span="6" align="middle">
      <el-affix :offset="120">
      <el-button type="primary">Offset top 120px</el-button>
        <div class="panel">
          <button @click="addWidget('CombineWidget')">Add CombineWidget</button>
          <button @click="addWidget('RadioWidget')">Add RadioWidget</button>
          <button @click="addWidget('SubTitleWidget')">Add TitleWithLine</button>
          <button @click="addWidget('TitleWidget')">Add TitleWidget</button>
          <button @click="addWidget('ProductWidget')">Add ProductWidget</button>
          <button @click="saveTemplate()">模版保存</button>  
          <button @click="loadTemplate(1)">load</button>
          <button @click="updateTemplate(1)">update</button>
          <input type="file" @change="handleFileUpload">
          <button @click="publishHtml()">Publish</button>
        </div>
      </el-affix>
    </el-col>
    <el-col :span="8">
      <div class="canvas">
        <div v-for="(item, index) in widgets" :key="index" class="widget"      
          @mouseenter="cancelDelay(); hoverIndex = index" 
          @mouseleave="delayHide(index)">
          <component
            :is="item.type + 'Widget'"
            :key="index"
            v-bind="item.props"
            @update:content="(eventData) => handleWidgetUpdate(eventData, index)"
          ></component>
          <div class="toolBox" v-show="hoverIndex === index">
            <el-button size="small" type="primary" icon="ArrowUpBold" @click="moveUp(index)" circle plain style="margin-left:12px; margin-bottom: 5px;"/>
            <el-button size="small" type="primary" icon="ArrowDownBold" @click="moveDown(index)" circle plain style="margin-bottom: 5px;"/> 
            <el-button size="small" type="danger" icon="Delete" @click="removeWidget(index)" circle plain/> 
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="8"></el-col>
  </el-row>
  <el-backtop :right="400" :bottom="100" />
</template>

<script>
import CombineWidget from '../components/widgets/CombineWidget.vue'
import RadioWidget from '../components/widgets/RadioWidget.vue'
import SubTitleWidget from '../components/widgets/SubTitleWidget.vue'
import TitleWidget from '@/components/widgets/TitleWidget.vue'
import ProductWidget from '@/components/widgets/ProductWidget.vue'
import Demo from '@/components/widgets/Demo.vue'
import { ElNotification } from 'element-plus'
import axios from 'axios'
import * as XLSX from 'xlsx'

export default {
  components: {
    CombineWidget,
    RadioWidget,
    SubTitleWidget,
    TitleWidget,
    ProductWidget,
    Demo
},
  data() {
    return {
      widgets: [],
      dynamics: [],
      dynamicsNotes: [],
      pages: [],
      hoverIndex: null, // 用于跟踪鼠标悬浮的组件索引
      hideTimeoutId: null,
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
                alt:  '默认图片' ,
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
      // 使用 map 遍历 widgets，然后对每个 widget 的 switchStates 使用 reduce 累积符合条件的备注
      const dynamics = this.widgets.flatMap(item => item.props.switchStates);
      const dynamicsNotes = this.widgets.reduce((notesAccumulator, item) => {
      const notesForWidget = item.props.notes.filter((note, index) => item.props.switchStates[index]);
        return notesAccumulator.concat(notesForWidget);
      }, []);

      const widgets = this.widgets;

      console.log(this.widgets);
      console.log(dynamics);
      console.log(dynamicsNotes);

      this.dynamics = dynamics;
      this.notes = dynamicsNotes;

      const templateData = { 
        name: "test1",
        data: JSON.stringify({widgets, dynamics, dynamicsNotes}),
      };
      // 根据需要返回或使用 dynamics 和 dynamicsNotes
      axios.post('http://127.0.0.1:8088/api/templates/save', templateData).then(response => { 
        ElNotification({
          title: 'Success',
          message: '模板保存成功',
          type: 'success',
          duration: 2000,
        })
        console.log('模板保存成功', response);
      }).catch(error => {
        console.error('模板保存失败', error);
        ElNotification({
          title: 'Error',
          message: '模板保存失败',
          type: 'error',
          duration: 2000,
        })
 
      });
    },
    // 更新模版
    updateTemplate(templateId) {
      const templateData = { 
        id: templateId,
        data: JSON.stringify({widgets: this.widgets, dynamics: this.dynamics, dynamicsNotes: this.dynamicsNotes}),
      };
      axios.post('http://127.0.0.1:8088/api/templates/update', templateData).then(response => {
        ElNotification({
          title: 'Success',
          message: '模板更新成功',
          type: 'success',
          duration: 2000,
        })
        console.log('模板更新成功', response);
      }).catch(error => {
        ElNotification({
          title: 'Error',
          message: '模板更新失败',
          type: 'error',
          duration: 2000,
        })
        console.error('模板更新失败', error);
      });
    },
    // 加载模版
    loadTemplate(templateId) {
      axios.get(`http://127.0.0.1:8088/api/templates/get?id=${templateId}`, ).then(response => {
        const templateData = JSON.parse(response.data.data);
        this.applyTemplate(templateData);
        ElNotification({
          title: 'Success',
          message: '加载模版成功',
          type: 'success',
          duration: 2000,
        })
        console.log('加载模板数据成功', response);
      }).catch(error => {
        ElNotification({
          title: 'Error',
          message: '加载模版失败',
          type: 'error',
          duration: 2000,
        })
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
    generateHtml() {
      let html = '<html><head><style>.page { margin: 20px; padding: 20px; border: 1px solid #ccc; } h1, p { margin: 0; padding: 10px 0; }</style></head><body>';
      html += `<div class="app">`;
      this.widgets.forEach(item => {
        if(item.type == "Combine") {
          html += `<div class${item.type}>`
          Object.keys(item.props).forEach(key => {
            let value = "";
            if(key == "switchStates" || key == "notes") {
              return;
            }
            value = item.props[key];
            if(key == "title")
              html += `<h2>${value}</h2>`;
            if(key == "content")
              html += `<p>${value}</p>`;
            if(key == "src")
              html += `<img src="${value}" alt="${value}" style="max-width: 100%;">`;
          })
        }

      });
    },
    generateHtmls(row) {
      let i = 0;
      let j = 1;
      let html = '<html><head><style>.page { margin: 20px; padding: 20px; border: 1px solid #ccc; } h1, p { margin: 0; padding: 10px 0; }</style></head><body>';
      html += `<div class="app">`;
      console.log(this.widgets);
      console.log(this.dynamics);
      console.log(row);
      this.widgets.forEach(item => {
        if(item.type == "Combine") {
          html += `<div class${item.type}>`
        }
        Object.keys(item.props).forEach(key => {
          let value = "";
          if(key == "switchStates" || key == "notes") {
            return;
          }
          if(this.dynamics[i] == true) {
            value = row[j];
            console.log("key:", key, value);
            j ++;
          }else {
            value = item.props[key];
          }
          if(key == "title")
            html += `<h2>${value}</h2>`;
          if(key == "content")
            html += `<p>${value}</p>`;
          if(key == "src")
            html += `<img src="${value}" alt="${value}" style="max-width: 100%;">`;

          i ++;
        })
        html += `</div>`;
      });
      html += `</div></body></html>`;

      return html;
    },
    downloadHtml(html, filename) {
      const blob = new Blob([html], {type: 'text/html'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
  }
</style>
