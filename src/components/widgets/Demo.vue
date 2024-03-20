// 这是我的画布， 通过v-for循环遍历widgets数组，然后根据item.type的值来动态渲染对应的组件，这样就实现了画布的动态渲染。
// 现在有新的需求，我可以将widgets数组作为模版，在此基础上批量渲染多个界面，即widget数组中每个对象都有一个switchStates属性用于控制组件的内容是否是动态数据,如果switchStates为true则显示动态数据,否则为props本身的数据。
// 动态数据的来源是excel表格，excel表格中的一行数据就代表一个页面的动态数据，动态数据按照switchStates替换props的数据,如第一个对象:type为combine,switchStates的第1个值为true,并且第三个组件type:Product,switchStates的第0个值为true，所以Combine组件的content属性和Product组件的name属性都是动态值，
// 因此第一个页面中Combine的content属性的值是第一行excel第一列的值，Product的name属性的值是excel第二列的值。
// 由于每个页面在数据库中保存的是widgets数组的字符串，所以我希望将excel表格数据放到后端处理，后端根据excel表格和switchStates的逻辑来为每个页面的都生成相应的widgets数组并存储数据库，然后前端通过接口获取数据，直接请求页面的widgets数组即可显示页面。
<template>
  <div class="canvas">
    <div v-for="(item, index) in widgets" :key="index" class="widget">
      <component
        :is="item.type + 'Widget'"
        :key="index"
        v-bind="item.props"
      ></component>
    </div>
  </div>
</template>

<script>
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
      widgets: [
        {
          type: 'Combine',
          props: {
            title: '默认标题',
            content: '默认描述',
            src:  'https://raw.githubusercontent.com/WontonData/ArtShore/vue3/src/static/img/twitter-card.png',
            alt:  '默认图片' ,
            switchStates: [false, true, false],
            notes: ['', '', ''],
          },
        },{
            type: 'SubTitle',
            props: {
              title: '默认标题',
              switchStates: [false],
              notes: [''],
            },
        },{
            type: 'Product',
            props: {
              name: '默认名称',
              desc: '默认描述',
              switchStates: [true, false],
              notes: ['', ''],
            },
        },
      ],
    },
  }
};
</script>