<template>
	<main>
	<div class="Image"
		@mouseenter="buttonVisiable=true"
		@mouseleave="buttonVisiable=false">
		<img
			style="width: 100%;max-height: 400px;"
			:src="_src"
		/>
		<a-button type="primary" @click="openDialog" v-if="buttonVisiable" class="editButton">编辑</a-button>
	</div>

	<a-modal :open="dialogVisible" title="编辑" @ok="save()" @cancel="handleCancel">
			<a-flex gap="small" vertical>
				<a-space align="center">
					图片
					<a-switch v-model:checked="_switchStates[0]" @change="change"></a-switch>
					<a-input v-if="_switchStates[0]" v-model:value="_notes[0]" placeholder="动态图片资源备注"></a-input>
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
				this._src = "https://designer-1303826627.cos.ap-shanghai.myqcloud.com/dt.jpg?q-sign-algorithm=sha1&q-ak=AKIDPk1Litry51whI2JRFtGQA5fPexyEjD87VK95r5bxXWwuR5-ecIhRwsPBRUlmdKOr&q-sign-time=1711459394;1711462994&q-key-time=1711459394;1711462994&q-header-list=host&q-url-param-list=ci-process&q-signature=c19050590113a3be0c9a75af632ffe6174b340e4&x-cos-security-token=okfUBNIFjSzImAE3s7cK7D1LdMLgEoma9c15f180ef4c9f5819339c5ca2629b5d7_h8VVcc_btKcmoTJq3PqDVqZualn7hmOvyZVFqxkqQwT4n0tJFmhNkm0s7VBqNwuSKkgFKzadvONMW7Ky4SG996eQMoS6HslfGy2O_EZptiNrVKilsZsPiUJMMbDBmu9NJXjWBHUoAdK3hHclIn__bLN_nVDtceS3SLO6tghG3nUm4nRMCl08UNUGhQkscwreIJ5e2c9yE4eo7vknb74w&ci-process=originImage"
			}else{
				this._src = "https://designer-1303826627.cos.ap-shanghai.myqcloud.com/empty.jpg?q-sign-algorithm=sha1&q-ak=AKIDErhpKFA2AHoDrq_-pgZeZRnGnZYM-mgJ6GGsIcmqWbVmO6JDucyMHC13NT7WoGey&q-sign-time=1711459761;1711463361&q-key-time=1711459761;1711463361&q-header-list=host&q-url-param-list=ci-process&q-signature=9bd20f85be388464a24d24260fa672cfad8010bb&x-cos-security-token=okfUBNIFjSzImAE3s7cK7D1LdMLgEomaa11ef7ae0acac6dd1cee233aa766fcec7_h8VVcc_btKcmoTJq3PqGxNES3aJpvQYGbvyXA7001-bDuABxc4RrqZm5aIHg1cEqGwOVX2kDrDjnUGe6wMKpOaYmw-ojYnrS1-NFmS6At_rvWQivIJ9lTbMR6_8JfawUdD3VD5PekRY1iK59XwI8Ly_csQ2mKyUhX1euw6Nm-a6FZuTWKMP0wzLRtRf9c5a--waYy_wTTr1u47ja7BlQ&ci-process=originImage"
			}
		},
		customUpload(file) {
			console.log(file)
			const form = new FormData()
			form.append('file', file.file)
			axios.post('http://127.0.0.1:8088/api/file/image/upload', form).then(res => {
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