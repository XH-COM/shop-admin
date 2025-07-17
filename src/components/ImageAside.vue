<template>
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <div class="top">
      <!-- 修改-->
      <AsideList :active="activeId == item.id" v-for="(item,index) in list" :key="index" @edit="handleEdit(item)" @delete="handleDelete(item)"
      @click="handleChangeActiveId(item.id)">
        {{ item.name }}
      </AsideList>


    </div>
    <div class="bottom">
      <el-pagination background layout="prev, next" :total="total" :current-page="currentPage" :page-size="limit"
                     @current-change="getData"/>
    </div>
  </el-aside>

  <FormDrawer :title="drawerTitle" ref="formDrawerRef" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="form.order" :min="0" :max="1000"/>
      </el-form-item>
    </el-form>
  </FormDrawer>



</template>
<script setup>
import {reactive, ref, computed} from "vue";
import FormDrawer from "./FormDrawer.vue"
import {
  getImageClassList,
  createImageClass,
  updateImageClass,
  deleteImageClass
} from "~/api/imageClass.js"
import AsideList from './AsideList.vue';
import {toast} from "~/composables/util.js";
// 加载动画
const loading = ref(false)
const list = ref([])
const activeId = ref(0)
const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "修改" : "新增") // 表单框的标题
// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

// 获取数据
function getData(p = null) {
  if (typeof p == "number") {
    currentPage.value = p
  }

  loading.value = true
  getImageClassList(currentPage.value)
      .then(res => {
        total.value = res.totalCount
        list.value = res.list
        let item = list.value[0]
        if (item) {
          // activeId.value = item.id
          handleChangeActiveId(item.id)
        }
      })
      .finally(() => {
        loading.value = false
      })
}

getData()


const formDrawerRef = ref(null)
const handleCreate = () => {
  formDrawerRef.value.open()
  //清空默认值
  editId.value = 0
  form.name = ""
  form.order = 50
}


const form = reactive({
  name: "",
  order: 50
})

const rules = {
  name: [{
    required: true,
    message: '图库分类名称不能为空',
    trigger: 'blur'
  }]
}
const formRef = ref(null)
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    // console.log("提交成功");
    formDrawerRef.value.showLoading()

    // 创建或更新
    const fun = editId.value ? updateImageClass(editId.value, form) : createImageClass(form)

    fun.then(res => {
      toast(drawerTitle.value + "成功")
      getData(editId.value ? currentPage.value : 1)
      formDrawerRef.value.close()
    }).finally(() => {
      formDrawerRef.value.hideLoading() // 隐藏加载
    })

  })
}

// 编辑的方法
const handleEdit = (row) => {
  console.log("handleEdit-edit")
  // console.log(row);
  //打开窗口，默认信息为当前选择的信息
  formDrawerRef.value.open()
  editId.value = row.id;
  form.name = row.name
  form.order = row.order
  // 这里会导致新增的时候表单 也有默认值，要去create去清空一下

}

// 删除
const handleDelete=(row)=>{
  // console.log("rowId:"+row.id)
  deleteImageClass(row.id).then(res=>{
    toast("删除成功")
    getData(1)
  })
}

//选中图库分类id
// const activeId=ref(0)
const emit=defineEmits(["change"]) // 定义事件， 用于通知父组件

//切换分类
function handleChangeActiveId(id){
  activeId.value=id
  emit("change",id) //   触发事件, 通知父组件
}

defineExpose({
  handleCreate
})

</script>
<style>
.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}

.image-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-aside .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}

</style>