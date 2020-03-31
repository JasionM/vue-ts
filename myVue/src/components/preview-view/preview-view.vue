<template>
    <div 
        class="preview-view__container" 
        :style="{
            width: width,
            height: height
        }">
        <div class="perview-view__window"></div>
    </div>
</template>

<script>
    export default {
        props: {
            viewDOM: {
                type: HTMLElement,
                required: true
            },
            contentDOM: {
                type: HTMLElement,
                required: true
            },
            width: {
                type: String,
                default: '250px'
            },
            height: {
                type: String,
                default: '200px'
            },
            position: {
                type: String
            }
        },
        data() {
            return {
                cloneViewDOM: {},
                cloneContentDOM: {},
                previewContianerDOM: {}
            }
        },
        mounted() {
            this.cloneViewDOM = this.viewDOM.cloneNode(true)
            this.cloneContentDOM = this.contentDOM.cloneNode(true)
            
            this.previewContianerDOM = this.$el
            this.viewDOM.style.position = 'relative'

            this.$nextTick(_ => {
                const scale = this.previewContianerDOM.offsetWidth / this.cloneContentDOM.offsetWidth;
    
                console.log(this.previewContianerDOM.offsetWidth, this.cloneContentDOM.getBoundingClientRect())
    
                this.cloneContentDOM.style.position = 'static'
                this.cloneContentDOM.style.transform = `scale(${scale})`
    
                this.previewContianerDOM.appendChild(this.cloneContentDOM)
            })
        }
    }
</script>

<style lang="less" scoped>
.preview-view__container{
    position: absolute;
    right: 0;
    bottom: 0;
}
</style>