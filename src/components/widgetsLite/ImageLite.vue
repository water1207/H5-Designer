<template>
	<main>
	<div class="Image">
		<img
			style="width: 100%;max-height: 400px;"
			:src="_src"
		/>
	</div>
	</main>
</template>

<script>
import axios from 'axios';
export default {
	props: {
		src: String,
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
			_src: this.src,
			_switchStates: [...this.switchStates],
			_notes: [...this.notes],
			fileList: [],
		};
	},
	watch: {
		src(newVal) {
			this._src = newVal;
		},
		switchStates: {
			deep: true,
			handler(newVal) {
				console.log(newVal)
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