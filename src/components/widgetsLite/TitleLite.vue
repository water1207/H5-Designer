<template>
	<main>
    <div class="Title">
    	<h2> {{ _title }} </h2>
    </div>
	</main>
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
		editable: {
			type: Boolean,
			default: true,
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
	},
}
</script>
