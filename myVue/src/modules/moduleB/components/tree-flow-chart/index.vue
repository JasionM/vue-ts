<template>
    <div 
        class="tree-flow-chart__view"
        :style="{backgroundColor: backGroundColor}"
        @mousedown="viewMousedown" 
        @mousemove="viewMousemove" 
        @mouseup="viewMouseup"
        @mouseleave="overRanged"
        @mousewheel="viewSizeChange">
        <div class="tree-flow-chart__container" :class="{active: mouseDown}" style="left: 0;top: 0;">
            <TreeFlowChartItem 
                v-for="(item, idx) in matchedData"
                :key="idx"
                :direction="direction"
                :data="item"
                :props="props"
                :level="1"
                :lineColor="lineColor"
                :backGroundColor="backGroundColor"
                :origin-offset="originOffset">
                <template slot-scope="scope">
                    <slot v-bind="scope"></slot>
                </template>
            </TreeFlowChartItem>
        </div>
    </div>
</template>

<script>
    import TreeFlowChartItem from './tree-flow-chart-item'
    export default {
        name: 'TreeFlowChart',
        props: {
            direction: {  //树形布置方向
                type: String,
                default: "bottom",
                // validator(val) {
                //     return ["top", "bottom", "left", "right"].includes(val)
                // }
            },
            data: {  //数据源
                type: [Object, Array],
                required: true
            },
            props: {  //树形属性的结构映射
                type: Object,
                default() {
                    return {
                        name: "name",
                        children: "children"
                    }
                }
            },
            originOffset: { //树形面板中心点的位移（根据direction）
                type: Number,
                default: 0
            },
            backGroundColor: {  //背景色
                type: String,
                default: "#fff"
            },
            lineColor: { //链接线的颜色
                type: String,
                default: "#ddd"
            }
        },
        components: {
            TreeFlowChartItem
        },
        data() {
            return {
                maxPanelLength: 0,
                childrenLengthArr: [],
                treeDeep: 0,
                startPostion: {
                    x: 0,
                    y: 0
                },
                containerStartPosition: {
                    left: 0,
                    top: 0
                },
                containerDOM: {},
                viewDOM: {},
                mouseDown: false,
                overRange: false,
                scale: 1,
            }
        },
        computed: {
            matchedData() {
                const isArray = Object.prototype.toString.call(this.data) === '[object Array]'
                let res = isArray ? this.data : [this.data]
                this.treeDeep = this.getTreeDeep(res)
                let currentLevelChildrenLength = 0
                res.forEach(item => {
                    let children = item[this.props.children] || []
                    currentLevelChildrenLength += (children.length || 1)
                })
                res.forEach(item => {
                    let children = item[this.props.children] || []
                    item.widthPercentage = parseInt((children.length || 1) / currentLevelChildrenLength * 100)
                })
                return res 
            },
            maxChildrenLength() {
                return Math.max(...this.childrenLengthArr)
            }
        },
        watch: {
            matchedData: {
                deep: true,
                handler(val) {
                    
                }
            },
            maxChildrenLength(val) {
                this.containerWidth()
            }
        },
        created() {
            
        },
        mounted() {
            this.containerWidth()
            this.containerDOM = this.$el.querySelector('.tree-flow-chart__container');
            this.viewDOM = this.$el;
        },
        methods: {
            viewSizeChange(e) {
                const wheelDelta = e.wheelDelta
                if (wheelDelta > 0) {
                    this.scale += 0.05
                } else if (wheelDelta < 0) {
                    this.scale -= 0.05
                }
                this.containerDOM.style.transform = `scale(${this.scale})`
            },
            overRanged() {
                this.overRange = true
            },
            viewMousedown(e) {
                this.mouseDown = true
                this.overRange = false
                this.startPostion.x = e.pageX
                this.startPostion.y = e.pageY
                this.containerStartPosition.left = parseInt(this.containerDOM.style.left || 0)
                this.containerStartPosition.top = parseInt(this.containerDOM.style.top || 0)
            },
            viewMousemove(e) {
                if (!this.mouseDown || this.overRange) {
                    return false
                }

                const containerDOMRect = this.containerDOM.getBoundingClientRect()
                const viewDOMRect = this.viewDOM.getBoundingClientRect()

                const overRange = {
                    left: containerDOMRect.x >= viewDOMRect.x,
                    right: (containerDOMRect.x + containerDOMRect.width) 
                            <= (viewDOMRect.x + viewDOMRect.width),
                    top: containerDOMRect.y >= viewDOMRect.y,
                    bottom: (containerDOMRect.y + containerDOMRect.height) <= (viewDOMRect.y + viewDOMRect.height)
                }

                const offset = {
                    x: e.pageX - this.startPostion.x,
                    y: e.pageY - this.startPostion.y
                }

                const startLeft = parseInt(this.containerStartPosition.left || 0)
                const startTop = parseInt(this.containerStartPosition.top || 0)

                if ((offset.x > 0 && !overRange.left) || (offset.x < 0 && !overRange.right)) {
                    this.containerDOM.style.left = startLeft + offset.x + "px"
                }

                if ((offset.y > 0 && !overRange.top) || (offset.y < 0 && !overRange.bottom)) {
                    this.containerDOM.style.top = startTop + offset.y + "px"
                }
            },
            viewMouseup(e) {
                this.mouseDown = false
            },
            getTreeDeep(tree, childrenProp = 'children', level = 0) {
                if (tree.length) {
                    this.childrenLengthArr[level] = parseInt(this.childrenLengthArr[level] || 0) + tree.length

                    let max = ++level

                    tree.forEach(item => {
                        let children = item[childrenProp] || []
                        if (children.length) {
                            let height = this.getTreeDeep(children, childrenProp, level)
                            max = height > max ? height : max
                        }
                    })
                    return max
                } else {
                    return level
                }
                
            },
            containerWidth() {
                let panels = this.$el.querySelectorAll(".tree-flow-chart-item__panel");
                if (panels.length) {
                    let panel = panels[0]
                    let contentWdith = panel.querySelector('.tree-flow-chart-item__absolute__content').clientWidth;
                    let container = this.$el.querySelector('.tree-flow-chart__container')
                    let width = contentWdith * this.maxChildrenLength * this.treeDeep + 'px'
                    container.style.width = width
                }
            },
            getWidthPercentage(item, level) {
                return parseInt(item[this.props.children] / this.childrenLengthArr[level] * 100)
            }
        }
    }
</script>

<style lang="less" scoped>
.tree-flow-chart__view{
    width: 100%;
    height: 100%;
    overflow: hidden;
    max-height: 100vh;
    max-width: 100vw;
    cursor: move;
    position: relative;
}
.tree-flow-chart__container{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    position: absolute;
    user-select: none;
    transition: transform .4s ease 0s;
    transform: scale(1);
}
</style>