<template>
  <el-container class="bg-white rounded" :style="{ height: (h + 'px') }">
    <el-header class="image-header">
<!--      header-->
      <el-button type="primary"  size="small"  @click="handleOpenCreate">
        新增图片分类
      </el-button>
      <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
    </el-header>

    <el-container>

      <ImageAside ref="ImageAsideRef" @change="handleAsideChange"/>
      <ImageMain ref="ImageMainRef"/>
    </el-container>
  </el-container>
</template>
<script setup>
import ImageAside from "~/components/ImageAside.vue"
import ImageMain from "~/components/ImageMain.vue"
import {ref} from "vue"

const ImageAsideRef=ref(null)

// 调用打开框架方法
const handleOpenCreate=()=>ImageAsideRef.value.handleCreate();


const ImageMainRef = ref(null) //
const handleAsideChange = (image_class_id)=> {
  console.log("image_class_id: "+image_class_id)
  ImageMainRef.value.loadData(image_class_id) //imageMain 暴露出来的loadData方法
}
//上传图片
function handleOpenUpload(){
  ImageMainRef.value.openUploadFile()
}

const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40
</script>
<style>
.image-header{
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>