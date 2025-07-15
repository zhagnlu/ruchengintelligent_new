# 手机端Banner图片框架使用指南

## 概述
为了在手机端获得最佳的banner显示效果，我们设计了一个专用的图片框架系统。该系统允许您为不同图片设置不同的显示位置和效果。

## 使用方法

### 1. 基础类
在HTML中为banner图片添加相应的CSS类：

```html
<div class="banner-slide mobile-slide">
  <img src="images/banner1.jpg" alt="描述" class="mobile-optimized">
</div>
```

### 2. 可用的CSS类

#### 位置控制类
- `mobile-optimized`: 默认优化位置 (center 20%)
- `mobile-center`: 居中显示
- `mobile-top`: 顶部对齐
- `mobile-bottom`: 底部对齐

#### 图片尺寸类
- `mobile-portrait`: 适合竖屏图片 (center 25%)
- `mobile-landscape`: 适合横屏图片 (center 40%)
- `mobile-square`: 适合方形图片 (center)

### 3. 示例用法

```html
<!-- 竖屏图片 -->
<div class="banner-slide mobile-slide">
  <img src="images/portrait-banner.jpg" alt="竖屏图片" class="mobile-portrait">
</div>

<!-- 横屏图片 -->
<div class="banner-slide mobile-slide">
  <img src="images/landscape-banner.jpg" alt="横屏图片" class="mobile-landscape">
</div>

<!-- 方形图片 -->
<div class="banner-slide mobile-slide">
  <img src="images/square-banner.jpg" alt="方形图片" class="mobile-square">
</div>
```

## 图片建议

### 桌面端图片
- 推荐尺寸: 1920x500px
- 格式: JPG, PNG
- 宽高比: 约4:1

### 手机端图片
- 推荐尺寸: 750x300px (2.5:1)
- 格式: JPG, PNG
- 重要内容应放在图片中央区域

## 特殊效果

### 渐变遮罩
所有手机端图片都会自动添加轻微的渐变遮罩效果，增强视觉层次。

### 图片增强
手机端图片会自动应用轻微的亮度和对比度调整，提升显示效果。

## 响应式断点

- 桌面端: > 768px (高度: 500px)
- 平板端: 769px - 1024px (高度: 400px)
- 手机端: ≤ 768px (高度: 300px)
- 小屏手机: ≤ 480px (高度: 250px)

## 注意事项

1. 所有图片都使用 `object-fit: cover` 模式，确保填满容器
2. 重要内容应避免放在图片边缘，可能被裁剪
3. 建议为手机端准备专门的图片版本
4. 图片文件大小建议控制在200KB以内，确保加载速度 