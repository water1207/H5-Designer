<template>
	<main>
	<div class="Image2"
		@mouseenter="buttonVisiable=true"
		@mouseleave="buttonVisiable=false">
		<div class="image-wrapper">
		<img
			:src="_src"
			class = "responsive-image"
		/>
		</div>
		<a-button type="primary" @click="openDialog" v-if="buttonVisiable" class="editButton">编辑</a-button>
	</div>

	<a-modal :open="dialogVisible" title="编辑" @ok="save()" @cancel="handleCancel">
			<a-flex gap="small" vertical>
				<a-space align="center">
					图片
					<a-switch v-model:checked="_switchStates[0]" @change="change"></a-switch>
					<!-- <a-input v-if="_switchStates[0]" v-model:value="_notes[0]" placeholder="动态图片资源备注"></a-input> -->
				</a-space>
				<a-upload
					v-model:file-list="fileList"
					:customRequest="customUpload"
					list-type="picture"
				>
					<a-button>
						<upload-outlined></upload-outlined>
						upload
					</a-button>
				</a-upload>
			</a-flex>
  </a-modal>

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
			buttonVisiable: false,
			dialogVisible: false,
			fileList: [],
			hhh: [false],
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
	methods: {
		change(){
			if(this._switchStates[0]){
				this._src = "https://designer-1303826627.cos.ap-shanghai.myqcloud.com/dt.jpg"
			}else{
				this._src = "https://designer-1303826627.cos.ap-shanghai.myqcloud.com/empty.jpg"
			}
		},
		customUpload(file) {
			console.log(file)
			const form = new FormData()
			form.append('file', file.file)
			axios.post('http://124.222.242.75:8088/api/file/image/upload', form).then(res => {
				file.onSuccess(res.data)
				this._src = res.data;
				file.status = 'success'
				console.log("图片上传成功",res.data)
			}).catch(err => {
				file.onError(err)
				file.status = 'error'
			})
		},
		save() {
			this.$emit('update:content', {
				content: {
					src: this._src,
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