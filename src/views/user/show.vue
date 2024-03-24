<template>
  <div class="show">
    <div class="canvas">
      <div v-for="(item, index) in widgets" :key="index" class="widget">
        <component
          :is="item.type + 'Widget'"
          :key="index"
          :editable="false"
          v-bind="item.props"
        ></component>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import CombineWidget from '@/components/widgets/CombineWidget.vue';
  import RadioWidget from '@/components/widgets/RadioWidget.vue';
  import SubTitleWidget from '@/components/widgets/SubTitleWidget.vue';
  import TitleWidget from '@/components/widgets/TitleWidget.vue';
  import ProductWidget from '@/components/widgets/ProductWidget.vue';
  import axios from 'axios'

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
        pageId: this.$route.params.id, // 假设使用vue-router并从URL获取pageId
        widgets: [],
        kk:[]
      };
    },
    methods: {
      
      loadTemplate() {

        console.log(this.kk); 
        axios.get(`http://192.168.31.43:8088/api/templates/get?id=${this.pageId}`, ).then(response => {
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
      renderWidgets() {
        // 基于this.widgets来渲染组件到canvas上
        // 这部分具体实现依赖于你的canvas库和widget渲染逻辑
      }
    },
    mounted() {
      this.loadTemplate();
    }
  }
  </script>
  
  <style scoped>
  .show {
    margin: 0 auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    max-width: 400px;
  }

  .canvas {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
  }

  .widget {
    margin: 2px;
    padding: 5px;
    position: relative; 
    border: 1px solid #ccc;
    width: fit-content;
  }
  </style>
 