// Progressive Translation System - User-Friendly & Performance Optimized
class Translator {
  constructor(options = {}) {
    this.currentLang = options.defaultLang || 'en';
    this.apiKey = options.apiKey || '';
    this.translateElements = options.elements || '[data-translate]';
    this.languageSelector = options.selector || '.language-selector';
    this.batchSize = options.batchSize || 3; // 每批翻译的元素数量
    this.translationDelay = options.delay || 100; // 翻译间隔时间
    this.cache = new Map();
    this.pendingTranslations = new Map();
    this.translationQueue = [];
    this.isTranslating = false;
    this.translationProgress = 0;
    this.totalElements = 0;
    
    // 翻译服务配置
    this.translationServices = [
      {
        name: 'libre',
        url: 'https://libretranslate.de/translate',
        method: 'POST',
        requiresKey: false
      },
      {
        name: 'mymemory',
        url: 'https://api.mymemory.translated.net/get',
        method: 'GET',
        requiresKey: false
      },
      {
        name: 'yandex',
        url: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
        method: 'GET',
        requiresKey: false
      }
    ];

    this.init();
  }

  init() {
    this.createLanguageSelector();
    this.bindEvents();
    this.loadSavedLanguage();
    this.loadCachedTranslations();
    this.createProgressIndicator();
    
    // 添加简单的翻译测试
    this.testTranslation();
  }

  async testTranslation() {
    // 简单的翻译测试
    try {
      const testText = 'Hello';
      const result = await this.translateText(testText, 'zh');
      console.log('Translation test:', testText, '->', result);
    } catch (error) {
      console.warn('Translation test failed:', error);
    }
  }

  createLanguageSelector() {
    const existingSelector = document.querySelector(this.languageSelector);
    if (existingSelector) {
      existingSelector.remove();
    }

    const selector = document.createElement('div');
    selector.className = 'language-selector';
    selector.innerHTML = `
      <div class="language-dropdown">
        <button class="language-toggle" aria-label="Select Language">
          <span class="current-lang">${this.getLanguageName(this.currentLang)}</span>
          <span class="lang-arrow">▼</span>
          <span class="translation-indicator" style="display: none;">
            <span class="spinner"></span>
          </span>
        </button>
        <div class="language-menu">
          <button class="lang-option" data-lang="en">
            <span class="lang-flag">🇺🇸</span>
            <span class="lang-name">English</span>
          </button>
          <button class="lang-option" data-lang="zh">
            <span class="lang-flag">🇨🇳</span>
            <span class="lang-name">中文</span>
          </button>
          <button class="lang-option" data-lang="es">
            <span class="lang-flag">🇪🇸</span>
            <span class="lang-name">Español</span>
          </button>
          <button class="lang-option" data-lang="fr">
            <span class="lang-flag">🇫🇷</span>
            <span class="lang-name">Français</span>
          </button>
          <button class="lang-option" data-lang="de">
            <span class="lang-flag">🇩🇪</span>
            <span class="lang-name">Deutsch</span>
          </button>
          <button class="lang-option" data-lang="ja">
            <span class="lang-flag">🇯🇵</span>
            <span class="lang-name">日本語</span>
          </button>
        </div>
      </div>
    `;

    this.addStyles();

    const header = document.querySelector('.main-header .nav-menu');
    if (header) {
      const languageLink = header.querySelector('a[href="#"]');
      if (languageLink) {
        languageLink.parentNode.replaceChild(selector, languageLink);
      }
    }
  }

  createProgressIndicator() {
    // 创建进度指示器
    const progressContainer = document.createElement('div');
    progressContainer.id = 'translation-progress';
    progressContainer.className = 'translation-progress';
    progressContainer.style.display = 'none';
    document.body.appendChild(progressContainer);
  }

