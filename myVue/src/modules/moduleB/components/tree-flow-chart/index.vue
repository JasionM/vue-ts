<template>
    <div class="tree-flow-chart__container">
        <TreeFlowChartItem 
            v-for="(item, idx) in matchedData"
            :key="idx"
            :direction="direction"
            :data="item"
            :props="props"
            :level="1"
            :style="childNodeStyle"
            :origin-offset="originOffset"
            @getMaxChildrenLength="getMaxChildrenLength">
            <template slot-scope="scope">
                <slot v-bind="scope"></slot>
            </template>
        </TreeFlowChartItem>
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
                validator(val) {
                    return ["top", "bottom", "left", "right"].includes(val)
                }
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
            }
        },
        components: {
            TreeFlowChartItem
        },
        data() {
            return {
                maxPanelLength: 0
            }
        },
        computed: {
            matchedData() {
                const isArray = Object.prototype.toString.call(this.data) === '[object Array]'
                let res = isArray ? this.data : [this.data]
                return res 
            },
            childNodeStyle() {
                let width = parseInt(100 / this.matchedData.length)
                return {
                    flex: `1 1 ${width}%`
                }
            },
            treeDeep() {
                return this.getTreeDeep(this.matchedData)
            },
            containerWidth() {
                this.$el.querySelectorAll(".tree-flow-chart-item__panel")
            }
        },
        created() {
            
        },
        methods: {
            getTreeDeep(tree, childrenProp = 'children', level = 0) {
                if (tree.length) {
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
            getMaxChildrenLength(length) {
                this.maxPanelLength = 
                    this.maxPanelLength > length 
                    ? this.maxPanelLength : length
            }
        }
    }
</script>

<style lang="less" scoped>
.tree-flow-chart__container{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}
</style>