<template>
    <div class="tree-flow-chart-item__container" :class="[`tree-level__${level}`]">
        <TreeFlowChartPanel 
            :data="matchItem(data)" 
            :origin-offset="originOffset" 
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
                validator(val) {
                    return ["top", "bottom", "left", "right"].includes(val)
                }
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
                maxChildLength: 0
            }
        },
        created() {

        },
        computed: {
            childrenLength() {
                const children = this.data[this.props.children]
                return children ? children.length : 0
            },
            childNodeStyle() {
                let width = parseInt(100 / this.childrenLength)
                return {
                    flex: `1 1 ${width}%`
                }
            }
        },
        watch: {
            data: {
                deep: true,
                handler(val) {
                    let children = val[props.children] || []
                    this.maxChildLength = 
                        this.maxChildLength > children.length 
                        ? this.maxChildLength : children.length
                        
                    this.$emit("getMaxChildrenLength", this.maxChildLength)
                }
            }
        },
        methods: {
            matchItem(item) {
                return {
                    name: item[this.props.name],
                    children: item[this.props.children],
                    source: item
                }
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