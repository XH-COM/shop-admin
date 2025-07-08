
<template>

</template>


<script setup lang="ts">
import {reactive,watch} from "vue";
import gsap from "gsap";

//接收到滚动的参数
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
    duration:1,
  })
}
AnimateToValue();

//监听一下值是否发生变化，若变化则重新执行
// watch(()=>props.value,()=>{
//   AnimateToValue();
// })

watch(()=>props.value,()=>AnimateToValue())


</script>

<style scoped>

</style>