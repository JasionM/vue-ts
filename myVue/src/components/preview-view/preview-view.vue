<template>
    <div 
        class="preview-view__container" 
        >
        <div 
            class="preview-view__main"
            :style="{
                width: width,
                height: height
            }">
            <div class="preview-view__window"></div>
        </div>
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
                cloneViewDOM: {},  //content的视图克隆DOM
                cloneContentDOM: {}, //content的克隆DOM
                previewContianerDOM: {},  //组件容器DOM
                observer: {},  //contentDOM的监听器
                viewWindowDOM: {},  //黑色小窗口
                scale: 1
            }
        },
        watch: {
            contentDOM: {
                deep: true,
                handler(val) {
                    console.log(val.getBoundingClientRect())
                }
            }
        },
        mounted() {
            this.previewContianerDOM = this.$el.querySelector('.preview-view__main')
            this.cloneViewDOM = this.viewDOM.cloneNode(true)
            this.cloneContentDOM = this.contentDOM.cloneNode(true)
            this.viewWindowDOM = this.$el.querySelector('.preview-view__window')

            let MutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver
            this.observer = new MutationObserver((mutationList) => {
                this.previewContianerDOM.contains(this.cloneContentDOM) 
                    ? this.previewContianerDOM.removeChild(this.cloneContentDOM)
                    : null
                    
                this.cloneViewDOM = this.viewDOM.cloneNode(true)
                this.cloneContentDOM = this.contentDOM.cloneNode(true)
                const cloneContentWidth = parseInt(this.cloneContentDOM.style.width)

                this.scale = this.previewContianerDOM.offsetWidth / cloneContentWidth

                this.setMainContent()
                this.setViewWindow()
            })
            
            this.observer.observe(this.contentDOM, { attributes: true })
            
           
        },
        methods: {
            setMainContent() {
                this.viewDOM.style.position = 'relative'
    
                this.cloneContentDOM.style.position = 'absolute'
                this.cloneContentDOM.style.left = '50%'
                this.cloneContentDOM.style.top = '50%'
                this.cloneContentDOM.style.cursor = 'default'
                this.cloneContentDOM.style.transform = `scale(${this.scale}) translate(-50%, -50%)`
                this.cloneContentDOM.style.transformOrigin = `left top`

                this.previewContianerDOM.appendChild(this.cloneContentDOM)
            },
            setViewWindow() {
                    
                this.viewWindowDOM.style.height = this.viewDOM.offsetHeight * this.scale + 'px'
                this.viewWindowDOM.style.width = this.viewDOM.offsetWidth * this.scale + 'px'

                const preViewContainerDOMRect = this.previewContianerDOM.getBoundingClientRect()
                const viewWindowDOMRect = this.viewWindowDOM.getBoundingClientRect()
                const cloneContentDOMRect = this.cloneContentDOM.getBoundingClientRect()

                const preViewPosition = {
                    left: cloneContentDOMRect.x - viewWindowDOMRect.x,
                    top: cloneContentDOMRect.y - viewWindowDOMRect.y
                }

                this.viewWindowDOM.style.left = preViewPosition.left + 'px'
                this.viewWindowDOM.style.top = preViewPosition.top + 'px'

            }
        }
    }
</script>

<style lang="less" scoped>
.preview-view__container{
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .5);
    .preview-view__main{
        position: relative;
    }
    .preview-view__window{
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, .1);
        z-index: 1;
    }
}
</style>