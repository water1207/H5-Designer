<template><main>
  <a-modal v-model:open="open2" title="批次名称" @ok="submitExcel()" width="400px" cancelText="取消" okText="开始导出">
    <a-input v-model:value="batchName" autofocus placeholder="请输入批次名称" />
  </a-modal>
  <a-affix>
  <a-page-header
    style="padding: 5px 24px; background: #fff; border: 1px solid rgb(235, 237, 240)"
    title="Title"
    :sub-title="tName"
    @back="navigator()">
    <template #tags>
        <a-tag color="blue">编辑中</a-tag>
      </template>
    <template #extra>
      <a-button v-if="tId == ''" key="1" type="primary" @click = "open = true;">创建</a-button>
      <a-button v-else key="2" type="primary" @click = "updateTemplate()">更新</a-button>
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
        <div v-for="(item, index) in widgets" :key="index" class="widget">
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
    <a-col :span="6" :offset="1">
      <a-card v-if="tId == ''" title="导出设置" :bordered="false" style="width: 400px;margin-top: 40px;">
        <a-alert message="请先点击创建按钮，创建模版后再使用导出功能" type="warning" />
      </a-card>
      <a-card v-else-if="updateFlag" title="导出设置" :bordered="false" style="width: 400px;margin-top: 40px;">
        <a-alert message="存在未保存的修改，保存后再使用导出功能" type="warning" />
      </a-card>
      <a-card v-else="updateFlag" title="导出设置" :bordered="false" style="width: 400px;margin-top: 40px;">
        <a-flex gap="middle" vertical>
          <a-space  align="center">
            批量页面数量: 
            <a-input-number id="inputNumber" v-model:value="pageNum" :min="1" :max="10" />
          </a-space>
          <!-- 动态渲染上传组件 -->
          <a-button @click="triggerDownload" :disabled="urls.length != mySrc.length">下载 Excel 文件</a-button>
          <input type="file" @change="handleFileUpload" />
          <a-button type="primary" @click="open2 = true">导出</a-button>
        </a-flex>
        <a-collapse v-model:activeKey="activeKey" style="width: 350px;">
          <a-collapse-panel v-for="(img, index) in mySrc" :key="index" :header="`动态图片资源 image ${index + 1}`">
            <template #extra>
              <a-badge v-if="urls[index]!=null" status="success" />
              <a-badge v-if="urls[index]==null" status="error" />
              <a-button
                type="primary"
                size="small"
                :disabled="fileLists[index].length != pageNum"
                :loading="uploading[index]"  
                @click="() => handleUpload(index)">
                {{ uploading[index] ? '上传中' : '上传' }}
              </a-button>
            </template>
            <a-upload
              :file-list="fileLists[index]"
              :before-upload="(file) => beforeUpload(file, index)"
              @remove="(file) => handleRemove(file, index)"
              :multiple="true"
              list-type="picture"
              class="upload-list-inline">
              <a-button>
                <a-icon type="upload" /> 添加资源文件
              </a-button>
            </a-upload>

          </a-collapse-panel>
        </a-collapse> 
      </a-card>

    </a-col>

  </a-row>
  <a-modal v-model:open="open" title="模版名称" @ok="saveTemplate()" width="400px" cancelText="取消" okText="创建">
    <a-input v-model:value="tName" autofocus placeholder="请输入模版名称" />
  </a-modal>
</main>
</template>

