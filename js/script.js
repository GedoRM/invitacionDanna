// Scroll
function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}


async function validarQR(id) {

  const res = await fetch('/.netlify/functions/validar', {
    method: 'POST',
    body: JSON.stringify({ id })
  });

  const data = await res.json();
  alert(data.mensaje);
}


    function startReveal() {
        const music = document.getElementById('background-music');
        const musicBtn = document.getElementById('music-control');
        const env = document.getElementById('env');
        const stage = document.getElementById('stage');
        const main = document.getElementById('main-content');
        
        if (music) {
            music.play().catch(e => console.log("Audio play bloqueado: ", e));
            if (musicBtn) musicBtn.style.display = 'flex'; 
        }

        env.classList.add('open');
        
        setTimeout(() => {
            stage.style.opacity = '0';
            setTimeout(() => {
                stage.style.display = 'none';
                main.style.display = 'block';
                window.scrollTo(0, 0);
                setTimeout(() => {
                    main.style.opacity = '1';
                    handleReveal();
                }, 100);
            }, 1000);
        }, 4000);
    }

    
    function toggleMusic() {
        const music = document.getElementById('background-music');
        const icon = document.getElementById('music-icon');
        if (music.paused) {
            music.play();
        } else {
            music.pause();
        }
    }

    const targetDate = new Date("May 01, 2026 17:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const gap = targetDate - now;
        
        if (document.getElementById('days')) {
            document.getElementById('days').innerText = Math.floor(gap / (1000 * 60 * 60 * 24));
            document.getElementById('hours').innerText = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById('mins').innerText = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
        }
    }, 1000);

    function handleReveal() {
        const reveals = document.querySelectorAll(".reveal");
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                el.classList.add('active');
            }
        });
    }
    
    window.addEventListener("scroll", handleReveal);

    window.addEventListener('load', function() {
        const canvas = document.getElementById('background-canvas');
        const ctx = canvas.getContext('2d');

        let particles = [];
        const imageSources = [
            'images/XV_DANNA_PAJARO1.png',
            'images/XV_DANNA_PAJARO2.png',
            'images/XV_DANNA_ZAPATILLA.png',
            'images/XV_DANNA_CARROSA.png',
            'images/XV_DANNA_CORONA.png',
            'images/XV_DANNA_DESTELLO.png',
            'images/XV_DANNA_ORNAMENTO.png'
        ];

        let loadedImages = [];
        let imagesProcessed = 0;

        imageSources.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedImages.push(img);
                checkAllImagesProcessed();
            };
            img.onerror = () => {
                console.warn("Imagen no encontrada: " + src);
                checkAllImagesProcessed();
            };
        });

        function checkAllImagesProcessed() {
            imagesProcessed++;
            if (imagesProcessed === imageSources.length) {
                init();
            }
        }

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor(img) {
                this.img = img;
                this.init();
            }

            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                const scale = Math.random() * 0.12 + 0.08; 
                this.width = this.img.width * scale;
                this.height = this.img.height * scale;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.speedY = (Math.random() - 0.5) * 0.6;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.008;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;
                if (this.x < -this.width) this.x = canvas.width;
                if (this.x > canvas.width) this.x = -this.width;
                if (this.y < -this.height) this.y = canvas.height;
                if (this.y > canvas.height) this.y = -this.height;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = this.opacity;
                ctx.globalCompositeOperation = 'screen'; 
                ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
                ctx.restore();
            }
        }

        function init() {
            particles = [];
            const copiesPerImage = 5; 
            loadedImages.forEach(img => {
                for(let i = 0; i < copiesPerImage; i++) {
                    particles.push(new Particle(img));
                }
            });
            animate();
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
    });