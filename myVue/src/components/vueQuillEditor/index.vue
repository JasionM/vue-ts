<template>
	<div id="vueQuillEditor">
		<quill-editor
			:options="quillEditorOptions"
			@change="changeContent"
			v-model="content"
			ref="quillEditor">
			<div class="editor-toolbar" id="toolbar" slot="toolbar">
				<span v-for="(data, index) in editorToolbarData" :key="index" class="ql-formats" v-if="data.show">
					<button v-if="data.type == 'button'" type="button" :class="data.class" :value="data.value"></button>
					<span class="tip" v-if="data.title" :class="[tipColor]">{{data.title}}</span>
				</span>
				<span class="ql-formats">
					<button type="button" @click="fileClick('image')">
						<svg viewBox="0 0 18 18">
							<rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
							<circle class="ql-fill" cx="6" cy="7" r="1"></circle>
							<polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
						</svg>
					</button>
					<span class="tip" :class="[tipColor]">插入图片</span>
				</span>
				<!-- <span class="ql-formats" @click="fileClick('video')">
					<button type="button">
						<svg viewBox="0 0 18 18">
							<rect class="ql-stroke" height="12" width="12" x="3" y="3"></rect>
							<rect class="ql-fill" height="12" width="1" x="5" y="3"></rect>
							<rect class="ql-fill" height="12" width="1" x="12" y="3"></rect>
							<rect class="ql-fill" height="2" width="8" x="5" y="8"></rect>
							<rect class="ql-fill" height="1" width="3" x="3" y="5"></rect>
							<rect class="ql-fill" height="1" width="3" x="3" y="7"></rect>
							<rect class="ql-fill" height="1" width="3" x="3" y="10"></rect>
							<rect class="ql-fill" height="1" width="3" x="3" y="12"></rect>
							<rect class="ql-fill" height="1" width="3" x="12" y="5"></rect>
							<rect class="ql-fill" height="1" width="3" x="12" y="7"></rect>
							<rect class="ql-fill" height="1" width="3" x="12" y="10"></rect>
							<rect class="ql-fill" height="1" width="3" x="12" y="12"></rect>
						</svg>
					</button>
					<span class="tip">插入视频</span>
				</span> -->
			</div>
		</quill-editor>
	</div>
</template>

<script>
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend } from "quill-image-extend-module"
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

