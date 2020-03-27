<template>
    <div class="tree-flow-chart-item__container" :class="[`tree-level__${level}`]">
        <TreeFlowChartPanel 
            :data="matchItem(data)" 
            :origin-offset="originOffset"
            ref="flowPanel"
            :level="level">
            <template slot-scope="scope">
                <slot v-bind="scope"></slot>
            </template>
        </TreeFlowChartPanel>
        <div class="tree-flow-chart__childItems">
            <TreeFlowChartItem 
                v-for="(item, idx) in data[props.children]"
                :key="idx"
                :direction="direction"
                :data="item"
                :style="childNodeStyle"
                :props="props"
                :level="level + 1"
                @getChildWidth="getChildWidth"
                :origin-offset="originOffset">
                <template slot-scope="scope">
                    <slot v-bind="scope"></slot>
                </template>
            </TreeFlowChartItem>
        </div>
    </div>
</template>

<script>
    import TreeFlowChartPanel from "./tree-flow-chart-panel"
    export default {
        name: "TreeFlowChartItem",
        components: {
            TreeFlowChartPanel
        },
        props: {
            direction: {
                type: String,
                default: "bottom",
                // validator(val) {
                //     return ["top", "bottom", "left", "right"].includes(val)
                // }
            },
            data: {
                type: Object,
                required: true
            },
            props: {
                type: Object,
                default() {
                    return {
                        name: "name",
                        children: "children"
                    }
                }
            },
            level: {
                type: Number,
                required: true
            },
            originOffset: { //树形面板中心点的位移（根据direction）
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                distance: 40,
                maxChildLength: 0,
                childNodeStyle: {},
                currentWidth: 0
            }
        },
        created() {

        },
        computed: {
            childrenLength() {
                const children = this.data[this.props.children]
                return children ? children.length : 0
            },
            // childNodeStyle() {
            //     const panel = this.$refs.flowPanel

            //     let width = panel ? (this.childrenLength || 1) * panel.$el.clientWidth + 'px' : 'auto'
            //     console.log("childNodeStyle", width, this.$refs)
            //     return {
            //         flex: `1 1 ${width}%`
            //     }
            // }
        },
        watch: {
            data: {
                deep: true,
                handler(val) {
                    
                }
            }
        },
        created() {
            let currentLevelChildrenLength = 0
            let childNodes = this.data[this.props.children] || []
            childNodes.forEach(item => {
                let children = item[this.props.children] || []
                currentLevelChildrenLength += (children.length || 1)
            })
            childNodes.forEach(item => {
                let children = item[this.props.children] || []
                item.widthPercentage = parseInt((children.length || 1) / currentLevelChildrenLength * 100)
            })
        },
        mounted() {
            this.computeNodeWidth()
        },
        updated() {
            // this.computeNodeWidth()
        },
        methods: {
            computeNodeWidth() {
                this.$el.style.flex = `1 1 ${this.data.widthPercentage}%`
            },
            matchItem(item) {
                return {
                    name: item[this.props.name],
                    children: item[this.props.children],
                    source: item
                }
            },
            getChildWidth(wdith) {
                this.currentWidth += wdith
            }
        }
    }
</script>

<style lang="less" scoped>
.tree-flow-chart-item__container{
    .tree-flow-chart__childItems{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }
}
</style>