<template>
    <div class="Title">
    <h2> {{ _title }} </h2>
    </div>
</template>

<script>
export default {
	props: {
		title: String,
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
}
</script>
