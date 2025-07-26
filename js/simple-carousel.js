let currentSlide = 0;
const totalSlides = 4;
const slidesToShow = 3;
const maxSlideIndex = totalSlides - slidesToShow;

function moveSlide(direction) {
    currentSlide += direction;
    
    // 限制滑动范围
    if (currentSlide < 0) {
        currentSlide = 0;
    } else if (currentSlide > maxSlideIndex) {
        currentSlide = maxSlideIndex;
    }
    
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    
    // 计算每个slide的宽度（包括gap）
    const slideWidth = (100 / slidesToShow); // 33.33%
    const translateX = -currentSlide * slideWidth;
    
    track.style.transform = `translateX(${translateX}%)`;
    
    // 更新按钮状态
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.style.opacity = currentSlide === 0 ? '0.3' : '0.7';
        prevBtn.style.cursor = currentSlide === 0 ? 'not-allowed' : 'pointer';
    }
    
    if (nextBtn) {
        nextBtn.style.opacity = currentSlide >= maxSlideIndex ? '0.3' : '0.7';
        nextBtn.style.cursor = currentSlide >= maxSlideIndex ? 'not-allowed' : 'pointer';
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    updateCarousel();
});

// 自动播放（可选）
let autoPlayInterval = setInterval(function() {
    if (currentSlide < maxSlideIndex) {
        moveSlide(1);
    } else {
        currentSlide = -1; // 重置到开始前的位置
        moveSlide(1);
    }
}, 4000);

// 鼠标悬停时暂停自动播放
const carousel = document.querySelector('.simple-carousel');
if (carousel) {
    carousel.addEventListener('mouseenter', function() {
        clearInterval(autoPlayInterval);
    });
    
    carousel.addEventListener('mouseleave', function() {
        autoPlayInterval = setInterval(function() {
            if (currentSlide < maxSlideIndex) {
                moveSlide(1);
            } else {
                currentSlide = -1;
                moveSlide(1);
            }
        }, 4000);
    });
} 