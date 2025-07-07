
<!-- 图标组件 -->
<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between">
        <span class="text-sm">订单统计</span>
        <div>
          <el-check-tag v-for="(item,index) in options" :checked="current==item.value" style="margin-right:8px" @click="handleChoose(item.value)">{{ item.text }}</el-check-tag>

        </div>

      </div>
    </template>
    <div ref="el" id="chart" style="width: 100%;height: 300px;"></div>
  </el-card>
</template>


<script setup >
import * as echarts from 'echarts';
import { useResizeObserver } from '@vueuse/core'
import {ref,onMounted,onBeforeUnmount} from 'vue';
import {
  getStatistics3
} from "~/api/index.js";


const current=ref("week");//当前选中
const options=[{
  text:"近一个月",
  value:"month"
},{
  text:"近一周",
  value:"week"
},{
  text:"近24小时",
  value:"hour"
}]

//点击切换 时间范围
const handleChoose = (type) => {
  current.value = type
  getData()
}

var myChart = null
onMounted(()=>{
  var chartDom = document.getElementById('chart');
  myChart = echarts.init(chartDom);

  getData()
})

onBeforeUnmount(()=>{
  if(myChart) echarts.dispose(myChart)  // 销毁echarts实例
})
function getData() {
  let option = {
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  };

  myChart.showLoading()  //显示加载动画
  getStatistics3(current.value).then(res=>{
    option.xAxis.data = res.x
    option.series[0].data = res.y

    myChart.setOption(option)
  }).finally(()=>{
    myChart.hideLoading()
  })



}


const el = ref(null)
//重新设置尺寸
useResizeObserver(el, (entries) => myChart.resize())


</script>

<style scoped>

</style>