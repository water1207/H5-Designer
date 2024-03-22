<template>
    <a-upload
      v-model:file-list="fileList"
      name="file"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      :headers="headers"
      @change="handleChange"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        Click to Upload
      </a-button>
    </a-upload>
  </template>

    <script>
    import { UploadOutlined } from '@ant-design/icons-vue';
    export default {
      data() {
        return {
          fileList: [],
        };
    }
}
    </script>