<script>
import CombineWidget from '@/components/widgets/CombineWidget.vue'
import RadioWidget from '@/components/widgets/RadioWidget.vue'
import SubTitleWidget from '@/components/widgets/SubTitleWidget.vue'
import TitleWidget from '@/components/widgets/TitleWidget.vue'
import ProductWidget from '@/components/widgets/ProductWidget.vue'
import ImageWidget from '@/components/widgets/ImageWidget.vue'
import Image2Widget from '@/components/widgets/Image2Widget.vue'
import Image3Widget from '@/components/widgets/Image3Widget.vue'
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
    ImageWidget,
    Image2Widget,
    Image3Widget,
  },
  data() {
    return {
      widgets: [],
      pages: [],
      hoverIndex: null, // 用于跟踪鼠标悬浮的组件索引
      hideTimeoutId: null,
      tName: "未命名的模版",
      tId: this.$route.params.id,

      ws: XLSX.utils.aoa_to_sheet([[]]),
      urls: [],     // 用于存储上传图片的url 
      pageNum: 1,
      fileLists: [],
      file: null,
      uploading: [],
      open: false,
      mySrc: [],    // 用于模版中动态图片的标签，有几个位置的动态图片
      open2: false, //batchName输入框的弹出层
      batchName: '自定义批次',  
      activeKey: ['0'],
      updateFlag: false
    }
  },
  mounted() {
    if (this.tId) {
      this.loadTemplate(this.tId);
    }else{
      this.tId = '';
    }
  },
  methods: {
    downloadExcel() {
      const wb = XLSX.utils.book_new();
      this.preExcelData(this.urls);

      XLSX.utils.book_append_sheet(wb, this.ws, 'Sheet1');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

      // 修正了类型转换的逻辑
      const buffer = new ArrayBuffer(wbout.length);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < wbout.length; i++) {
        view[i] = wbout.charCodeAt(i) & 0xFF;
      }

      saveAs(new Blob([buffer], { type: "application/octet-stream" }), "test.xlsx");
    },
    triggerDownload() {
      if(this.tId == '') {
        message.error('请先创建模版');
        return;
      }
      this.updateTemplate2();
      this.downloadExcel();
    },

    // 添加组件至画布
    addWidget(type) {
      this.updateFlag = true;
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
        message.success({ content: '模板创建成功', key , duration: 2});
        console.log('模板保存成功', response);
        this.$router.push('/result/templatesave/'+response.data.id); 
        this.open = false;
      }).catch(error => {
        message.error({ content: '模板创建失败', key , duration: 2 });
        console.error('模板保存失败', error);
        this.open = false;
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
        this.$router.push('/result/templatesave/'+response.data.id);   
        console.log('模板更新成功', response);
      }).catch(error => {
        message.error({ content: '模板更新失败', key , duration: 2 });
        console.error('模板更新失败', error);
      });
    },
    // 更新后不跳转
    updateTemplate2() {
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
    loadTemplate(id) {
      let key = 'templateLoad';
      message.loading({ content: 'Loading...', key });
      axios.get(`http://127.0.0.1:8088/api/templates/get?id=${id}`, ).then(response => {
        const templateData = JSON.parse(response.data.data);
        this.tName = response.data.name;
        this.widgets = templateData.widgets;
        message.success({ content: '加载模版成功', key , duration: 2});
        console.log('加载模板数据成功', response);
      }).catch(error => {
        message.error({ content: '加载模版失败', key , duration: 2 });
        console.error("加载模板数据失败", error);
      });
    },

    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    submitExcel() {
      if(this.tId == '') {
        message.error('请先创建模版');
        return;
      }
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('tId', this.tId);
      formData.append('batchName', this.batchName);
      axios.post('http://127.0.0.1:8088/api/page/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        const pageData = JSON.parse(response.data.content);
        this.widgets = pageData.widgets
        this.$router.push('/result/templateExport'); 
        console.log('上传successfully', response.data);
      })
      .catch(error => {
        console.error('Error uploading file', error);
      });
    },

    // 移除组件
    removeWidget(index) {
      this.updateFlag = true;
      this.widgets.splice(index, 1);
    },
    // 上移组件
    moveUp(index) {
      this.updateFlag = true;
      if (index > 0) {
        const itemToMove = this.widgets[index];
        this.widgets.splice(index, 1);
        this.widgets.splice(index - 1, 0, itemToMove);
      }
    },
    // 下移组件
    moveDown(index) {
      this.updateFlag = true;
      if (index < this.widgets.length - 1) {
        const itemToMove = this.widgets[index];
        this.widgets.splice(index, 1);
        this.widgets.splice(index + 1, 0, itemToMove);
      }
    },
    initializeFileLists() {
      this.myNotes = [];
      this.mySrc = [];
      this.imageCounter = 1; // 用于动态图片计数

      this.widgets.forEach(widget => {
        const propKeys = Object.keys(widget.props).filter(key => !['switchStates', 'notes'].includes(key));
        widget.props.switchStates.forEach((state, index) => {
          if (state && propKeys[index] === 'src') {
            // 是动态图片
            let noteLabel = `image${this.imageCounter}`; // 生成动态图片的标签
            widget.props.notes[index] = noteLabel; // 更新原数组中的note为编号形式
            this.myNotes.push(noteLabel); // 添加到myNotes数组中
            this.mySrc.push(noteLabel);
            this.imageCounter++;
          } else if (state) {
            // 不是动态图片但switchStates为true
            this.myNotes.push(widget.props.notes[index]); // 直接添加到myNotes数组中
          }
        });
      });
      this.fileLists = this.mySrc.map(() => []);
    },
    handleRemove(file, index) {
      const newFileList = this.fileLists[index].slice();
      const fileIndex = newFileList.indexOf(file);
      if (fileIndex > -1) {
        newFileList.splice(fileIndex, 1);
        this.fileLists[index] = newFileList;
      }
    },
    beforeUpload(file, index) {
      this.fileLists[index] = [...this.fileLists[index], file];
      console.log(this.fileLists[index]);
      return false; // 阻止自动上传
    },
    handleUpload(index) {
      const formData = new FormData();
      this.fileLists[index].forEach(file => {
        formData.append('files[]', file);
      });
      this.uploading[index] = true;
      axios.post('http://127.0.0.1:8088/api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => {
        this.uploading = false;
        // 根据需要处理响应
        this.urls[index] = res.data;
        console.log('urls',this.urls.length);
        message.success('上传成功');
      }).catch(err => {
        this.uploading = false;
        console.log('上传失败',err);
        message.error('上传失败');
      });
    },
    generateWorksheetFromData(data, columnNumber) {
      data.forEach((value, index) => {
        const cellRef = XLSX.utils.encode_cell({ r: index+1, c: columnNumber });
        XLSX.utils.sheet_add_aoa(this.ws, [[value]], { origin: cellRef });
      });
    },
    preExcelData(sourceData) {
      const dynamics = this.widgets.flatMap(item => item.props.switchStates);
      const dynamicsNotes = this.widgets.reduce((notesAccumulator, item) => {
      const notesForWidget = item.props.notes.filter((note, index) => item.props.switchStates[index]);
        return notesAccumulator.concat(notesForWidget);
      }, []);
      let index = 1;
      let sourceIndex = 0;
      console.log(dynamics)
      dynamics.forEach((value) => {
        if (value == true) {
          let i = index;
          if(dynamicsNotes[i-1] == ('image'+ (sourceIndex+1).toString())) {
            this.generateWorksheetFromData(sourceData[sourceIndex++], index);
          }
          const cellRef = XLSX.utils.encode_cell({ r: 0, c: index++ }); // 第一行，不同列
          XLSX.utils.sheet_add_aoa(this.ws, [[ i+ '. ' +dynamicsNotes[i-1]]], { origin: cellRef });
        }
      });
    },
    navigator() {
      this.$router.push('/workspace/template'); 
    }
  },
  watch: {
    widgets: {
      deep: true,
      handler() {
        this.initializeFileLists(); // 当widgets变化时重新处理
      }
    }
  },
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
