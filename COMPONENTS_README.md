# 组件模块化说明

## 概述
本项目已实现 header 和 footer 的模块化，可以在多个页面中复用，避免重复代码。

## 文件结构

### 组件文件
- `components/header.html` - Header 模块文件
- `components/footer.html` - Footer 模块文件
- `js/components.js` - 组件加载器 JavaScript

### 页面文件
- `index.html` - 主页
- `about.html` - 关于我们页面
- `product.html` - 产品页面

## 使用方法

### 1. 在页面中添加占位符
```html
<!-- Header Placeholder -->
<div id="header-placeholder"></div>

<!-- 页面内容 -->

<!-- Footer Placeholder -->
<div id="footer-placeholder"></div>
```

### 2. 引入组件加载器
```html
<script src="js/components.js"></script>
```

### 3. 组件会自动加载
页面加载完成后，组件加载器会自动：
- 加载 header 和 footer 模块
- 初始化导航功能
- 设置当前页面的活动状态

## 功能特性

### Header 模块
- 响应式导航菜单
- 移动端侧边栏菜单
- Product 下拉菜单（已修复）
- 当前页面高亮显示

### Footer 模块
- 公司信息展示
- 社交媒体链接
- 服务链接
- 联系信息

### 组件加载器
- 异步加载组件
- 自动初始化功能
- 错误处理
- 响应式支持

## 样式文件
所有样式都在 `css/main.css` 中，该文件导入了所有模块化的 CSS 文件：
- `base.css` - 基础样式
- `header.css` - 头部样式
- `banner.css` - 横幅样式
- `sections.css` - 页面区块样式
- `footer.css` - 页脚样式
- `components.css` - 组件样式
- `responsive.css` - 响应式样式

## 注意事项
1. 确保 `components/` 目录存在
2. 确保 `js/components.js` 文件正确引入
3. 页面必须通过 HTTP 服务器访问（不能直接打开 HTML 文件）
4. 组件加载是异步的，页面内容会在组件加载完成后显示

## 扩展新页面
要创建新页面，只需：
1. 复制现有页面的基本结构
2. 添加 header 和 footer 占位符
3. 引入 `js/components.js`
4. 添加页面特定的内容和样式 