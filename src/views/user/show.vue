<template>
  <main>
    <div class="canvas2">
      <div v-for="(item, index) in widgets" :key="index" class="widget">
        <component
          :is="item.type + 'Lite'"
          :key="index"
          :editable="false"
          v-bind="item.props"
        ></component>
      </div>
    </div>
  </main>
  </template>
  
  <script>
  import CombineLite from '@/components/widgetsLite/CombineLite.vue'
  import RadioLite from '@/components/widgetsLite/RadioLite.vue'
  import SubTitleLite from '@/components/widgetsLite/SubTitleLite.vue'
  import TitleLite from '@/components/widgetsLite/TitleLite.vue'
  import ProductLite from '@/components/widgetsLite/ProductLite.vue'
  import ImageLite from '@/components/widgetsLite/ImageLite.vue'
  import Image2Lite from '@/components/widgetsLite/Image2Lite.vue'
  import Image3Lite from '@/components/widgetsLite/Image3Lite.vue'
  import axios from 'axios'

  export default {
    components: {
      CombineLite,
      RadioLite,
      SubTitleLite,
      TitleLite,  
      ProductLite,
      ImageLite,
      Image2Lite,
      Image3Lite
    },
    data() {
      return {
        pageId: this.$route.params.id,// 假设使用vue-router并从URL获取pageId
        widgets: [],
        kk:[]
      };
    },
    methods: {
      loadPage(id) {
        let key = 'init';
        axios.get(`http://127.0.0.1:8088/api/page/get?id=${id}`, ).then(response => {
          const pageData = JSON.parse(response.data.content);
          this.widgets = pageData.widgets
          this.pageName = response.data.name
          console.log('加载页面数据成功', response);
        }).catch(error => {
          console.error("加载页面数据失败", error);
        });
      },
    },
    mounted() {
      this.loadPage(this.pageId);
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

  .canvas2 {
    max-width: 450px; /* 或者使用 100vw 来确保宽度在视口宽度内 */
    min-height: 833px; /* 模拟常见的H5页面高度 */
    /* border: 1px solid #ccc; */
    margin: 0 auto;
    overflow: hidden;
    position: relative;
    padding: 10px 0;
    background: #fff;
    /* box-shadow: 0 4px 5px rgba(71, 71, 71, 0.3); */
    /* border-radius: 5px; */
  }
  .widget {
    margin: 2px;
    padding: 3px 5px;
    position: relative; 
    /* border: 1px solid #ccc; */
  }
  </style>
 