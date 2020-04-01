<template>
    <div 
        class="preview-view__container" 
        >
        <div class="perview-view__window"></div>
        <div 
            class="preview-view__main"
            :style="{
                width: width,
                height: height
            }">
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
                cloneViewDOM: {},
                cloneContentDOM: {},
                previewContianerDOM: {},
                observer: {}
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

            let MutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver
            this.observer = new MutationObserver((mutationList) => {
                for (const mt of mutationList) {
                }
                this.setView()
            })
            
            this.observer.observe(this.contentDOM, { attributes: true })
            
           
        },
        methods: {
            setView() {
                this.previewContianerDOM.contains(this.cloneContentDOM) 
                    ? this.previewContianerDOM.removeChild(this.cloneContentDOM)
                    : null
                    
                this.cloneViewDOM = this.viewDOM.cloneNode(true)
                this.cloneContentDOM = this.contentDOM.cloneNode(true)
                
                this.viewDOM.style.position = 'relative'

                const cloneContentWidth = parseInt(this.cloneContentDOM.style.width)
                const scale = this.previewContianerDOM.offsetWidth / cloneContentWidth;
    
                this.cloneContentDOM.style.position = 'absolute'
                this.cloneContentDOM.style.left = '50%'
                this.cloneContentDOM.style.top = '50%'
                this.cloneContentDOM.style.cursor = 'default'
                this.cloneContentDOM.style.transform = `scale(${scale}) translate(-50%, -50%)`
                this.cloneContentDOM.style.transformOrigin = `left top`

                this.previewContianerDOM.appendChild(this.cloneContentDOM)
            }
        }
    }
</script>

<style lang="less" scoped>
.preview-view__container{
    position: absolute;
    right: 0;
    bottom: 0;
    .preview-view__main{
        position: relative;
    }
}
</style>