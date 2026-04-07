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