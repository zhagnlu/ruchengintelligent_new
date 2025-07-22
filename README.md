# Rucheng Technology Website

## 翻译系统

本项目集成了渐进式翻译系统，提供流畅的多语言体验。

### 特性

- ✅ **渐进式翻译** - 页面保持可交互，元素逐个翻译
- ✅ **智能缓存** - 自动缓存翻译结果，提升性能
- ✅ **多服务支持** - LibreTranslate、MyMemory、Yandex等免费服务
- ✅ **实时反馈** - 进度条和元素级状态指示
- ✅ **用户友好** - 无阻塞翻译，平滑动画效果

### 使用方法

1. **标记内容**
```html
<h1 data-translate>Welcome to our website</h1>
<p data-translate>This content will be translated automatically</p>
```

2. **初始化翻译器**
```javascript
const translator = new Translator({
  defaultLang: 'en',
  batchSize: 3,
  delay: 100,
  elements: '[data-translate]'
});
```

3. **切换语言**
- 点击header中的语言选择器
- 选择目标语言
- 观察渐进式翻译效果

### 文件结构

```
js/
├── translator.js      # 渐进式翻译系统
├── components.js      # 组件加载器
├── slider.js          # 轮播图功能
├── menu.js           # 菜单功能
└── comments.js       # 评论系统

translation-demo.html  # 翻译功能演示页面
TRANSLATION_GUIDE.md  # 详细使用指南
```

### 演示

打开 `translation-demo.html` 查看完整的翻译功能演示。

### 配置选项

- `batchSize`: 每批翻译的元素数量 (默认: 3)
- `delay`: 批次间延迟时间 (默认: 100ms)
- `elements`: 翻译元素选择器 (默认: '[data-translate]')

详细配置说明请参考 `TRANSLATION_GUIDE.md`。 