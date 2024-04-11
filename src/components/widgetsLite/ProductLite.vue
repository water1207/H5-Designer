<template>
	<main>
		<div class="Product">
			<p style="font-weight: 500" >名称</p>
			<p style="white-space: pre-wrap;">{{ _name }}</p>
			<div class="line-container"></div>
			<p style="font-weight: 500">介绍</p>
			<p style="white-space: pre-wrap;">{{ _desc }}</p>  
		</div>
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
}
</script>
