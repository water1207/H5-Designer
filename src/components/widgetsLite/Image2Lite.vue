<template>
	<main>
	<div class="Image2">
		<div class="image-wrapper">
		<img
			:src="_src"
			class = "responsive-image"
		/>
		</div>
	</div>
	</main>
</template>

<script>
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

<style scoped>
.image-wrapper {
  width: 100%; /* Container width */
  height: 0;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  position: relative;
  background-color: #f0f0f0; /* Optional: any background color */
}

.responsive-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover the container, maintain aspect ratio */
}
</style>