<template>
  <main>
    <div class="Combine">
      <h2> {{ myTitle }} </h2>
      <div class="line">
      </div>
      <p > {{ myContent }} </p>
      <img :src="mySrc" alt="alt" style="max-width: 100%;">
    </div>
  </main>
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
  };
  </script>
  
  