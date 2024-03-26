<template>

</template>

<script>
import axios from 'axios';
import { message } from 'ant-design-vue';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx'


export default {
  data() {
    return {
      myImg: ['1','2'], // 初始化你的图片数组
      fileLists: [], // 每个上传组件的文件列表
      uploading: false,
      ws: XLSX.utils.aoa_to_sheet([[]]),
      urls: [],
      widgets: [],
      activeKey: ['0'], // 控制哪个折叠面板是打开的
      pageNum: 0,
      done: 0,
    };
  },
  created() {
    this.initializeFileLists();
    this.loadTemplate(20);
  },
  methods: {
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
    initializeFileLists() {
      this.fileLists = this.myImg.map(() => []);
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
      this.uploading = true;
      axios.post('http://127.0.0.1:8088/api/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => {
        this.uploading = false;
        // 根据需要处理响应
        this.urls[index] = res.data;
        console.log('urls',this.urls.length);
        console.log('myImg',this.myImg.length);
        message.success('上传成功');
      }).catch(err => {
        this.uploading = false;
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
      this.downloadExcel();
    },
  },
};
</script>
<style scoped>
.upload-list-inline :deep(.ant-upload-list-item) {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.upload-list-inline [class*='-upload-list-rtl'] :deep(.ant-upload-list-item) {
  float: right;
}
</style>
