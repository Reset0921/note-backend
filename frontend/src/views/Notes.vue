<template>
  <div class="notes-page" :class="{ 'is-mobile': isMobile }">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
    
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <Notebook class="logo-icon" />
          <h1>笔记</h1>
        </div>
        <div class="header-right">
          <ThemeToggle />
          <div class="user-info">
            <el-avatar :size="32" class="user-avatar">
              {{ username?.charAt(0)?.toUpperCase() }}
            </el-avatar>
            <span class="username">{{ username }}</span>
          </div>
          <el-button 
            type="danger" 
            size="small" 
            :circle="isMobile"
            @click="handleLogout"
          >
            {{ isMobile ? '' : '退出' }}
          </el-button>
        </div>
      </div>
    </header>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 工具栏 -->
      <div class="toolbar">
        <el-button 
          type="primary" 
          :icon="Plus" 
          @click="handleAdd"
          class="add-btn"
        >
          新建笔记
        </el-button>
        <el-button 
          :icon="Refresh" 
          @click="loadNotes"
          class="refresh-btn"
        >
          刷新
        </el-button>
      </div>
      
      <!-- 笔记统计 -->
      <div class="stats">
        <div class="stat-item">
          <span class="stat-value">{{ notes.length }}</span>
          <span class="stat-label">笔记总数</span>
        </div>
      </div>
      
      <!-- 笔记列表 -->
      <div class="notes-grid" v-if="notes.length > 0">
        <el-card 
          v-for="(note, index) in notes" 
          :key="note.id" 
          class="note-card"
          :style="{ animationDelay: `${index * 0.05}s` }"
          shadow="hover"
          @click="handleEdit(note)"
        >
          <template #header>
            <div class="note-header">
              <span class="note-title">{{ note.title }}</span>
              <el-dropdown @command="(cmd) => handleCommand(cmd, note)">
                <el-button :icon="MoreFilled" size="small" text class="more-btn" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="edit">
                      <Edit />编辑
                    </el-dropdown-item>
                    <el-dropdown-item command="delete" divided>
                      <Delete />删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <div class="note-content">
            {{ note.content || '暂无内容...' }}
          </div>
          <div class="note-footer">
            <el-icon><Clock /></el-icon>
            <span>{{ formatDate(note.updated_at) }}</span>
          </div>
        </el-card>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="!loading" class="empty-state">
        <div class="empty-illustration">
          <Notebook />
        </div>
        <p>还没有笔记</p>
        <el-button type="primary" :icon="Plus" @click="handleAdd">
          创建第一篇笔记
        </el-button>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <el-skeleton 
          v-for="i in 4" 
          :key="i" 
          animated 
          class="skeleton-card"
        >
          <template #template>
            <el-skeleton-item variant="h3" style="width: 60%" />
            <el-skeleton-item variant="text" style="margin-top: 16px" />
            <el-skeleton-item variant="text" style="width: 80%" />
          </template>
        </el-skeleton>
      </div>
    </main>
    
    <!-- 编辑对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑笔记' : '新建笔记'"
      :width="isMobile ? '95%' : '600px'"
      class="edit-dialog"
      :show-close="!isMobile"
    >
      <el-form :model="form" label-width="60px" class="edit-form">
        <el-form-item label="标题">
          <el-input 
            v-model="form.title" 
            placeholder="请输入标题" 
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="内容">
          <el-input 
            v-model="form.content" 
            type="textarea" 
            :rows="isMobile ? 8 : 12" 
            placeholder="请输入内容..."
            maxlength="10000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, MoreFilled, Notebook, Edit, Delete, Clock } from '@element-plus/icons-vue'
import { getNotes, createNote, updateNote, deleteNote } from '../api'
import ThemeToggle from '../components/ThemeToggle.vue'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '用户')
const notes = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const currentId = ref(null)

const isMobile = inject('isMobile')

const form = reactive({
  title: '',
  content: ''
})

