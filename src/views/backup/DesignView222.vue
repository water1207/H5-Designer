<template>
  <main>
  <a-affix>
  <a-page-header
    style="padding: 5px 24px; background: #fff; border: 1px solid rgb(235, 237, 240)"
    title="Title"
    :sub-title="tName"
    @back="() => null">
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
          <a-button @click="addWidget('CombineWidget')">Add CombineWidget</a-button>
          <a-button @click="addWidget('RadioWidget')">Add RadioWidget</a-button>
          <a-button @click="addWidget('SubTitleWidget')">Add SubTitleWidget</a-button>
          <a-button @click="addWidget('TitleWidget')">Add TitleWidget</a-button>
          <a-button @click="addWidget('ProductWidget')">Add ProductWidget</a-button>
          <a-button @click="addWidget('ImageWidget')">Add 弹性图片</a-button>
          <a-button @click="addWidget('Image2Widget')">Add 16:9固定比例图片</a-button>
          <a-button @click="addWidget('Image3Widget')">Add 与内容齐平的图片</a-button>
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
    <a-col :span="7" :offset="1">
      <a-timeline>
        <template v-for="(note, index) in myNotes" :key="index">
          <a-timeline-item v-if="note.startsWith('image')">
            <a-space align="center">
              {{ note }}
            </a-space>
          </a-timeline-item>
          <a-timeline-item v-else>
            {{ note }}
          </a-timeline-item>
        </template>
      </a-timeline>
      <a-upload
        v-model:file-list="fileList"
        :before-upload="beforeUpload()" @remove="handleRemove"
        :multiple="true"  
        list-type="picture"
        class="upload-list-inline">
        <a-button>
          <upload-outlined></upload-outlined>
          添加资源文件
        </a-button>
      </a-upload>
      <a-button
          type="primary"
          :disabled="fileList.length === 0"
          :loading="uploading"
          style="margin-top: 16px"
          @click="handleUpload"
        >
          {{ uploading ? '上传中' : '上传' }}
      </a-button>

    <div>
      <a-button @click="triggerDownload">下载 Excel 文件</a-button> 
    </div>
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
      urls: [],
      fileList: [],
      uploading: false,
      open: false,
      myNotes: [],
      imageCounter: 0,   //图片个数
      mySrc: [],
      activeKey: ['0'], 
    }
  },
  created() {
    if (this.tId) {
      this.loadTemplate(this.tId);
    }
  },
  methods: {
    processWidgets() {
      this.myNotes = [];
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

      // this.myNotes.forEach((note, index) => {
      //   this.fileLists.push([]);
      // });
    },
    // panel2
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList= newFileList;
    },
    beforeUpload(file) {
      console.log(file)
      this.fileList = [...this.fileList, file];
      console.log(this.fileList)
      return false;
    },
    handleUpload()  {
      const formData = new FormData();
      this.fileList.forEach(file => {
        formData.append('files[]', file.originFileObj);
      });
      this.uploading = true;
      axios.post('http://124.222.242.75:8088/api/file/upload', formData).then(res => {
        this.uploading = false;
        this.urls = res.data;
        message.success('upload successfully'+this.urls);
      }).catch(err => {
        this.uploading = false;
        message.error('upload failed');
      })
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
          if(dynamicsNotes[i-1] == 'iiimage') {
            console.log('hhh '+ sourceData[sourceIndex])
            this.generateWorksheetFromData(sourceData[sourceIndex], index);
          }
          const cellRef = XLSX.utils.encode_cell({ r: 0, c: index++ }); // 第一行，不同列
          XLSX.utils.sheet_add_aoa(this.ws, [[ i+ '. ' +dynamicsNotes[i-1]]], { origin: cellRef });
        }
      });
    },
    downloadExcel() {
      const wb = XLSX.utils.book_new();
      this.preExcelData([this.urls,[]]);

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
      this.downloadExcel();
    },

    // 添加组件至画布
    addWidget(type) {
      const defaultProps = {
          CombineWidget: {
              type: 'Combine',
              props: {
                title: '默认标题',
                content: '默认描述',
                src:  'https://designer-1303826627.cos.ap-shanghai.myqcloud.com/defalut.png',
                switchStates: [false, false, false],
                notes: ['', '', 'iiimage'],
              },
          },
          ImageWidget: {
              type: 'Image',
              props: {
                src: 'https://designer-1303826627.cos.ap-shanghai.myqcloud.com/defalut.png',
                switchStates: [false],
                notes: ['iiimage'],
              },
          },
          Image2Widget: {
              type: 'Image2',
              props: {
                src: 'https://designer-1303826627.cos.ap-shanghai.myqcloud.com/defalut.png',
                switchStates: [false],
                notes: ['iiimage'],
              },
          },
          Image3Widget: {
              type: 'Image3',
              props: {
                src: 'https://designer-1303826627.cos.ap-shanghai.myqcloud.com/defalut.png',
                switchStates: [false],
                notes: ['iiimage'],
              },
          },
          RadioWidget: {
              type: 'Radio',
              props: {
                title: '默认标题',
                src:  'https://designer-1303826627.cos.ap-shanghai.myqcloud.com/defalut.png',
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
    // 保存并创建模版
    saveTemplate() {
      let key = 'templateSave';
      message.loading({ content: 'Loading...', key });

      const widgets = this.widgets;

      const templateData = { 
        name: this.tName,
        data: JSON.stringify({widgets}),
      };

      // 根据需要返回或使用 dynamics 和 dynamicsNotes
      axios.post('http://124.222.242.75:8088/api/templates/save', templateData).then(response => { 
        message.success({ content: '模板创建成功', key , duration: 2});
        console.log('模板保存成功', response);
        this.$router.push('/result/templatesave'); 
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

      axios.post('http://124.222.242.75:8088/api/templates/update', templateData).then(response => {
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
      axios.get(`http://124.222.242.75:8088/api/templates/get?id=${id}`, ).then(response => {
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
    submitFile() {
      const formData = new FormData();
      formData.append('file', this.file);

      axios.post('http://124.222.242.75:8088/api/page/upload', formData, {
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
  },
  watch: {
    widgets: {
      deep: true,
      handler() {
        this.processWidgets(); // 当widgets变化时重新处理
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

