<template>
  <div class="hello">
    <TreeFlowChart :data="data" line-color="#42b983">
      <template slot-scope="scope">
        <div class="panel">
          <span>{{scope.row.name}}</span>
        </div>
      </template>
    </TreeFlowChart>
  </div>
</template>

<script lang="ts">
import Component from "vue-class-component"
import Vue from "vue"
import TreeFlowChart from "@/components/tree-flow-chart/index.vue"

@Component({
  components: {
    TreeFlowChart
  }
})
export default class App extends Vue {
  data = [
        {
          name: "12312",
          children: [
            {
              name: "12312",
              children: [
                {
                  name: "12312",
                  children: [
                    
                  ]
                }
              ]
            }
          ]
        },
        {
          name: "12312",
          children: [
            {
              name: "12312",
              children: [
                {
                  name: "12312",
                  children: [
                    
                  ]
                }
              ]
            },
            {
              name: "12312",
              children: [
              ]
            },
            {
              name: "12312",
              children: [
                {
                  name: "12312",
                  children: [
                    {
                      name: "12312",
                      children: [
                        
                      ]
                    }
                  ]
                },
                {
                  name: "12312",
                  children: [
                    {
                      name: "12312",
                      children: [
                        {
                          name: "12312",
                          children: [
                            
                          ]
                        }
                      ]
                    },
                    {
                      name: "12312",
                      children: [
                      ]
                    },
                    {
                      name: "12312",
                      children: [
                        {
                          name: "12312",
                          children: [
                            {
                              name: "12312",
                              children: [
                                
                              ]
                            }
                          ]
                        },
                        {
                          name: "12312",
                          children: [
                            
                          ]
                        },
                        {
                          name: "12312",
                          children: [
                            
                          ]
                        },
                        {
                          name: "12312",
                          children: [
                            
                          ]
                        }
                      ]
                    },
                    {
                      name: "12312",
                      children: [
                        
                      ]
                    }
                  ]
                },
                {
                  name: "12312",
                  children: [
                    
                  ]
                },
                {
                  name: "12312",
                  children: [
                    
                  ]
                }
              ]
            },
            {
              name: "12312",
              children: [
                
              ]
            }
          ]
        }
      ]
  activated() {
  
  }
  created() {
    // setTimeout(() => {
    //   this.data = 
    // }, 1000);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.panel{
  width: 150px;
  height: 100px;
  background-color: #eee;
  border: 1px solid #ddd;
}
.hello{
  width: 50vw;
  height: 500px;
}
</style>
