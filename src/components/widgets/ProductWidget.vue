<template>
	<main>
		<div class="Product"
		@mouseenter="buttonVisiable=true"
		@mouseleave="buttonVisiable=false">
			<p style="font-weight: 500" >名称</p>
			<p :style="ddstyle(0)" style="white-space: pre-wrap;">{{ _name }}</p>
			<div class="line-container"></div>
			<p style="font-weight: 500">介绍</p>
			<p :style="ddstyle(1)" style="white-space: pre-wrap;">{{ _desc }}</p>  
			<a-button type="primary" @click="openDialog" v-if="buttonVisiable" class="editButton">编辑</a-button>
		</div>

		<a-modal :open="dialogVisible" title="编辑" @ok="save()" @cancel="handleCancel">
			<a-flex gap="small" vertical>
				<a-space align="center">
					名称
					<a-switch v-model:checked="_switchStates[0]"></a-switch>
					<a-input v-if="_switchStates[0]" v-model:value="_notes[0]" placeholder="动态产品名备注"></a-input>
				</a-space>
				<a-input v-model:value="_name"></a-input>
				<a-space align="center">
					介绍
					<a-switch v-model:checked="_switchStates[1]"></a-switch>
					<a-input v-if="_switchStates[0]" v-model:value="_notes[1]" placeholder="动态产品介绍备注"></a-input>
				</a-space>
				<a-textarea v-model:value="_desc"></a-textarea>
			</a-flex>
  	</a-modal>
	</main>
</template>

<script>
export default {
	props: {
		name: String,
		desc: String,
		switchStates: {
				type: Array,
				default: () => [false, false],
		},
		notes: {
				type: Array,
				default: () => ['', '', ''],
		},
	},
	data() {
		return {
			_name: this.name,
			_desc: this.desc,
			_switchStates: [...this.switchStates],
			_notes: [...this.notes],
			buttonVisiable: false,
			dialogVisible: false,
		};
	},
	watch: {
		name(newVal) {
			this._name = newVal;
		},
		desc(newVal) {
			this._desc = newVal;
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
		ddstyle(index) {
			return this.switchStates[index] ? { textShadow: '2px 2px 4px #337ecc' } : {};
		},
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
}
</script>
