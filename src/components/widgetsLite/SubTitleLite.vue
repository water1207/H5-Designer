<template>
  <main>
  <div class="SubTitle">
      <h3> {{ _title }} </h3>
      <div class="line-container">
        <div class="colored-bold-section"></div>
      </div>
  </div>
  </main>
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
      _switchStates: [...this.switchStates],
      _notes: [...this.notes],
    };
  },
  watch: {
    title(newVal) {
      this._title = newVal;
    },
    switchStates: {
      deep: true,
      handler(newVal) {
        this._switchStates = [...newVal];
      }
    },
    notes: {
      deep: true,
      handler(newVal) {
        this._notes = [...newVal];
      }
    }
  },
};
</script>
