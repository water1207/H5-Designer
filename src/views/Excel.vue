<template>
    <div>
      <button @click="triggerDownload">下载 Excel 文件</button>
    </div>
  </template>
  
  <script>
  import { saveAs } from 'file-saver';
  import * as XLSX from 'xlsx';
  
  export default {
    methods: {
      addHeaders(ws, headers) {
        // 假设 headers 是一个字符串数组，每个元素对应一个列标题
        headers.forEach((header, index) => {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: index }); // 第一行，不同列
            XLSX.utils.sheet_add_aoa(ws, [[header]], { origin: cellRef });
        });
      },
      generateWorksheetFromData(data, columnNumber) {
        let ws = XLSX.utils.aoa_to_sheet([[]]); // 创建一个初始为空的工作表
        data.forEach((value, index) => {
          const cellRef = XLSX.utils.encode_cell({ r: index+1, c: columnNumber });
          XLSX.utils.sheet_add_aoa(ws, [[value]], { origin: cellRef });
        });
        return ws;
      },
      downloadExcel(data, columnNumber) {
        const wb = XLSX.utils.book_new();
        const ws = this.generateWorksheetFromData(data, columnNumber);
        this.addHeaders(ws, ['序号','ID','Name']); // 添加列标题
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
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
        const data = ['Alice', 'Bob', 'Charlie', 'Diana'];
        const columnNumber = 2; // 指定列号
        this.downloadExcel(data, columnNumber);
      }
    }
  }
  </script>
  