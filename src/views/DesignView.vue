<template>
  <main>
    <div class="panel">
      <button @click="addWidget('CombineWidget')">Add CombineWidget</button>
      <button @click="saveTemplate()">Export</button>  
      <button @click="loadTemplate(1)">load</button>
      <button @click="updateTemplate(1)">update</button>
      <input type="file" @change="handleFileUpload">
      <button @click="publishHtml()">Publish</button>
    </div>
    <div class="canvas">
      <div v-for="(item, index) in widgets" :key="index" class="widget">
        <component
          :is="item.type + 'Widget'"
          :key="index"
          v-bind="item.props"
          @update:content="(eventData) => handleWidgetUpdate(eventData, index)"
        ></component>
        <button @click="deleteWidget(index)">remove</button>
        <button @click="moveUp(index)">Move Up</button>
        <button @click="moveDown(index)">Move Down</button>
      </div>
    </div>
  </main>
</template>

<script>
import CombineWidget from '../components/widgets/CombineWidget.vue'
import axios from 'axios'
import * as XLSX from 'xlsx'

export default {
  components: {
    CombineWidget
  },
  data() {
    return {
      widgets: [],
      dynamics: [],
      dynamicsNotes: [],
      pages: [],
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
        console.log('模板保存成功', response);
      }).catch(error => {
        console.error('模板保存失败', error);
      });
    },
    // 更新模版
    updateTemplate(templateId) {
      const templateData = { 
        id: templateId,
        data: JSON.stringify({widgets: this.widgets, dynamics: this.dynamics, dynamicsNotes: this.dynamicsNotes}),
      };
      axios.post('http://127.0.0.1:8088/api/templates/update', templateData).then(response => {
        console.log('模板更新成功', response);
      }).catch(error => {
        console.error('模板更新失败', error);
      });
    },
    // 加载模版
    loadTemplate(templateId) {
      axios.get(`http://127.0.0.1:8088/api/templates/get?id=${templateId}`, ).then(response => {
        const templateData = JSON.parse(response.data.data);
        this.applyTemplate(templateData);
        console.log('加载模板数据成功', response);
      }).catch(error => {
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
        return this.generateHtml(row);
      });
      this.pages = pages;
      // this.exportHtmlPages(pages);
    },
    generateHtml(row) {
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
      const content = this.generateHtml();
      axios.post('http://127.0.0.1:8088/api/pages/publish', {content: content}).then(response => {
        console.log('页面发布成功', response);
      }).catch(error => {
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
  }
}

</script>

<style scoped>
  .panel {
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }
  .canvas {
    max-width: 375px; /* 或者使用 100vw 来确保宽度在视口宽度内 */
    height: 667px; /* 模拟常见的H5页面高度 */
    margin: auto;
    border: 1px solid #ccc;
    position: relative;
    overflow: hidden;
  }
  
  .widget {
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
  }
</style>
