<script setup>
import {RouterView, useRoute, useRouter} from "vue-router"
import {computed} from "vue"
import useSettingStore from "@/store/setting.js";

const router = useRouter()
const route = useRoute()
const settingStore = useSettingStore();

const menu = computed(() => router.getRoutes().find(iRoute => iRoute.name === 'Layout').children)
const current = computed(() => route.path)
</script>

<template>
  <div>
    <el-menu :default-active="current" class="layout-menu" mode="horizontal" router>
      <template v-for="item in menu">
        <el-menu-item :index="item.path">{{ item?.meta?.title }}</el-menu-item>
      </template>
    </el-menu>
    <el-scrollbar class="layout-index">
      <RouterView v-slot="{Component, route}">
        <Transition :name="route?.meta?.transition || settingStore.transition" mode="out-in">
          <Component :is="Component" :key="route.path"/>
        </Transition>
      </RouterView>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.layout-menu {
  height: 7vh;
  min-height: 40px;
  max-height: 80px;
}

.layout-index {
  height: 93vh;
  min-height: calc(100vh - 80px);
  max-height: calc(100vh - 40px);
}
</style>
