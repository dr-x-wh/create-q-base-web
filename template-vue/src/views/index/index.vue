<script setup>
import {RouterView, useRoute, useRouter} from "vue-router"
import {computed} from "vue"
import useSettingStore from "@/store/setting.js";
import useUserStore from "@/store/user.js";

const route = useRoute()
const router = useRouter()
const settingStore = useSettingStore()
const userStore = useUserStore()

const menu = computed(() => route.matched.find(s => s.meta?.layout === 'index').children.sort((a, b) => (a.meta?.sort || 0) - (b.meta?.sort || 0)))
const current = computed(() => route.path)

const handleLogout = async () => {
  try {
    await userStore.logout()
    await router.push({path: '/login'})
  } catch (e) {
    console.warn(e)
  }

}
</script>

<template>
  <div>
    <el-menu style="position: relative;" :default-active="current" class="layout-menu" mode="horizontal" router>
      <template v-for="item in menu">
        <template v-if="!item.meta?.hidden?.(userStore)">
          <el-menu-item :index="item.path">{{ item.meta?.title }}</el-menu-item>
        </template>
      </template>
      <div style="position: absolute; right: 10px; height: 100%; display: flex; gap: 10px; align-items: center;">
        <el-text>欢迎，{{ userStore.username || '用户' }}</el-text>
        <el-button type="danger" link @click="handleLogout">退出登录</el-button>
      </div>
    </el-menu>
    <el-scrollbar class="layout-index">
      <RouterView v-slot="{Component, route}">
        <Transition :name="route.meta?.transition || settingStore.transition" mode="out-in">
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
