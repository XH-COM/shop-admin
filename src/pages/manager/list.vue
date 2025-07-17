<template>
  <el-card shadow="never" class="border-0">

    <!--  搜索  -->
    <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-form-item  label="关键词">
            <el-input v-model="searchForm.keyword" placeholder="管理员昵称" clearable   @keyup.enter="getData" > </el-input>
            <!-- 添加回车键触发搜索 -->
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="8">
          <div class="flex items-center justify-end">
            <el-button type="primary"  @click="getData">搜索</el-button>
            <el-button type="primary" @click="resetSearchForm">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <!-- 新增|刷新 -->
    <div class="flex items-center justify-between mb-4">
      <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
      <el-tooltip effect="dark" content="刷新数据" placement="top">
        <el-button text @click="getData">
          <el-icon :size="20">
            <Refresh/>
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>

    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">

      <el-table-column label="管理员" width="200">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar :size="40" :src="row.avatar">
              <img
                  src="manbo1.png"
              />
            </el-avatar>
            <div class="ml-3">
              <h6>{{ row.username }}</h6>
              <small>ID:{{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="所属管理员" align="center">
        <template #default="{ row }">
          {{ row.role?.name || "-" }}
        </template>
      </el-table-column>

      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <!--     激活和非激活的值可以改的，true false，或者1 0 之类的     -->
          <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0" :loading="row.statusLoading"
                     :disabled="row.super==1" @change="handleStatusChange($event,row)">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="center">
        <!--  和row一个道理，但是scope可以取到其它的值      -->
        <template #default="scope">
          <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
          <el-popconfirm title="是否要删除该管理员？" confirmButtonText="确认" cancel-button-text="取消"
                         @confirm="handleDelete(scope.row.id)">
            <template #reference>
              <el-button type="primary" size="small" text>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>

    </el-table>

    <!--  下方分页  -->
    <div class="flex items-center justify-center mt-5">
      <el-pagination background layout="prev, pager ,next" :total="total" :current-page="currentPage" :page-size="limit"
                     @current-change="getData"/>
    </div>


    <!--  表单  -->
    <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <!--          <el-input v-model="form.avatar"></el-input>-->
          <!--          选择头像的组件-->
          <ChooseImage v-model="form.avatar"  @update:modelValue="form.avatar = $event"/>
        </el-form-item>
        <el-form-item label="所属角色" prop="role_id">
          <el-select v-model="form.role_id" placeholder="选择所属角色">
            <el-option v-for="item in roles"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="content">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
    </FormDrawer>

  </el-card>
</template>


<script setup>
import {ref, reactive, computed} from "vue"
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from "~/components/ChooseImage.vue";
//
// const searchForm = reactive({
//   keyword:""
// })
// const resetSearchForm = ()=>{
//   searchForm.keyword = ""
//   getData()
// }


import {
  getManagerList,
  createManager,
  deleteManager,
  updateManagerStatus,
  updateManager
} from "~/api/manager"

import {toast} from "~/composables/util";
import edit from "@element-plus/icons-vue/dist/es/edit.mjs";
import {useInitTable} from "~/composables/useCommon";  //组件封装

const roles = ref([])//权限角色 rule_id
const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData
} = useInitTable({
  searchForm:{
    keyword:""
  },
  getList:getManagerList,
  onGetListSuccess:(res)=>{
    tableData.value = res.list.map(o => {
      o.statusLoading = false
      return o
    })
    total.value = res.totalCount
    roles.value = res.roles
  }
})


// const tableData = ref([])
// const loading = ref(false)
//
// // 分页
// const currentPage = ref(1)
// const total = ref(0)
// const limit = ref(10)


const editId = ref(0)
const drawerTitle = computed(()=>editId.value ? "修改" : "新增")

useInitTable.getData
//获取数据
// function getData(p = null) {
//   if (typeof p == "number") {
//     currentPage.value = p
//   }
//
//   loading.value = true
//   getManagerList(currentPage.value,searchForm).then(res => {
//     // console.log("res的数据", res)
//     tableData.value = res.list.map( //
//         item=>{
//           item.statusLoading=false
//           return item
//         }
//     );
//     total.value = res.totalCount;
//     roles.value = res.roles
//   }).finally(() => {
//     loading.value = false
//   })
//
// }

// 表单部分
const formDrawerRef = ref(null)
const formRef = ref(null)
const form = reactive({
  username: "",
  password: "",
  status: 1,
  role_id:null,
  avatar: ""
})

const rules=reactive({
  username: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
  password: computed(() => editId.value ? [
    // 编辑模式：密码可选，但如果填写则需要满足长度要求
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ] : [
    // 新增模式：密码必填
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ]),
  role_id: [ { required: true, message: '请选择所属角色', trigger: 'change' } ]
}) //表单的验证规则



// getData()




// 新增/编辑管理员 提交事件
const handleSubmit = () => {
  formRef.value.validate(valid => {
    if (!valid) return;
    formDrawerRef.value.showLoading();// 调用绑定它的组件的方法
    // formRef.value.validateField('role_id');//手动触发，如果没有选择角色，会提示
    const fun=editId.value?updateManager(editId.value,form):createManager(form)

    fun.then(res=>{
      toast(drawerTitle.value+"成功")
      //修改刷新当前页，新增刷新第一页
      getData(editId.value?false:1)
      formDrawerRef.value.close()
    }).finally(()=>{
      formDrawerRef.value.hideLoading();// 关闭
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

//新增 管理员
const handleCreate = () => {
  editId.value=0
  //全部清空 表单
  resetForm({
    username:"",
    password:"",
    role_id:null,
    status:1,
    avatar:""
  })
  formDrawerRef.value.open() ;//打开表单框
}

// 编辑 修改
function handleEdit(row){
  editId.value= row.id;//代表是修改
  resetForm(row)
  formDrawerRef.value.open();//打开表单框

}

// 删除管理员
function handleDelete(id){
  loading.value=true;
  // console.log("enter")
  deleteManager(id).then(res=>{
    toast("管理员 删除成功")
    getData()
  }).finally(()=>{
    loading.value=false
  })
}

//修改状态
const handleStatusChange = (status, row) => {
  row.statusLoading = true // 名字非固定的
  updateManagerStatus(row.id, status).then(res => {
    toast("修改状态成功")
    row.status = status
    console.log("修改后的状态为:",row.status)
  }).finally(() => {
    row.statusLoading = false
  })
}

</script>