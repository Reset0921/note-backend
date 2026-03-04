# 笔记管理系统 (Vue3 + Node.js)

一个简单的笔记管理后台，包含登录和笔记 CRUD 功能。

## 技术栈

- **前端**: Vue3 + Element Plus + Vite
- **后端**: Node.js + Express + JSON 文件存储
- **认证**: JWT

## 项目结构

```
note-backend/
├── backend/           # 后端代码
│   ├── src/
│   │   ├── index.js   # 入口
│   │   ├── db.js      # 数据库
│   │   └── routes/    # 路由
│   └── package.json
└── frontend/          # 前端代码
    ├── src/
    │   ├── views/     # 页面
    │   ├── router/    # 路由
    │   └── api/       # API
    └── package.json
```

## 快速开始

### 1. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

### 2. 启动

```bash
# 终端1 - 启动后端 (端口 3000)
cd backend
npm start

# 终端2 - 启动前端 (端口 5173)
cd frontend
npm run dev
```

### 3. 访问

- 前端: http://localhost:5173
- 后端: http://localhost:3000

### 4. 登录

- 用户名: admin
- 密码: admin123

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/login | 登录 |
| GET | /api/notes | 获取笔记列表 |
| POST | /api/notes | 创建笔记 |
| PUT | /api/notes/:id | 更新笔记 |
| DELETE | /api/notes/:id | 删除笔记 |

## License

MIT
