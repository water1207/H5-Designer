<template>
    <div class="Combine"
    @mouseenter="buttonVisiable = true" 
    @mousaeave="buttonVisiable = false">
      <h2 :style="ddstyle(0)"> {{ myTitle }} </h2>
      <div class="line">
      </div>
      <p :style="ddstyle(1)"> {{ myContent }} </p>
      <img :src="mySrc" alt="alt" style="max-width: 100%;">
      <a-button type="primary" @click="openDialog" v-if="buttonVisiable&&editable" class="editButton">编辑</a-button>
    </div>
    <a-modal :open="dialogVisible" title="编辑" @ok="save()" @cancel="handleCancel">
      <a-form :layout="vertical">
        <a-form-item label="标题">
          <a-col :span="6" >
              <a-switch v-model:checked="mySwitchStates[0]"></a-switch>
          </a-col>
          <a-col :span="11" style="margin: 0 0.1rem">
            <a-input v-if="mySwitchStates[0]" v-model:value="myNotes[0]" placeholder="请输入标题备注"></a-input>
          </a-col>
          <a-input v-model:value="myTitle" style="top: 10px;"></a-input>
        </a-form-item>
        <a-form-item label="内容">
          <a-col :span="6" >
              <a-switch v-model:checked="mySwitchStates[1]"></a-switch>
          </a-col>
          <a-col :span="11" style="margin: 0 0.1rem">
            <a-input v-if="mySwitchStates[1]" v-model:value="myNotes[1]" placeholder="请输入内容备注"></a-input>
          </a-col>
          <a-input v-model:value="myContent" style="top: 10px;"></a-input>
        </a-form-item>
        <a-form-item label="图片">
          <a-col :span="6" >
              <a-switch v-model:checked="mySwitchStates[2]"></a-switch>
          </a-col>
          <a-col :span="11" style="margin: 0 0.1rem">
            <a-input v-if="mySwitchStates[2]" v-model:value="myNotes[2]" placeholder="请输入图片备注"></a-input>
          </a-col>
          <a-input v-model:value="mySrc" style="top: 10px;"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>

  </template>
  
  <script>
  export default {
    props: {
      title: String,
      content: String,
      src: String,
      editable: {
        type: Boolean,
        default: true,
      },
      switchStates: {
        type: Array,
        default: () => [false, false, false],
      },
      notes: {
        type: Array,
        default: () => ['', '', ''],
      },
    },
    data() {
      return {
        editable: this.editable,
        dialogVisible: false,
        buttonVisiable: false,
        myTitle: this.title,
        myContent: this.content,
        mySrc: this.src,
        mySwitchStates: [...this.switchStates],
        myNotes: [...this.notes],
      };
    },
    watch: {
      title(newVal) {
        this.myTitle = newVal;
      },
      content(newVal) {
        this.myContent = newVal;
      },
      src(newVal) {
        this.mySrc = newVal;
      },
      switchStates: {
        deep: true,
        handler(newVal) {
          this.mySwitchStates = [...newVal];
        }
      },
      notes: {
        deep: true,
        handler(newVal) {
          this.myNotes = [...newVal];
        }
      }
    },
    methods: {
      ddstyle(index) {
      // 根据 switchStates 中对应 index 的值来决定是否添加阴影
        return this.switchStates[index] ? { textShadow: '2px 2px 4px #337ecc' } : {};
      },
      openDialog() {
        this.dialogVisible = true;
        this.myTitle = this.title;
        this.myContent = this.content;
        this.mySrc = this.src;
        this.mySwitchStates = [...this.switchStates];
        this.myNotes = [...this.notes];
      },
      handleCancel() {
        this.dialogVisible = false;
      },
      save() {
        this.$emit('update:content', {
          content: {
            title: this.myTitle,
            content: this.myContent,
            src: this.mySrc,
            switchStates: this.mySwitchStates, // 将开关状态数组传递给父组件
            notes: this.myNotes, // 将备注数组传递给父组件
          },
        });
        this.dialogVisible = false;
      }
    },
  };
  </script>
  
  