  addStyles() {
    if (document.getElementById('dynamic-translator-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'dynamic-translator-styles';
    style.textContent = `
      .language-selector {
        position: relative;
        display: inline-block;
      }

      .language-dropdown {
        position: relative;
      }

      .language-toggle {
        background: none;
        border: none;
        color: #2E4A78;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 0.5px;
        font-family: 'Inter', Arial, sans-serif;
        cursor: pointer;
        padding: 0 15px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-radius: 6px;
        transition: color 0.2s, text-shadow 0.2s;
        height: 100%;
      }

      .language-toggle:hover {
        color: #2563eb;
        text-shadow: 0 2px 8px rgba(59, 130, 246, 0.20);
      }

      .current-lang {
        font-weight: 600;
        color: inherit;
      }



      .lang-arrow {
        font-size: 0.8em;
        transition: transform 0.3s ease;
      }

      .language-dropdown.active .lang-arrow {
        transform: rotate(180deg);
      }

      .translation-indicator {
        display: flex;
        align-items: center;
      }

      .spinner {
        width: 12px;
        height: 12px;
        border: 2px solid transparent;
        border-top: 2px solid #2E4A78;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .language-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        min-width: 150px;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
      }

      .language-dropdown.active .language-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .lang-option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        transition: background 0.3s ease;
        color: #333;
        font-family: 'Inter', Arial, sans-serif;
        font-size: 16px;
        font-weight: 500;
      }

      .lang-option:hover {
        background: #f8f9fa;
      }

      .lang-option.active {
        background: #0074c2;
        color: white;
      }

      .lang-option.translating {
        opacity: 0.6;
        pointer-events: none;
      }

      .lang-flag {
        font-size: 1.2em;
      }

      .lang-name {
        font-weight: 500;
        font-family: 'Inter', Arial, sans-serif;
      }

      /* 进度指示器 */
      .translation-progress {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: #e5e7eb;
        z-index: 10000;
        overflow: hidden;
      }

      .translation-progress::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: linear-gradient(90deg, #10b981, #3b82f6);
        width: 0%;
        transition: width 0.3s ease;
      }

      .translation-progress.active::after {
        width: var(--progress, 0%);
      }

      /* 翻译状态指示器 */
      .translation-status {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 0.9rem;
        z-index: 10000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .translation-status.show {
        opacity: 1;
        transform: translateY(0);
      }

      /* 元素翻译状态 */
      .element-translating {
        position: relative;
        opacity: 0.7;
      }

      .element-translating::after {
        content: '';
        position: absolute;
        top: 50%;
        right: 5px;
        width: 12px;
        height: 12px;
        margin-top: -6px;
        border: 2px solid #2E4A78;
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .element-translated {
        animation: fadeInTranslate 0.5s ease;
      }

      @keyframes fadeInTranslate {
        from {
          opacity: 0.7;
          transform: translateY(5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* 响应式 */
      @media (max-width: 768px) {
        .language-menu {
          right: auto;
          left: 0;
          min-width: 120px;
        }
        
        .language-toggle {
          font-size: 16px !important;
          font-weight: 500 !important;
          padding: 12px 16px !important;
          margin: 0 !important;
          color: #2E4A78 !important;
          background: #fff !important;
          border-bottom: 1px solid #eee !important;
          height: auto !important;
          width: 100% !important;
          justify-content: space-between !important;
        }
        
        .language-toggle:hover {
          background: #eff6ff !important;
          color: #2E4A78 !important;
        }
        
        .lang-option {
          font-size: 14px;
          padding: 10px 12px;
        }
        
        .translation-status {
          bottom: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const toggle = e.target.closest('.language-toggle');
      const option = e.target.closest('.lang-option');
      const dropdown = e.target.closest('.language-dropdown');

      if (toggle) {
        const dropdown = toggle.closest('.language-dropdown');
        dropdown.classList.toggle('active');
      } else if (option && !option.classList.contains('translating')) {
        const lang = option.dataset.lang;
        this.changeLanguage(lang);
        option.closest('.language-dropdown').classList.remove('active');
      } else if (!dropdown) {
        document.querySelectorAll('.language-dropdown').forEach(d => d.classList.remove('active'));
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.language-dropdown').forEach(d => d.classList.remove('active'));
      }
    });
  }

  async changeLanguage(targetLang) {
    if (targetLang === this.currentLang || this.isTranslating) return;

    this.isTranslating = true;
    this.updateTranslationIndicator(true);
    this.showProgressBar();
    
    try {
      await this.translatePageProgressively(targetLang);
      this.currentLang = targetLang;
      this.updateLanguageSelector();
      this.saveLanguage();
      this.showStatus(`Translated to ${this.getLanguageName(targetLang)}`, 2000);
    } catch (error) {
      console.error('Translation failed:', error);
      this.showStatus('Translation failed', 3000);
    } finally {
      this.isTranslating = false;
      this.updateTranslationIndicator(false);
      this.hideProgressBar();
    }
  }

  async translatePageProgressively(targetLang) {
    const elements = document.querySelectorAll(this.translateElements);
    this.totalElements = elements.length;
    this.translationProgress = 0;

    if (this.totalElements === 0) return;

    // 将元素分批处理
    const batches = this.createBatches(Array.from(elements), this.batchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      
      // 并行翻译当前批次
      const promises = batch.map(element => this.translateElement(element, targetLang));
      await Promise.all(promises);
      
      // 更新进度
      this.translationProgress += batch.length;
      this.updateProgressBar();
      
      // 批次间延迟，让用户看到渐进式翻译效果
      if (i < batches.length - 1) {
        await this.delay(this.translationDelay);
      }
    }
  }

  createBatches(array, batchSize) {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  async translateElement(element, targetLang) {
    const originalText = element.textContent.trim();
    if (!originalText) return;

    // 标记元素正在翻译
    element.classList.add('element-translating');

    try {
      const translation = await this.translateText(originalText, targetLang);
      if (translation && translation !== originalText && translation !== 'PLEASE SELECT TWO DISTINCT LANGUAGES') {
        element.textContent = translation;
        element.classList.remove('element-translating');
        element.classList.add('element-translated');
        
        // 缓存翻译结果
        this.cache.set(`${originalText}_${targetLang}`, translation);
      } else {
        // 如果翻译失败或返回占位符，保持原文
        console.warn(`Translation failed or returned placeholder for: ${originalText}`);
        element.classList.remove('element-translating');
      }
    } catch (error) {
      console.warn(`Translation failed for: ${originalText}`, error);
      element.classList.remove('element-translating');
    }
  }

  async translateText(text, targetLang) {
    const cacheKey = `${text}_${targetLang}`;
    
    // 检查缓存
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // 检查是否正在翻译
    if (this.pendingTranslations.has(cacheKey)) {
      return this.pendingTranslations.get(cacheKey);
    }

    // 创建翻译Promise
    const translationPromise = this.performTranslation(text, targetLang);
    this.pendingTranslations.set(cacheKey, translationPromise);

    try {
      const result = await translationPromise;
      this.pendingTranslations.delete(cacheKey);
      return result;
    } catch (error) {
      this.pendingTranslations.delete(cacheKey);
      throw error;
    }
  }

  async performTranslation(text, targetLang) {
    // 尝试不同的翻译服务
    for (const service of this.translationServices) {
      try {
        const result = await this.translateWithService(text, targetLang, service);
        if (result) return result;
      } catch (error) {
        console.warn(`${service.name} translation failed:`, error);
        continue;
      }
    }
    
    // 如果所有服务都失败，返回原文
    return text;
  }

  async translateWithService(text, targetLang, service) {
    switch (service.name) {
      case 'libre':
        return await this.translateWithLibre(text, targetLang);
      case 'mymemory':
        return await this.translateWithMyMemory(text, targetLang);
      case 'yandex':
        return await this.translateWithYandex(text, targetLang);
      default:
        return null;
    }
  }

  async translateWithLibre(text, targetLang) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
      
      const response = await fetch(this.translationServices[0].url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'auto',
          target: targetLang
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const result = data.translatedText;
      
      // 检查结果是否有效
      if (result && typeof result === 'string' && result.trim() && result !== 'PLEASE SELECT TWO DISTINCT LANGUAGES') {
        return result;
      }
      return null;
    } catch (error) {
      console.warn('LibreTranslate failed:', error);
      return null;
    }
  }

  async translateWithMyMemory(text, targetLang) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
      
      const sourceLang = 'en';
      const url = `${this.translationServices[1].url}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const result = data.responseData?.translatedText;
      
      // 检查结果是否有效
      if (result && typeof result === 'string' && result.trim() && result !== 'PLEASE SELECT TWO DISTINCT LANGUAGES') {
        return result;
      }
      return null;
    } catch (error) {
      console.warn('MyMemory translation failed:', error);
      return null;
    }
  }

  async translateWithYandex(text, targetLang) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
      
      const sourceLang = 'en';
      const url = `${this.translationServices[2].url}?key=trnsl.1.1.20231201&text=${encodeURIComponent(text)}&lang=${sourceLang}-${targetLang}`;
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const result = data.text?.[0];
      
      // 检查结果是否有效
      if (result && typeof result === 'string' && result.trim() && result !== 'PLEASE SELECT TWO DISTINCT LANGUAGES') {
        return result;
      }
      return null;
    } catch (error) {
      console.warn('Yandex translation failed:', error);
      return null;
    }
  }

  updateTranslationIndicator(translating) {
    const indicator = document.querySelector('.translation-indicator');
    if (indicator) {
      indicator.style.display = translating ? 'flex' : 'none';
    }
  }

  showProgressBar() {
    const progressBar = document.getElementById('translation-progress');
    if (progressBar) {
      progressBar.style.display = 'block';
      progressBar.classList.add('active');
    }
  }

  hideProgressBar() {
    const progressBar = document.getElementById('translation-progress');
    if (progressBar) {
      progressBar.classList.remove('active');
      setTimeout(() => {
        progressBar.style.display = 'none';
      }, 300);
    }
  }

  updateProgressBar() {
    const progress = (this.translationProgress / this.totalElements) * 100;
    const progressBar = document.getElementById('translation-progress');
    if (progressBar) {
      progressBar.style.setProperty('--progress', `${progress}%`);
    }
  }

  showStatus(message, duration = 3000) {
    let statusDiv = document.querySelector('.translation-status');
    if (!statusDiv) {
      statusDiv = document.createElement('div');
      statusDiv.className = 'translation-status';
      document.body.appendChild(statusDiv);
    }

    statusDiv.textContent = message;
    statusDiv.classList.add('show');

    setTimeout(() => {
      statusDiv.classList.remove('show');
    }, duration);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getLanguageName(langCode) {
    const names = {
      'en': 'English',
      'zh': '中文',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'ja': '日本語'
    };
    return names[langCode] || langCode;
  }

  updateLanguageSelector() {
    const currentLangSpan = document.querySelector('.current-lang');
    if (currentLangSpan) {
      currentLangSpan.textContent = this.getLanguageName(this.currentLang);
    }

    document.querySelectorAll('.lang-option').forEach(option => {
      option.classList.toggle('active', option.dataset.lang === this.currentLang);
    });
  }

  loadCachedTranslations() {
    const cacheKey = `translations_${this.currentLang}`;
    const cached = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    
    Object.entries(cached).forEach(([original, translated]) => {
      this.cache.set(`${original}_${this.currentLang}`, translated);
    });
  }

  saveLanguage() {
    localStorage.setItem('preferred-language', this.currentLang);
  }

  loadSavedLanguage() {
    const saved = localStorage.getItem('preferred-language');
    if (saved && saved !== this.currentLang) {
      this.changeLanguage(saved);
    }
  }

  // Public methods
  getCurrentLanguage() {
    return this.currentLang;
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  clearCache() {
    this.cache.clear();
    localStorage.removeItem(`translations_${this.currentLang}`);
  }

  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      pendingTranslations: this.pendingTranslations.size,
      isTranslating: this.isTranslating,
      progress: this.translationProgress,
      total: this.totalElements
    };
  }

  // 暂停/恢复翻译
  pauseTranslation() {
    this.isTranslating = false;
    this.updateTranslationIndicator(false);
    this.hideProgressBar();
  }

  resumeTranslation() {
    if (this.translationQueue.length > 0) {
      this.isTranslating = true;
      this.updateTranslationIndicator(true);
      this.showProgressBar();
    }
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Translator;
} else {
  window.Translator = Translator;
} 