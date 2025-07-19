// Components Loader
class ComponentLoader {
  constructor() {
    this.components = {};
  }

  // 加载组件
  async loadComponent(name, selector) {
    try {
      const response = await fetch(`components/${name}.html`);
      const html = await response.text();
      
      // 提取 HTML 内容（去除注释）
      const content = html.replace(/<!--.*?-->/gs, '').trim();
      
      // 插入到指定元素
      const element = document.querySelector(selector);
      if (element) {
        element.innerHTML = content;
        
        // 如果是 header，需要初始化导航功能
        if (name === 'header') {
          this.initNavigation();
        }
      }
      
      this.components[name] = content;
    } catch (error) {
      console.error(`Error loading component ${name}:`, error);
    }
  }

  // 初始化导航功能
  initNavigation() {
    // 移动端菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        if (menuOverlay) {
          menuOverlay.classList.toggle('active');
        }
      });
    }

    // 下拉菜单功能
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');

      if (toggle && menu) {
        // 桌面端悬停显示
        if (window.innerWidth > 768) {
          dropdown.addEventListener('mouseenter', () => {
            menu.style.display = 'block';
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
          });

          dropdown.addEventListener('mouseleave', () => {
            menu.style.display = 'none';
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
          });
        } else {
          // 移动端点击显示
          toggle.addEventListener('click', (e) => {
            e.preventDefault();
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
          });
        }
      }
    });

    // 设置当前页面的活动状态
    this.setActivePage();
  }

  // 设置当前页面的活动状态
  setActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // 加载所有组件
  async loadAll() {
    await Promise.all([
      this.loadComponent('header', '#header-placeholder'),
      this.loadComponent('footer', '#footer-placeholder')
    ]);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  const loader = new ComponentLoader();
  loader.loadAll();
}); 