Quill.register("modules/ImageExtend", ImageExtend);
export default {
	props: {
		"backgroundColor": {  //背景颜色
			type: String,
			default: "#fff"
		}, 
		"borderColor": {   //编辑器边框颜色
			type: String,
			default: "#ddd"
		}, 
		"iconColor": {  //字体颜色（仅toolbar的icon）
			type: String,
			default: "#444"
		},
		"width": {
			type: String,
			default: "694px"
		},   //编辑器宽度
		"height": {
			type: String,
			default: "280px"
		},  //编辑器高度
		"iconBorderColor": {  //鼠标hover到icon时的边框颜色
			type: String,
			default: "#444"
		},
		"tipColor": {  //鼠标悬浮在icon上的提示框样式，参数只有white和black
			type: String,
			default: "black",
			validator(value) {
				return	["white", "black"].indexOf(value) !== -1;
			}
		}
	},
	data() {
		return {
			content: "",
			quillEditorOptions: {  //富文本编辑器的样式模块
				modules: {
					toolbar: "#toolbar",
					ImageExtend: {
						loading: true,
						name: "img",
						action: this.uploadUrl,
						response: res => {
							return res.url;
						}
					}
				},
			},
			editorToolbarData: [  //样式模块的配置参数
				{
					type: "button",
					value: false,
					class: ["ql-bold"],
					title: "加粗",
					show: true
				},
				{
					type: "button",
					value: false,
					class: ["ql-italic"],
					title: "斜体",
					show: true
				},
				{
					type: "button",
					value: false,
					class: ["ql-underline"],
					title: "下划线",
					show: false
				},
				{
					type: "button",
					value: false,
					class: ["ql-strike"],
					title: "忽略",
					show: false
				},
				{
					type: "button",
					value: false,
					class: ["ql-blockquote"],
					title: "引用块",
					show: true
				},
				{
					type: "button",
					value: false,
					class: ["ql-code-block"],
					title: "代码块",
					show: true
				},
				{
					type: "button",
					value: "1",
					class: ["ql-header"],
					title: "标题",
					show: true
				},
				{
					type: "button",
					value: "2",
					class: ["ql-header"],
					title: "标题2",
					show: false
				},
				{
					type: "button",
					value: "ordered",
					class: ["ql-list"],
					title: "有序列表",
					show: true
				},
				{
					type: "button",
					value: "bullet",
					class: ["ql-list"],
					title: "无序列表",
					show: true
				},
				{
					type: "button",
					value: "sub",
					class: ["ql-script"],
					title: "下标文字",
					show: false
				},
				{
					type: "button",
					value: "super",
					class: ["ql-script"],
					title: "上标文字",
					show: false
				},
				{
					type: "button",
					value: "-1",
					class: ["ql-indent"],
					title: "缩进",
					show: false
				},
				{
					type: "button",
					value: "+1",
					class: ["ql-indent"],
					title: "回退",
					show: false
				},
				{
					type: "button",
					value: "+1",
					class: ["ql-direction"],
					title: "对齐方式",
					show: true
				},
				{
					type: "button",
					value: false,
					class: ["ql-clean"],
					title: "清除格式",
					show: true
				},
				{
					type: "button",
					value: false,
					class: ["ql-link"],
					title: "插入链接",
					show: true
				},
				// {
				// 	type: "select",
				// 	class: [""],
				// 	title: "",
				// 	show: true,
				// 	children: [
				// 		{
				// 			value: "",
				// 			selected: false
				// 		}
				// 	]
				// }
			],
			uploadUrl: ""
		}
	},
	created() {

	},
	mounted() {
		this.initEditorTheme();
	},
	computed: {
		editor() {
			return this.$refs.quillEditor.quill;
		}
	},
	components: {
		quillEditor
	},
	methods: {
		changeContent() {
			
		},
		fileClick(type) {
			const input = document.createElement("input");
			input.type = "file";
			input.onchange = e => {
				let files = e.target.files;
				if (files.length == 0) {
					return;
				}
				let data = new FormData();
				console.log(files[0])
				data.append("file", files[0]);
				this.$post(
					this.uploadUrl,
					params,
					(res) => {
						this.editor.insertEmbed(
							this.editor.getSelection().index,
							'image',
							res.url
						)
					},
					(err) => {

					}
				)
			};
			input.click();
		},
		initEditorTheme(){
			let hasClass = (node, className) => {
				let result = false;
				for (let i = 0; i < node.classList.length; i++) {
					const item = node.classList[i];
					if (item == className) {
						result = true;
						break;
					}
				}
				return result;
			}

			let quillEditor = document.getElementsByClassName("quill-editor")[0];

			if (this.backgroundColor) {
				quillEditor.style.cssText = `width:${this.width};height:${this.height};background-color:${this.backgroundColor}`;
			}

			if (this.borderColor) {
				document.getElementsByClassName("editor-toolbar")[0].style.cssText = `border-color:${this.borderColor}`;
				document.getElementsByClassName("ql-container")[0].style.cssText = `border-color:${this.borderColor}`;
			}

			if (this.iconColor) {
				let strokeArray = document.getElementsByClassName("ql-stroke");
				for (let i = 0; i < strokeArray.length; i++) {
					const node = strokeArray[i];
					if (!hasClass(node, "ql-fill")) {
						node.style.cssText = `stroke:${this.iconColor}`;
					} else {
						node.style.cssText = `stroke:${this.iconColor};fill:${this.iconColor}`;
					}
				}

				let fillArray = document.getElementsByClassName("ql-fill");
				for (let i = 0; i < fillArray.length; i++) {
					const node = fillArray[i];
					if (!hasClass(node, "ql-stroke")) {
						node.style.cssText = `fill:${this.iconColor}`;
					} else {
						node.style.cssText = `stroke:${this.iconColor};fill:${this.iconColor}`;
					}
				}
			}

			if (this.iconBorderColor) {
				let parentNodes = document.getElementsByClassName("ql-formats");
				for (let i = 0; i < parentNodes.length; i++) {
					const parentNode = parentNodes[i];
					const nodes = parentNode.getElementsByTagName("button");
					for (let k = 0; k < nodes.length; k++) {
						const node = nodes[k];
						node.style.cssText = `border-color:${this.iconBorderColor}`;
					}
				}
			}
		}
	},
};
</script>

<style scoped lang="less">
	.quill-editor{
		margin: 0 auto;
	}
	.ql-formats{
		position: relative;
		span.tip{
			position: absolute;
			display: inline-block;
			padding: 4px 8px;
			border: 1px solid;
			font-size: 14px;
			white-space:nowrap;
			bottom: -34px;
			border-radius: 4px;
			left: 50%;
			transform: translateX(-50%);
			transition: opacity .3s ease .1s;
			opacity: 0;
			&:after{
				content: "";
				position: absolute;
				width: 7px;
				height: 7px;
				border-top: 1px solid;
				border-left: 1px solid;
				transform: rotate(45deg) translateX(-50%);
				left: 50%;
				bottom: 21px;
			}
			&.white{
				color: #444;
				background-color: #fff;
				border-color: #444;
				&:after{
					background-color: #fff;
					border-color: #444;
				}
			}
			&.black{
				color: #fff;
				background-color: rgba(0, 0, 0, .8);
				border: none;
				&:after{
					// background-color: rgba(0, 0, 0, .8);
					border: none;
					width: 0;
					height: 0;
					border-bottom: 7px solid rgba(0, 0, 0, .8);
					border-left: 6px solid transparent;
					border-right: 6px solid transparent;
					transform: rotate(0deg) translateX(-50%);
					top: -7px;
				}
			}
		}
		&:hover{
			button{
				border: 1px solid #444;
			}
			span.tip{
				opacity: 1;
			}
		}
	}
</style>