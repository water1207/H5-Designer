<template>
  <div class="sub-title">
      <h3> {{ _title }} </h3>
      <div class="line-container">
        <div class="colored-bold-section"></div>
      </div>
  </div>
</template>

<script>
export default {
	props: {
    title: String,
    switchStates: {
      type: Array,
      default: () => [false],
    },
    notes: {
      type: Array,
      default: () => [''],
    },
	},
  data() {
    return {
      _title: this.title,
      _SwitchStates: [...this.switchStates],
      _Notes: [...this.notes],
    };
  },
  watch: {
    title(newVal) {
      this.myTitle = newVal;
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
  }
};
</script>
