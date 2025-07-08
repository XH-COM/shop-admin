<template>
  <div>
    <!--    <h1> &#45;&#45;后台首页&#45;&#45; </h1>-->
    <!--    <el-button @click="set">设置</el-button>-->
    <!--    <el-button @click="get">读取</el-button>-->
    <!--    <el-button @click="remove">删除</el-button>-->
    <el-row :gutter="20">
      <template v-if="panels.length == 0">   <!--  当 panels 数组长度为 0 时显示 -->
        <!-- 骨架屏  一个大致的模板 加载时-->
        <el-col :span="6" :offset="0" v-for=" i in 4">
          <el-skeleton style="width: 100%" animated loading>  <!--  加载时的动画效果  -->
            <template #template>

              <el-card shadow="hover" class="border-0">
                <template #header>
                  <div class="flex justify-between">
                    <el-skeleton-item variant="text" style="width: 50%" />
                    <el-skeleton-item variant="text" style="width: 10%" />
                  </div>
                </template>
                <el-skeleton-item variant="h3" style="width: 80%" />
                <el-divider />
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>

      <el-col :span="6" :offset="0" v-for="(item,index) in panels" :key="index">
        <el-card shadow="hover"  class="border-0">
          <template #header>
            <div class="flex justify-between">
              <span class="text-sm">{{ item.title }}</span>
              <el-tag
                  :type="item.unitColor"
                  effect="plain"
              >
                {{ item.unit }}  <!-- tag ->单位  年 周 月 -->
              </el-tag>
            </div>
          </template>
          <!--                        {{ item.value }}-->

          <span class="text-3xl font-bold text-gray-500">
            <count-to :value="item.value"/>
          </span>

          <!--          分割线-->
          <el-divider/>
          <div class="flex justify-between text-sm text-gray-500">
            <span>{{ item.subTitle }}</span>
            <span>{{ item.subValue }}</span>
          </div>
        </el-card>

      </el-col>
    </el-row>

    <index-navs/>
    <!--左右布局-->
    <el-row :gutter="20" class="mt-5">
      <el-col :span="12" :offset="0">
        <index-chart v-permission="['getStatistics3,GET']"/>   <!--有查看图表的权限-->
      </el-col>

      <el-col :span="12" :offset="0">
        <index-card title="店铺及商品提示" tip="店铺商品的提示" :btns="goods"  class="mb-3"/>
        <index-card title="交易提示" tip="需要立即处理的交易订单" :btns="order"/>
      </el-col>

    </el-row>
  </div>

  <!--  {{ $store.state.user.username }}-->
  <!--  <el-button @click="HandleLogout">退出登录</el-button>-->
</template>


<script setup>
import  CountTo from "~/components/CountTo.vue"
import IndexNavs from "~/components/IndexNavs.vue"
import IndexChart from "~/components/IndexChart.vue"
import IndexCard from "~/components/IndexCard.vue"

import {ref} from "vue";
import {
  getStatistics1,
    getStatistics2,
    getStatistics3
} from "~/api/index.js";

const panels = ref([])

getStatistics1().then((resp) => {
  console.log("getStatistics1")
  panels.value = resp.panels; // 赋值给 panels
  console.log(panels.value)

})
const goods = ref([])
const order = ref([])
getStatistics2().then(resp=>{
  goods.value = resp.goods
  order.value = resp.order
})

// import {useCookies} from '@vueuse/integrations/useCookies'// useCookies
// import {ElMessage, ElMessageBox} from 'element-plus' //确认消息提示框
// import {showModal, toast} from "~/composables/util.js";
// import {logout} from "~/api/manager.js";
// import {removeToken} from "~/composables/auth.js";
// import {useRouter} from "vue-router";
// import {useStore} from "vuex";
//
// const router = useRouter()  //跳转路由
// const  store=useStore()
//
// function HandleLogout() {   //退出登录
//   showModal('确认退出登录,继续？').then((resp) => {
//      logout().finally(()=>{
//        //清除 cookie
//        //清除当前用户状态 vuex
//        store.dispatch("logout");
//        //跳转回登录页
//        router.push("/login")
//        //提示退出登录成功
//        toast("退出登录成功",'success');
//      })
//   }).catch(() => {
//
//   })
// }
//
//
// const cookie = useCookies()
// // console.log("login")
// // console.log(cookie)
// function set() {
//   cookie.set("admin-token", "123456")
// }
//
// function get() {//获取cookie
// console.log("token：" + cookie.get("admin-token"))
// }
//
// function remove() { //移除 cookie
//   cookie.remove("admin-token")
// }

</script>

<style scoped>

</style>