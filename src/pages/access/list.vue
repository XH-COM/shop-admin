

<template>

    <el-card shadow="never" class="border-0">
      <list-header @create="handleCreate"  @refresh="getData"/>
      <el-tree :data="tableData" :props="{label:'name',children: 'child'}" v-loading="loading" node-key="id" :default-expanded-keys="defaultExpandedKeys">
        <!--       :default-expanded-keys 哪些节点默认展开-->
        <!--node：树形组件内部的节点对象，包含节点的层级、是否展开等状态信息。
        data：当前节点的原始数据（即 tableData 中的某个元素）-->
        <template #default="{node,data}">
          <div class="custom-tree-node">
            <!--     默认样式，info为蓝色信息标签   ，显示文本 true为菜单，false为权限        -->
            <el-tag size="small" :type="data.menu?'':'info'" >{{data.menu?'菜单':'权限'}} </el-tag>
            <el-icon v-if="data.icon" :size="16" class="ml-2">
              <component :is="data.icon" />
            </el-icon>
            <!-- <span> 是 HTML 中的内联标签，本身没有默认样式（不会自带边距、换行等效果），主要用于包裹小块文本或内联元素，以便对其进行样式控制或逻辑处理。-->
            <span >{{data.name}}</span>

            <div class="ml-auto" >
              <el-switch :model-value="data.status":active-value="1" :inactive-value="0" @change="handleStatusChange($event,data)"/>
              <el-button text type="primary" size="small" @click.stop="handleEdit(data)">修改</el-button>
              <el-button text type="primary" size="small" @click.stop="addChild(data.id)">增加</el-button>
              <el-popconfirm title="确认删除吗？"  confirm-button-text="确认" cancel-button-text="取消" @confirm="handleDelete(data.id)">
                <template #reference>
                  <el-button text type="primary" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </template>

      </el-tree>

      <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
          <el-form-item label="上级菜单" prop="rule_id">
            <el-cascader v-model="form.rule_id"
                         :options="options"
                         :props="{value:'id', label:'name',children:'child',checkStrictly:true,emitPath:false }"
                         placeholder="请选择上级菜单"/>
          </el-form-item>
          <el-form-item label="菜单/规则" prop="menu">
            <el-radio-group v-model="form.menu">
              <el-radio :label="1" border>菜单</el-radio>
              <el-radio :label="0" border>规则</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 30%;" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
            <IconSelect v-model="form.icon"/>
            <!--              <el-input v-model="form.icon"></el-input>-->
          </el-form-item>
          <el-form-item label="前端路由" prop="frontpath" v-if="form.menu == 1 && form.rule_id > 0">
            <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
          </el-form-item>
          <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
            <el-input v-model="form.condition" placeholder="后端规则"></el-input>
          </el-form-item>
          <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
            <el-select v-model="form.method" class="m-2" placeholder="请选择请求方式">
              <el-option
                  v-for="item in ['GET','POST','PUT','DELETE']"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="order">
            <el-input-number v-model="form.order" :min="0" :max="1000" />
          </el-form-item>
        </el-form>
      </FormDrawer>

    </el-card>

</template>


<script setup>
import { ref } from "vue"
import ListHeader from "~/components/ListHeader.vue"
import FormDrawer from "~/components/FormDrawer.vue"
import {
  getRuleList,
  createRule,
  updateRule,
  updateRuleStatus,
  deleteRule
} from "~/api/rule.js"

import {
  useInitTable,
  useInitForm
} from "~/composables/useCommon.js"
import IconSelect from "~/components/IconSelect.vue"
import {debouncedRef} from "@vueuse/core";

const options = ref([])
const defaultExpandedKeys = ref([])

const {
  loading,
  tableData,
  getData,
  handleDelete,
  handleStatusChange
} = useInitTable({
  getList:getRuleList,
  onGetListSuccess:(res)=>{
    console.log('res',res)
    options.value=res.rules
    tableData.value = res.list
    // 通过 .value 赋值，将 [1, 2, 3] 传递给树形组件的 :default-expanded-keys 属性
    defaultExpandedKeys.value = res.list.map(o=>o.id)
  },
  delete:deleteRule,
  updateStatus:updateRuleStatus
})

// 表格初始化
const {
  formDrawerRef,
  formRef,
  form,
  rules,
  drawerTitle,
  handleSubmit,
  handleCreate,
  handleEdit,

} = useInitForm({
  form: {
    rule_id:0,
    menu:0,
    name:"",
    condition:"",
    method:"GET",
    status:1,
    order:50,
    icon:"",
    frontpath:""
  },
  rules: {},

  getData,

  update: updateRule,
  create: createRule
})

// 新增 子分类
function addChild(id){
  handleCreate()
  form.rule_id = id
  form.status=1
}



</script>

<style >

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-node__content {
  padding: 20px 0;
}
.drawer-content {
  max-height: 100vh; /* 最大高度为视口高度 */
  overflow-y: auto; /* 内容超出时自动显示滚动条 */
}

</style>