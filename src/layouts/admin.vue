
<template>
  <el-container>
    <el-header><f-header/>
    </el-header>
    <el-container>
      <el-aside :width="$store.state.asideWidth" >
        <f-menu/>
      </el-aside >
      <el-main>
        <f-tag-list/>
        <router-view v-slot="{Component}">
          <!-- transition  只能有 一个根节点-->
          <transition name="fade">  <!--  过渡动画  -->
          <!--  动态组件  缓存-->
          <keep-alive :max="10">
            <component :is="Component"> </component>
          </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup >
import FHeader from "~/layouts/components/FHeader.vue";
import FMenu from "~/layouts/components/FMenu.vue";
import FTagList from "~/layouts/components/FTagList.vue";
</script>

<style scoped>
.el-aside{
  transition: width 0.3s ease-in-out;
}

.fade-enter-from{
  opacity: 0;
}
.fade-enter-to{
  opacity: 1;
}
.fade-leave-from{
  opacity: 1;
}
.fade-leave-to{
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active{
  transition: all 0.3s;
}
.fade-enter-active{
  transition-delay: 0.3s;
}

</style>