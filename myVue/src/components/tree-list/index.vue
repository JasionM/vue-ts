<template>
    <div id="treeList">
        <ul>
            <li v-for="(data, index) in dataList" :key="index">
                <slot></slot>
                <tree-list v-if="data.children && data.children.length > 0" :dataList="data.children"></tree-list>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "treeList",
        props: ["dataList"],
        data() {
            return {
                key: "value"
            }
        },
        created(){

        },
        methods: {
            name() {
                
            }
        },
    }
</script>

<style scoped>

</style>