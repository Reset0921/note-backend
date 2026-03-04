<template>
  <div class="login-page" :class="{ 'is-mobile': isMobile }">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
    </div>
    
    <div class="login-container">
      <div class="login-brand">
        <Notebook class="brand-icon" />
        <h1>笔记管理</h1>
        <p>记录每一刻的灵感</p>
      </div>
      
      <el-card class="login-card" shadow="hover">
        <h2>欢迎回来</h2>
        <p class="subtitle">请登录您的账户</p>
        
        <el-form 
          :model="form" 
          :rules="rules" 
          ref="formRef" 
          label-width="0"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input 
              v-model="form.username" 
              placeholder="用户名"
              :prefix-icon="User"
              size="large"
              class="custom-input"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input 
              v-model="form.password" 
              type="password" 
              placeholder="密码"
              :prefix-icon="Lock"
              size="large"
              class="custom-input"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              size="large" 
              :loading="loading" 
              class="login-btn"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        
        <div class="tips">
          <el-icon><InfoFilled /></el-icon>
          <span>默认账号: admin / admin123</span>
        </div>
      </el-card>
      
      <!-- 主题切换 -->
      <div class="theme-switch">
        <ThemeToggle />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Notebook, InfoFilled } from '@element-plus/icons-vue'
import { login } from '../api'
import ThemeToggle from '../components/ThemeToggle.vue'

const router = useRouter()
const formRef = ref()
const loading = ref(false)
const isMobile = inject('isMobile')

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  loading.value = true
  try {
    const { token, username } = await login(form)
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (err) {
    ElMessage.error(err.response?.data?.error || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
  top: -150px;
  right: -100px;
  animation: float 20s ease-in-out infinite;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  bottom: -100px;
  left: -100px;
  animation: float 25s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(30px, -30px); }
  50% { transform: translate(-20px, 20px); }
  75% { transform: translate(10px, 30px); }
}

.dark .gradient-orb {
  opacity: 0.2;
}

/* 登录容器 */
.login-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  padding: 20px;
}

/* 品牌区域 */
.login-brand {
  text-align: center;
  margin-bottom: 32px;
  animation: fadeInDown 0.6s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.brand-icon {
  font-size: 56px;
  color: var(--accent-color);
  margin-bottom: 16px;
}

.login-brand h1 {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-color), #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.login-brand p {
  color: var(--text-tertiary);
  font-size: 16px;
}

/* 登录卡片 */
.login-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 8px;
  animation: fadeInUp 0.6s ease 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card :deep(.el-card__body) {
  padding: 24px;
}

.login-card h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  text-align: center;
}

.login-card .subtitle {
  color: var(--text-tertiary);
  font-size: 14px;
  text-align: center;
  margin-bottom: 32px;
}

/* 表单 */
.login-form {
  margin-top: 24px;
}

.custom-input :deep(.el-input__wrapper) {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  box-shadow: none;
  border: 1px solid var(--border-color);
  padding: 4px 12px;
}

.custom-input :deep(.el-input__wrapper:hover),
.custom-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.custom-input :deep(.el-input__inner) {
  color: var(--text-primary);
}

.custom-input :deep(.el-input__inner::placeholder) {
  color: var(--text-tertiary);
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, var(--accent-color), #8b5cf6);
  border: none;
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: linear-gradient(135deg, var(--accent-hover), #7c3aed);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

/* 提示 */
.tips {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  color: var(--text-tertiary);
  font-size: 13px;
}

.tips .el-icon {
  color: var(--accent-color);
}

/* 主题切换 */
.theme-switch {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

/* 移动端适配 */
.is-mobile .login-container {
  max-width: 100%;
  padding: 16px;
}

.is-mobile .brand-icon {
  font-size: 48px;
}

.is-mobile .login-brand h1 {
  font-size: 28px;
}

.is-mobile .login-card h2 {
  font-size: 20px;
}
</style>
