// ... existing code ...
// const backgroundContainer = document.getElementById('background-container');
// const imageCount = 12; // 假设图片数量为 5，可根据实际情况修改
// let currentImageIndex = 2;// 从第 3 张图片开始
// const transitionDuration = 250; // 过渡时间，单位：毫秒

// // 轮换背景图片
// function changeBackground() {
//     // 先添加淡出类
//     backgroundContainer.classList.add('fade-out');

//     setTimeout(() => {
//         currentImageIndex = (currentImageIndex + 1) % imageCount;
//         const imagePath = `images/${currentImageIndex + 1}.png`;
//         backgroundContainer.style.backgroundImage = `url('${imagePath}')`;
        
//         // 移除淡出类，触发淡入效果
//         backgroundContainer.classList.remove('fade-out');
//     }, transitionDuration); 
// }

// // 定时轮换背景图片
// backgroundContainer.style.backgroundImage = `url('images/3.png')`;// 初始背景图片
// setInterval(changeBackground, 3000); // 每 3 秒轮换一次，可根据需要调整

// // 监听滚动事件，实现虚化效果
// window.addEventListener('scroll', () => {
//     if (window.scrollY > 0) {
//         document.body.classList.add('scrolled');
//     } else {
//         document.body.classList.remove('scrolled');
//     }
// });


const images = [
    './images/3.png', './images/2.png', './images/1.png', './images/4.png', './images/5.png', './images/6.png' ,'./images/7.png', './images/8.png', './images/9.png', 
    './images/10.png', './images/11.png', './images/12.png'
];

function initSlideshow() {
    const slides = document.querySelectorAll('.bg-slide');
    let currentIndex = 0, activeSlide = 0;

    function preloadImages() {
        return Promise.all(images.map(url => new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = reject;
        })));
    }

    function changeSlide() {
        const nextIndex = (currentIndex + 1) % images.length;
        const inactiveSlide = activeSlide === 0 ? 1 : 0;
        slides[inactiveSlide].style.backgroundImage = `url(${images[nextIndex]})`;
        slides[activeSlide].classList.remove('active');
        slides[inactiveSlide].classList.add('active');
        currentIndex = nextIndex;
        activeSlide = inactiveSlide;
    }

    preloadImages().then(() => {
        slides[0].style.backgroundImage = `url(${images[0]})`;
        slides[0].classList.add('active');
        setInterval(changeSlide, 5000);
    }).catch(error => console.error('图片加载失败:', error));
}


window.addEventListener('load', initSlideshow);




// 监听鼠标移动事件，创建粒子效果
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = (Math.random() - 0.5) * 0.7;
        this.velocityY = Math.random() * 0.5 + 0.3;
        this.alpha = 1;
        this.size = Math.random() * 5 + 3;
        this.baseColor = { r: Math.random() * 50 + 200, g: Math.random() * 50 + 150, b: Math.random() * 50 + 180 };
    }
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += 0.03;
        this.alpha -= 0.003;
        return this.y < window.innerHeight + 50 && this.alpha > 0;
    }
    draw(ctx) {
        const colorVar = 50 * Math.sin(Date.now() / 300);
        ctx.fillStyle = `rgba(${this.baseColor.r + colorVar},${this.baseColor.g - colorVar},${this.baseColor.b},${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (0.8 + Math.sin(Date.now() / 200) * 0.2), 0, Math.PI * 2);
        ctx.fill();
        if(this.type === 'circle') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        } else {
            ctx.fillRect(this.x-this.size/2, this.y-this.size/2, this.size, this.size);
        }
        ctx.fill();
    }
    
}

class MouseSakura {
    constructor() {
        this.canvas = document.getElementById('sakuraCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = null;
        this.mouseY = null;
        this.init();
    }
    init() {
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
        document.addEventListener('mousemove', e => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.createParticles(3);
        });
        document.addEventListener('mouseleave', () => {
            this.mouseX = null;
            this.mouseY = null;
        });
        this.animate();
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    createParticles(count) {
        if (!this.mouseX || !this.mouseY) return;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 30;
            const x = this.mouseX + Math.cos(angle) * radius;
            const y = this.mouseY + Math.sin(angle) * radius;
            this.particles.push(new Particle(x, y));
        }
    }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = this.particles.length - 1; i >= 0; i--) {
            if (!this.particles[i].update()) {
                this.particles.splice(i, 1);
            } else {
                this.particles[i].draw(this.ctx);
            }
        }
        requestAnimationFrame(this.animate.bind(this));
    }
}

window.addEventListener('load', () => new MouseSakura());


initBlurEffect(); // 初始化模糊效果

// 监听滚动事件，创建模糊效果

function initBlurEffect() {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const maxBlur = 10; // 最大模糊程度（像素）
        const blurValue = Math.min(scrollPosition / 100, maxBlur); // 每滚动100px增加1px模糊
        document.querySelector('.slideshow').style.filter = `blur(${blurValue}px)`;
    });
}

//服务器数据获取

const serverIp_1 = '103.205.253.104:13902'; 
const apiUrl_1 = `https://api.mcsrvstat.us/2/${serverIp_1}`;

fetch(apiUrl_1)
  .then(response => {
        if (!response.ok) {
            throw new Error('网络响应不正常');
        }
        return response.json();
    })
  .then(data => {
        const statusDiv = document.getElementById('server-status-1');
        if (data.online) {
            statusDiv.innerHTML = `服务器在线，当前玩家数量: ${data.players.online}/${data.players.max}`;
        } else {
            statusDiv.innerHTML = '服务器离线';
        }
    })
  .catch(error => {
        console.error('获取数据时出错:', error);
    });

const serverIp_2 = '103.205.253.104:57904';
const apiUrl_2 = `https://api.mcsrvstat.us/2/${serverIp_2}`;

fetch(apiUrl_2)
    .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.json();
        })
    .then(data => {
            const statusDiv = document.getElementById('server-status-2');
            if (data.online) {
                statusDiv.innerHTML = `服务器在线，当前玩家数量: ${data.players.online}/${data.players.max}`;
            } else {
                statusDiv.innerHTML = '服务器离线';
            }
        })
    .catch(error => {
            console.error('获取数据时出错:', error);
        });


