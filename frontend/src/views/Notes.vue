<template>
  <div class="notes-container">
    <!-- 顶部导航 -->
    <div class="header">
      <h2>我的笔记</h2>
      <div class="header-right">
        <span class="username">{{ username }}</span>
        <el-button type="danger" size="small" @click="handleLogout">退出</el-button>
      </div>
    </div>
    
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" :icon="Plus" @click="handleAdd">新建笔记</el-button>
      <el-button :icon="Refresh" @click="loadNotes">刷新</el-button>
    </div>
    
    <!-- 笔记列表 -->
    <div class="notes-grid">
      <el-card 
        v-for="note in notes" 
        :key="note.id" 
        class="note-card"
        shadow="hover"
        @click="handleEdit(note)"
      >
        <template #header>
          <div class="note-header">
            <span class="note-title">{{ note.title }}</span>
            <el-dropdown @command="(cmd) => handleCommand(cmd, note)">
              <el-button :icon="MoreFilled" size="small" text />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
        <div class="note-content">
          {{ note.content || '暂无内容...' }}
        </div>
        <div class="note-footer">
          {{ formatDate(note.updated_at) }}
        </div>
      </el-card>
      
      <!-- 空状态 -->
      <el-empty v-if="notes.length === 0 && !loading" description="暂无笔记，点击新建开始" />
    </div>
    
    <!-- 编辑对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑笔记' : '新建笔记'"
      width="600px"
    >
      <el-form :model="form" label-width="60px">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input 
            v-model="form.content" 
            type="textarea" 
            :rows="10" 
            placeholder="请输入内容"
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, MoreFilled } from '@element-plus/icons-vue'
import { getNotes, createNote, updateNote, deleteNote } from '../api'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '用户')
const notes = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const currentId = ref(null)

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
  return new Date(date).toLocaleString('zh-CN')
}

onMounted(() => {
  loadNotes()
})
</script>

<style scoped>
.notes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.username {
  color: #666;
}

.toolbar {
  margin-bottom: 20px;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.note-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.note-card:hover {
  transform: translateY(-5px);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-title {
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-content {
  color: #666;
  font-size: 14px;
  height: 80px;
  overflow: hidden;
  margin-bottom: 10px;
}

.note-footer {
  color: #999;
  font-size: 12px;
}
</style>
