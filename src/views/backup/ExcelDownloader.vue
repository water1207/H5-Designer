<template>
  <main>
    <div>
      <a-upload
      v-model:file-list="fileList"
      :before-upload="beforeUpload" @remove="handleRemove"
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
    </div>
    <div>
      <a-button @click="triggerDownload">下载 Excel 文件</a-button> 
    </div>
  </main>
  </template>
  
  <script>
  import { saveAs } from 'file-saver';
  import * as XLSX from 'xlsx';
  import axios from 'axios';
  import {message} from 'ant-design-vue';

  export default {
    data() {
      return {
        ws: XLSX.utils.aoa_to_sheet([[]]),
        urls: [],
        fileList: [],
        widgets: [],
        uploading: false,
        templateId: null,
      };
    },
    mounted() {
        let key = 'templateLoad';
        message.loading({ content: 'Loading...', key });
        axios.get(`http://124.222.242.75:8088/api/templates/get?id=14`).then(response => {
          const templateData = JSON.parse(response.data.data);
          this.widgets = templateData.widgets;
          
          message.success({ content: '加载模版成功', key , duration: 2});
          console.log('加载模板数据成功', response);
        }).catch(error => {
          message.error({ content: '加载模版失败', key , duration: 2 });
          console.error("加载模板数据失败", error);
        });
    },
    methods: {
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList= newFileList;
      },
      beforeUpload(file) {
        this.fileList = [...this.fileList, file];
        console.log(this.fileList)
        return false;
      },
      handleUpload()  {
        const formData = new FormData();
        this.fileList.forEach(file => {
          console.log(file)
          formData.append('files[]', file.originFileObj);
        });
        this.uploading = true;
        axios.post('http://124.222.242.75:8088/api/file/upload', formData).then(res => {
          this.uploading = false;
          this.urls = res.data;
          message.success('upload successfully');
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
              this.generateWorksheetFromData(sourceData[sourceIndex], index);
              sourceIndex++;
            }
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: index++ }); // 第一行，不同列
            XLSX.utils.sheet_add_aoa(this.ws, [[ i+ '. ' +dynamicsNotes[i-1]]], { origin: cellRef });
          }
        });
      },
      downloadExcel() {
        const wb = XLSX.utils.book_new();
        console.log(this.widgets)
        this.preExcelData([this.urls,[]]);

        XLSX.utils.book_append_sheet(wb, this.ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  
        // 修正了类型转换的逻辑
        const buffer = new ArrayBuffer(wbout.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < wbout.length; i++) {
          view[i] = wbout.charCodeAt(i) & 0xFF;
        }
  
        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "custom-column.xlsx");
      },
      triggerDownload() {
        this.downloadExcel();
      }
    }
  }
  </script>
  
<style scoped>
/* tile uploaded pictures */
.upload-list-inline :deep(.ant-upload-list-item) {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.upload-list-inline [class*='-upload-list-rtl'] :deep(.ant-upload-list-item) {
  float: right;
}
</style>