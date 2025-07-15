class BannerSlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.banner-slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.totalSlides = this.slides.length;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000; // 5秒自动切换
    
    this.init();
  }
  
  init() {
    if (this.totalSlides <= 1) return;
    
    // 绑定事件
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // 绑定指示器点击事件
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
    
    // 鼠标悬停时暂停自动播放
    const slider = document.querySelector('.banner-slider');
    slider.addEventListener('mouseenter', () => this.pauseAutoPlay());
    slider.addEventListener('mouseleave', () => this.startAutoPlay());
    
    // 开始自动播放
    this.startAutoPlay();
    
    // 添加键盘支持
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });
  }
  
  showSlide(index) {
    // 隐藏所有幻灯片
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // 显示当前幻灯片
    this.slides[index].classList.add('active');
    this.indicators[index].classList.add('active');
    
    this.currentSlide = index;
  }
  
  nextSlide() {
    const next = (this.currentSlide + 1) % this.totalSlides;
    this.showSlide(next);
  }
  
  prevSlide() {
    const prev = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.showSlide(prev);
  }
  
  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.showSlide(index);
    }
  }
  
  startAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }
  
  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// 页面加载完成后初始化轮播
document.addEventListener('DOMContentLoaded', () => {
  new BannerSlider();
}); 