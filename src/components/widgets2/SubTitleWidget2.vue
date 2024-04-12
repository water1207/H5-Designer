<template>
  <main>
  <div class="SubTitle"
    @mouseenter="buttonVisiable=true"
		@mouseleave="buttonVisiable=false">
      <h3> {{ _title }} </h3>
      <div class="line-container">
        <div class="colored-bold-section"></div>
      </div>
      <a-button type="primary" size="small" @click="openDialog" v-if="buttonVisiable" class="editButton">编辑</a-button>
  </div>

  <a-modal :open="dialogVisible" title="编辑" @ok="save()" @cancel="handleCancel">
			<a-flex gap="small" vertical>
				<a-space align="center">
					子标题
				</a-space>
				<a-input v-model:value="_title"></a-input>
			</a-flex>
  </a-modal>
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
      buttonVisiable: false,
			dialogVisible: false,
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
  methods: {
		save() {
			this.$emit('update:content', {
				content: {
					title: this._title,
					switchStates: this._switchStates, // 将开关状态数组传递给父组件
					notes: this._notes, // 将备注数组传递给父组件
				},
			});
			this.dialogVisible = false;
		},
		handleCancel() {
			this.dialogVisible = false;
		},
		openDialog() {
			this.dialogVisible = true;
		},
  },
};
</script>
