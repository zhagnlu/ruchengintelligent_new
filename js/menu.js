// 移动端菜单切换功能
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    // 菜单切换功能
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      navMenu.classList.toggle('active');

      // 切换菜单按钮的文本
      if (navMenu.classList.contains('active')) {
        menuToggle.innerHTML = '&#10005;'; // X符号
      } else {
        menuToggle.innerHTML = '&#9776;'; // 汉堡菜单符号
      }
    });

    // 关闭菜单函数
    const closeMenu = () => {
      navMenu.classList.remove('active');
      menuToggle.innerHTML = '&#9776;';

      // 关闭所有下拉菜单
      const dropdowns = navMenu.querySelectorAll('.nav-dropdown');
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    };

    // 点击遮罩层关闭菜单
    const menuOverlay = document.querySelector('.menu-overlay');
    if (menuOverlay) {
      menuOverlay.addEventListener('click', () => {
        closeMenu();
      });
    }

    // 下拉菜单切换功能（移动端）
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          // 在移动端，Product链接直接跳转，不展开下拉菜单
          if (toggle.textContent.trim() === 'Product') {
            // 可以在这里添加Product页面的链接
            // window.location.href = '/products';
            return;
          }
          e.preventDefault();
          const dropdown = toggle.closest('.nav-dropdown');
          dropdown.classList.toggle('active');
        }
      });
    });

    // 点击菜单项时关闭菜单（移动端）
    const menuItems = navMenu.querySelectorAll('a:not(.dropdown-toggle)');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });

    // 点击页面其他地方时关闭菜单
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // 窗口大小改变时重置菜单状态
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }
}); 