<template>
	<div class="Radio">
		<h4>
			{{ _title }}
		</h4>
		<div style="display: flex; justify-content: center;">
			<audio controls>
			<source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
			</audio>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		title: {
			title: String,
			src: String,
      switchStates: {
        type: Array,
        default: () => [false, false],
      },
      notes: {
        type: Array,
        default: () => ['', ''],
      },
		}
	},
	data() {
		return {
			_title: this.title,
			_src: this.src,
			_switchStates: this.switchStates,
			_notes: this.notes,
			dialogVisible: false,
		}
	},
}
</script>