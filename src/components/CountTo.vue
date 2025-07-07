
<template>
  {{ d.num.toFixed(0) }}
  <!--保留0位小数，并转字符串-->
</template>


<script setup lang="ts">
import {reactive,watch} from "vue";
import gsap from "gsap";

//接收到滚动的参数 为了 给 watch 等拿到 所以取个名，属性 value
const  props=defineProps({
  value:{
    type:Number,
    default:0
  }
})
const d=reactive({
  num:0
})

function  AnimateToValue(){
  gsap.to(d,{
    num:props.value,
    duration:0.5,
  })
}
// 调用 AnimateToValue 函数，当组件挂载时，立即开始执行动画
AnimateToValue();

//监听一下值是否发生变化，若变化则重新执行
// watch(()=>props.value,()=>{
//   AnimateToValue();
// })
watch(()=>props.value,()=>AnimateToValue())

</script>

<style scoped>

</style>