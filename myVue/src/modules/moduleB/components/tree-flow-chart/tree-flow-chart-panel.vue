<template>
    <div 
        class="tree-flow-chart-item__panel" 
        :class="{
                'single-node': childrenLength === 1,
                'multip-node': childrenLength > 1
            }">
        <div 
            class="tree-flow-chart-item__content__point">
            <div class="tree-node-line before" v-if="level !== 1"></div>
            <div class="tree-node-line after" v-if="childrenLength"></div>
            <div class="tree-flow-chart-item__absolute__content">
                <slot :level="level" :row="data.source">
                    <span class="flow-default-content">{{data.name}}</span>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TreeFlowChartPanel",
        props: {
            direction: {
                type: String,
                default: "bottom",
                validator(val) {
                    return ["top", "bottom", "left", "right"].includes(val)
                }
            },
            data: {
                type: Object
            },
            level: {
                type: Number,
                required: true
            },
            originOffset: { //树形面板中心点的位移（根据direction）
                type: Number,
                default: 0
            },
            lineLength: {
                type: Number,
                default:50
            },
        },
        data() {
            return {
            }
        },
        computed: {
            childrenLength() {
                const children = this.data.children || []
                return children.length
            }
        },
        mounted() {
            this.initPanel()
        },
        updated() {
            this.initPanel()
        },
        methods: {
            initPanel() {
                const panel = this.$el
                const originPoint = panel.querySelector(".tree-flow-chart-item__content__point")
                const absContent = originPoint.querySelector(".tree-flow-chart-item__absolute__content")

                const contentStyleObj = {
                    height: absContent.clientHeight,
                    width: absContent.clientWidth,
                }

                panel.style.height = this.lineLength * 2 + contentStyleObj.height + "px"
                panel.style.width = contentStyleObj.width + "px"

                const beforeLine = originPoint.querySelector(".tree-node-line.before")
                const afterLine = originPoint.querySelector(".tree-node-line.after")

                const newLineLength = contentStyleObj.height / 2 + this.lineLength + "px"
                if (beforeLine) {
                    beforeLine.style.height = newLineLength
                }
                if (afterLine) {
                    afterLine.style.height = newLineLength
                }

                this.$emit("updatePanelWidth", panel.style.width)
            }
        }
    }
</script>

<style lang="less" scoped>
.tree-flow-chart-item__panel{
    &.multip-node{
        position: relative;
        &::after{
            content: "";
            display: inline-block;
            width: 100%;
            height: 2px;
            background-color: #ddd;
            position: absolute;
            bottom: 0;
            left: 0;
        }
    }
    .tree-flow-chart-item__content__point{
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 1px;
        height: 1px;
        background-color: red;
        top: 50%;
        transform: translateY(-50%);
        .tree-node-line{
            width: 2px;
            background-color: #ddd;
            left: 50%;
            transform: translateX(-50%);
            position: absolute;
            &.before{
                bottom: 0;
            }
            &.after{
                top: 0;
            }
        }
        .tree-flow-chart-item__absolute__content{
            position: absolute;
            width: auto;
            height: auto;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
</style>