// 加载笔记
const loadNotes = async () => {
  loading.value = true
  try {
    notes.value = await getNotes()
  } catch (err) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 新建
const handleAdd = () => {
  isEdit.value = false
  currentId.value = null
  form.title = ''
  form.content = ''
  dialogVisible.value = true
}

// 编辑
const handleEdit = (note) => {
  isEdit.value = true
  currentId.value = note.id
  form.title = note.title
  form.content = note.content
  dialogVisible.value = true
}

// 保存
const handleSave = async () => {
  if (!form.title.trim()) {
    ElMessage.warning('请输入标题')
    return
  }
  
  saving.value = true
  try {
    if (isEdit.value) {
      await updateNote(currentId.value, form)
      ElMessage.success('更新成功')
    } else {
      await createNote(form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadNotes()
  } catch (err) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 操作菜单
const handleCommand = async (cmd, note) => {
  if (cmd === 'edit') {
    handleEdit(note)
  } else if (cmd === 'delete') {
    try {
      await ElMessageBox.confirm('确定要删除这条笔记吗？', '提示', {
        type: 'warning'
      })
      await deleteNote(note.id)
      ElMessage.success('删除成功')
      loadNotes()
    } catch (err) {
      if (err !== 'cancel') {
        ElMessage.error('删除失败')
      }
    }
  }
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/login')
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  
  // 小于1分钟
  if (diff < 60000) return '刚刚'
  // 小于1小时
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  // 小于1天
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  // 小于7天
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
  
  // 超过7天显示日期
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

onMounted(() => {
  loadNotes()
})
</script>

<style scoped>
.notes-page {
  min-height: 100vh;
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
  z-index: 0;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  top: -100px;
  right: -100px;
  animation: float 20s ease-in-out infinite;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  bottom: -50px;
  left: -50px;
  animation: float 25s ease-in-out infinite reverse;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
  top: 40%;
  left: 30%;
  animation: float 18s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(20px, -20px); }
  50% { transform: translate(-10px, 20px); }
  75% { transform: translate(15px, 10px); }
}

.dark .gradient-orb {
  opacity: 0.15;
}

/* 头部 */
.header {
  position: relative;
  z-index: 10;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 16px 0;
  backdrop-filter: blur(10px);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
  color: var(--accent-color);
}

.logo h1 {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent-color), #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  background: linear-gradient(135deg, var(--accent-color), #8b5cf6);
  color: white;
  font-weight: 600;
}

.username {
  color: var(--text-secondary);
  font-size: 14px;
}

/* 主内容 */
.main-content {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* 工具栏 */
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.add-btn {
  background: linear-gradient(135deg, var(--accent-color), #8b5cf6);
  border: none;
  font-weight: 500;
}

.add-btn:hover {
  background: linear-gradient(135deg, var(--accent-hover), #7c3aed);
}

.refresh-btn {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-secondary);
}

/* 统计 */
.stats {
  margin-bottom: 24px;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-secondary);
  padding: 12px 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent-color);
}

.stat-label {
  color: var(--text-tertiary);
  font-size: 14px;
}

/* 笔记网格 */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.note-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
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

.note-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-color);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-title {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.more-btn {
  color: var(--text-tertiary);
}

.note-content {
  color: var(--text-secondary);
  font-size: 14px;
  height: 80px;
  overflow: hidden;
  margin-bottom: 12px;
  line-height: 1.6;
}

.note-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-tertiary);
  font-size: 12px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-illustration {
  width: 120px;
  height: 120px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  border: 2px dashed var(--border-color);
}

.empty-illustration .el-icon {
  font-size: 48px;
  color: var(--text-tertiary);
}

.empty-state p {
  color: var(--text-tertiary);
  font-size: 16px;
  margin-bottom: 20px;
}

/* 加载状态 */
.loading-state {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.skeleton-card {
  background: var(--bg-card);
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

/* 移动端适配 */
.is-mobile .header-content {
  padding: 0 16px;
}

.is-mobile .logo h1 {
  font-size: 18px;
}

.is-mobile .username {
  display: none;
}

.is-mobile .main-content {
  padding: 20px 16px;
}

.is-mobile .notes-grid {
  grid-template-columns: 1fr;
}

.is-mobile .stat-item {
  padding: 10px 16px;
}

.is-mobile .stat-value {
  font-size: 20px;
}
</style>
