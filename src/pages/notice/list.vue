<template>
  <!--      公告列表-->

  <el-card shadow="never" class="border-0">
    <!-- 新增|刷新 -->
    <div class="flex items-center justify-between mb-4">
      <el-button type="primary"  size="small" @click="handleCreate">新增</el-button>
      <el-tooltip effect="dark" content="刷新数据" placement="top"> <!-- 提示工具框-->
        <el-button text @click="getData">
          <el-icon  size="20">
            <Refresh/>
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>


    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="发布时间" width="380" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>

          <el-popconfirm title="是否要删除该公告？" confirmButtonText="确认"
                         cancelButtonText="取消" @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button text type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!--    分页-->
    <div class="flex items-center justify-center mt-5">
      <el-pagination background layout="prev, pager ,next" :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData"/>
    </div>

    <!--   虽然位置不影响功能，但从代码可读性角度，建议将这类 “弹窗 / 抽屉组件” 放在模板的 最后位置（如当前 <el-card> 的闭合标签前   -->
    <!--  formDrawerRef 是一个 Vue 组件引用（ref），用于在父组件中访问和控制子组件 FormDrawer 的实例方法和属性。  这里绑定了-->
    <FormDrawer ref="formDrawerRef" title="新增" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="form.content" placeholder="公告内容" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup lang="ts">
import {Refresh} from "@element-plus/icons-vue";
import { ref,reactive,computed } from "vue"
import FormDrawer from "~/components/FormDrawer.vue";
import {
  getNoticeList,
  createNotice,
  deleteNotice,
  updateNotice

} from "~/api/notice"

import {
  toast
} from "~/composables/util"

const tableData = ref([])
const loading = ref(false)
// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

function getData(p=null){
  if(typeof p=="number"){
    currentPage.value=p
  }
  loading.value=true
  getNoticeList(currentPage.value).then(res=>{
    console.log(res)
    tableData.value=res.list
    total.value = res.totalCount
  }).finally(()=>{
    loading.value=false
  })
}


getData()



// 删除
const handleDelete = (id)=>{
  loading.value=true
  deleteNotice(id).then(res=>{
    toast("删除成功")
    getData()
  }).finally(()=>{
    loading.value=false
  })
}

//表单部分
const formDrawerRef =ref(null)
const formRef=ref(null)
const form=reactive({
  title:"",
  content:""
})
const rules={
  title:[{
    required: true,
    message:'公告标题不能为空',
    trigger:"blur"
  }],
  content:[{
    required: true,
    message:'公告内容不能为空',
    trigger:"blur"
  }]
}
const editId = ref(0)
const drawerTitle = computed(()=>editId.value ? "修改" : "新增")

// 提交 是提交框的
const handleSubmit = ()=>{
  formRef.value.validate((valid)=>{
    if(!valid){
      return ;
    }

    formDrawerRef.value.showLoading()
    const fun=editId.value?updateNotice(editId.value,form):createNotice(form)

    createNotice(form).then((res)=>{
      toast( drawerTitle.value + "成功")
      getData(editId.value ? false : 1)
      formDrawerRef.value.close()
    }).finally(()=>{
      formDrawerRef.value.hideLoading()
    })
  })
}
// 重置表单
function resetForm(row = false){
  if(formRef.value) formRef.value.clearValidate()
  if(row){
    for(const key in form){
      form[key] = row[key]
    }
  }
}

//新增
const handleCreate = ()=>{
  editId.value=0
  resetForm({
    title:"",
    content:""
  })
  formDrawerRef.value.open()
}

// 编辑 修改
const handleEdit = (row)=>{
  editId.value = row.id
  resetForm(row)
  formDrawerRef.value.open()
}

</script>