<template>
  <main>
    <div class="canvas2">
      <div v-for="(item, index) in widgets" :key="index" class="widget">
        <component
          :is="item.type + 'Widget'"
          :key="index"
          :editable="false"
          v-bind="item.props"
        ></component>
      </div>
    </div>
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
  import axios from 'axios'

  export default {
    components: {
      CombineWidget,
      RadioWidget,
      SubTitleWidget,
      TitleWidget,
      ProductWidget,
      ImageWidget,
      Image2Widget,
      Image3Widget
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
        axios.get(`http://124.222.242.75:8088/api/page/get?id=${id}`, ).then(response => {
          const pageData = JSON.parse(response.data.content);
          this.widgets = pageData.widgets
          this.pageName = response.data.name
          message.success({ content: '加载页面成功', key , duration: 2});
          console.log('加载页面数据成功', response);
        }).catch(error => {
          message.error({ content: '加载页面失败', key , duration: 2});
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
 