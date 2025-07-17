<template>
  <el-main class="image-main" v-loading="loading">
    <div class="top p-3">
    <el-row :gutter="10">
      <el-col :span="6" :offset="0" v-for="(item,index) in list" :key="index">
        <el-card shadow="hover" class="relative mb-3" :body-style="{ 'padding':0 }">
          <el-image :src="item.url" fit="cover"   :preview-src-list="[item.url]" class="h-[150px]" style="width: 100%;"></el-image>

          <div class="image-title">{{ item.name }}</div>
          <div class="flex items-center justify-center p-2">

             <!-- 选中该图片-->
            <el-checkbox  v-if="openChoose"  v-model="item.checked"   @change="handleChooseChange(item)"/>
            <el-button type="primary" size="small" text @click="handleEdit(item)">重命名</el-button>

            <el-popconfirm title="是否确定删除?" confirm-button-text="确认" cancel-button-text="取消" @confirm="handleDelete(item.id)">
              <template #reference>
                <el-button  class="!m-0"  type="primary" size="small" text>删除</el-button>
              </template>
            </el-popconfirm>

          </div>
        </el-card>
      </el-col>
    </el-row>
    </div>

    <div class="bottom">
      <el-pagination background layout="prev,pager,next"  :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData"/>
    </div>
  </el-main>

  <!--  上传图片-->
  <el-drawer v-model="drawer" title="上传图片">
    <UploadFile :data="{ image_class_id }" @success="handleUploadSuccess"/>
  </el-drawer>


</template>

<script setup>
import {ref,computed} from 'vue'
import {
  getImageList,
    deleteImage,
    updateImage
} from "~/api/image.js" //获取某分类图片下的列表
import UploadFile from "./UploadFiles.vue";
import {toast,showPrompt} from "~/composables/util";
//分页
const  currentPage=ref(1)
const   total=ref(0)
const limit=ref(10)
const list=ref([])
const loading=ref(false)
const image_class_id=ref(0)
//上传图片 显示 隐藏
const drawer=ref(false)
const openUploadFile = ()=>drawer.value = true
//获取数据
function getData(p=null){ // p是页码
  if(typeof p=="number"){
    currentPage.value=p
  }
  loading.value=true
  getImageList(image_class_id.value,currentPage.value).then
  (res=>{
    total.value=res.totalCount
    list.value=res.list
  }).finally(()=>{
    loading.value=false
  })
}

//根据分类iD重新加载图片列表
const  loadData=(id)=>{
  currentPage.value=1
  image_class_id.value=id
  getData()
}
//删除
function handleDelete(ids){
  loading.value = true
  deleteImage([ids]).then(res=>{
    toast("删除成功")
    getData()
  }).catch(err=>{
    console.log("异常:"+err.message)
  }).finally(()=>{
    loading.value = false
  })
}

// 重命名
const handleEdit = (item)=>{
  showPrompt("重命名",item.name)
      .then(({ value })=>{

        loading.value = true
        updateImage(item.id,value)
            .then(res=>{
              toast("修改成功")
              getData()
            })
            .finally(()=>{
              loading.value = false
            })

      })
}

// 删除图片
// const handleDelete = (id)=>{
//   loading.value = true
//   deleteImage([id]).then(res=>{
//     toast("删除成功")
//     getData()
//   })
//       .finally(()=>{
//         loading.value = false
//       })
// }

// 上传成功
const handleUploadSuccess = ()=>getData(1)  // 获取第一页的数据

// 选择框是否出现，如果是选择图片就出现，上传查看图片就不用出现
defineProps({
  openChoose:{
    type:Boolean,
    default:false
  }
})

// 选中图片 创建用户用的
const emit=defineEmits(["choose"])
const checkedImage = computed(()=> list.value.filter(o=>o.checked))
const handleChooseChange = (item)=>{
  if(item.checked && checkedImage.value.length > 1){
    item.checked = false
    return toast(`最多只能选中1张`,"error")
  }
  emit("choose",checkedImage.value)
}

// ImageMain.vue 中添加重置方法
const resetSelection = (urls ) => {
  list.value.forEach(item => {
    item.checked = false;
  });
  urls = []; // 清空选中的 URL 数组
};

defineExpose({
  loadData,
  openUploadFile,
  resetSelection

})

</script>

<style>
.image-main{
  position: relative;
}
.image-main .top{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-main .bottom{
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}
.image-title{
  position: absolute;
  top: 122px;
  left: -1px;
  right: -1px;
  @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>