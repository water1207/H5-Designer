<template>
    <div>
      <h2> {{ myTitle }} </h2>
      <p> {{ myContent }} </p>
      <img :src="mySrc" :alt="myAlt" style="max-width: 100%;">
      <el-button @click="openDialog" align="center">编辑</el-button>
      <div style="display: flex; justify-content: center;">
        <audio controls>
          <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
          <!--- 其他格式的兼容设置 -->
          您的浏览器不支持audio元素。 
        </audio>
      </div>

  
      <el-dialog
        title="编辑内容"
        v-model="dialogVisible"
        @close="reset">
        <el-form>
          <el-form-item label="标题">
            <el-input v-model="myTitle"></el-input>
            <el-switch v-model="mySwitchStates[0]" active-text="添加备注"></el-switch>
            <el-input v-if="mySwitchStates[0]" v-model="myNotes[0]" placeholder="请输入标题备注"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" v-model="myContent"></el-input>
            <el-switch v-model="mySwitchStates[1]" active-text="添加备注"></el-switch>
            <el-input v-if="mySwitchStates[1]" v-model="myNotes[1]" placeholder="请输入内容备注"></el-input>
          </el-form-item>
          <el-form-item label="图片URL">
            <el-input v-model="mySrc"></el-input>
            <el-switch v-model="mySwitchStates[2]" active-text="添加备注"></el-switch>
            <el-input v-if="mySwitchStates[2]" v-model="myNotes[2]" placeholder="请输入图片URL备注"></el-input>
          </el-form-item>
        </el-form>
        <template v-slot:footer>
          <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="save">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: String,
      content: String,
      src: String,
      alt: String,
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
        dialogVisible: false,
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
      openDialog() {
        this.dialogVisible = true;
        this.myTitle = this.title;
        this.myContent = this.content;
        this.mySrc = this.src;
        this.mySwitchStates = [...this.switchStates];
        this.myNotes = [...this.notes];
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
  
  <style>

  </style>
  