<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import useUserStore from "@/store/user.js";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {useRegister} from "./api.js";
import {useSendCode} from "@/api/code.js";

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref()
const usernameRef = ref()

const isLogin = ref(true)
const loading = ref(false)

const form = ref({
  username: null,
  password: null,
  phone: null,
  code: null,
})

const rules = reactive({
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, message: '密码长度至少6位', trigger: 'blur'},
  ],
  phone: [
    {required: true, message: '请输入手机号', trigger: 'blur'},
    {pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur'},
  ],
  code: [
    {required: true, message: '请输入验证码', trigger: 'blur'},
    {min: 6, message: '验证码错误', trigger: 'blur'},
  ],
})

const changeBtnContext = computed(() => isLogin.value ? "点击注册" : "去登陆")
const submitBtnContext = computed(() => isLogin.value ? "登录" : "注册")
const countdown = ref(0)
const timer = ref(null)

const buttonText = computed(() => countdown.value > 0 ? `重新发送(${countdown.value}s)` : '发送')

const hasSendSms = computed(() => form.value.phone?.length)

const handleChange = () => {
  form.value = {
    username: null,
    password: null,
    phone: null,
    code: null,
  }
  if (timer.value) clearInterval(timer.value)
  countdown.value = 0
  if (formRef.value) formRef.value.clearValidate()
  isLogin.value = !isLogin.value
}

const handleSendCode = async () => {
  try {
    if (formRef.value) {
      const valid = await formRef.value.validateField("phone")
      if (valid) {
        if (countdown.value > 0) return
        useSendCode(form.value.phone)
            .then(() => {
              startCountdown()
            })
            .catch((err) => {
              ElMessage.warning('发送失败')
            })
      }
    }
  } catch (e) {
    console.warn(e)
  }

}

const startCountdown = () => {
  countdown.value = 60
  if (timer.value) clearInterval(timer.value)
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value)
      timer.value = null
    }
  }, 1000)
}

const handleSubmit = async () => {
  if (isLogin.value) await handleLogin()
  else await handleRegister()
}

const handleLogin = async () => {
  try {
    loading.value = true
    if (formRef.value) {
      const valid = await formRef.value.validate()
      if (valid) {
        await userStore.login(form.value.username, form.value.password)
        await router.push({path: '/'})
      }
    }
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  try {
    loading.value = true
    if (formRef.value) {
      const valid = await formRef.value.validate()
      if (valid) {
        await useRegister(form.value)
        handleChange()
      }
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (route.query?.message) ElMessage.warning(route.query.message)
  if (usernameRef.value) usernameRef.value.focus()
  if (timer.value) clearInterval(timer.value)
})
</script>

<template>
  <div class="login-body">
    <el-card style="width: 90%; max-width: 500px;">
      <template #header>
        <div style="text-align: center; font-size: 24px; font-weight: bold;">{{ submitBtnContext }}</div>
      </template>
      <div v-loading="loading">
        <el-form ref="formRef" :rules="rules" label-position="top" :model="form" :label-width="60">
          <el-form-item label="用户名" prop="username">
            <el-input ref="usernameRef" :validate-event="false" @keydown.enter="handleSubmit" v-model="form.username"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input :validate-event="false" @keydown.enter="handleSubmit" type="password" v-model="form.password"/>
          </el-form-item>
          <template v-if="!isLogin">
            <el-form-item label="手机号" prop="phone">
              <el-input :validate-event="false" @keydown.enter="handleSubmit" v-model="form.phone"/>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <div style="display: flex; justify-content: space-between; gap: 10px; width: 100%;">
                <el-input :validate-event="false" @keydown.enter="handleSubmit" v-model="form.code"/>
                <el-button :disabled="!hasSendSms || (countdown > 0)" @click="handleSendCode">{{
                    buttonText
                  }}
                </el-button>
              </div>
            </el-form-item>
          </template>
          <el-button type="primary" link @click="handleChange">{{ changeBtnContext }}</el-button>
          <el-form-item>
            <el-button style="width: 100%; margin-top: 15px;" size="large" @click="handleSubmit">{{ submitBtnContext }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.login-body {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: space-evenly;
}
</style>
