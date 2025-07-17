
<template>
  <!-- 显示已选中的图片预览，它会根据 v-model 绑定的值（即 modelValue）动态渲染图片组件。   -->
  <div v-if="modelValue">
    <el-image :src="modelValue" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
  </div>

  <div class="choose-image-btn" @click="open">
    <el-icon :size="25" class="text-gray-500"><Plus /></el-icon>
  </div>

  <el-dialog
      title="选择图片"
      v-model="dialogVisible"
      width="80%"
      top="5vh">

    <el-container class="bg-white rounded" style="height:70vh;">
      <el-header class="image-header">
        <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
        <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
      </el-header>

      <el-container>
        <ImageAside ref="ImageAsideRef" @change="handleAsideChange"/>
              <!--   这是传递字符串字面量 "true"，  :openChoose="true"    -->
        <ImageMain openChoose ref="ImageMainRef" @choose="handleChoose"/>
      </el-container>

    </el-container>

    <!--    -slot:footer 的缩写，用于指定这是 el-dialog 的底部插槽。-->
    <template #footer>
            <span>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">确认</el-button>
            </span>
    </template>

  </el-dialog>



</template>

<script setup>
import { ref, computed } from "vue";
import ImageAside from "~/components/ImageAside.vue"
import ImageMain from "~/components/ImageMain.vue"

const dialogVisible = ref(false);

const open = () => {  // 对话框属性为真
  if (ImageMainRef.value) {
    ImageMainRef.value.resetSelection(urls); // 调用子组件方法重置选中状态
  }
  dialogVisible.value = true;
}
const close=()=> {
  dialogVisible.value = false;

}

// 声明属性
const props = defineProps({
  modelValue:[String,Array]
})

// defineEmits 声明触发的事件
const emit = defineEmits(["update:modelValue"])

// 提交
const submit = () => {
  if(urls.length){
    emit("update:modelValue",urls[0])
  }
  close()
}

const ImageAsideRef = ref(null)
const handleOpenCreate = ()=>ImageAsideRef.value.handleCreate()
const ImageMainRef = ref(null)

// 分类选择后，查询该分类的图片
const handleAsideChange = (image_class_id)=> ImageMainRef.value.loadData(image_class_id)


//或者自己上传一个
const handleOpenUpload = ()=>ImageMainRef.value.openUploadFile()


let urls = []
const checkedId=ref(0) //被选中项的id

const handleChoose = (e)=>{
  urls = e.map(o=>o.url)
  console.log('e里面有什么',e)
}

</script>

<style>
.image-header{
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
.choose-image-btn {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}
</style>