// Scroll
function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

// Cuenta regresiva
const fechaEvento = new Date("March 15, 2026 17:00:00").getTime();
const contador = document.getElementById("contador");

setInterval(()=>{
  const ahora = new Date().getTime();
  const diferencia = fechaEvento - ahora;

  const dias = Math.floor(diferencia/(1000*60*60*24));
  const horas = Math.floor((diferencia/(1000*60*60))%24);
  const minutos = Math.floor((diferencia/1000/60)%60);

  contador.innerHTML = `<div class="cont-info"><span>${dias}</span> <span>días</span></div> 
                        <div class="cont-info"><span>${horas}</span> <span>horas</span></div> 
                        <div class="cont-info"><span>${minutos}</span> <span>minutos</span></div> `;
},1000);

let canvasQR = null;



document.getElementById("descargarQR").addEventListener("click", function() {
  const link = document.createElement("a");
  link.download = "QR-XV.png";
  link.href = canvasQR.toDataURL("images/png");
  link.click();
});

async function validarQR(id) {

  const res = await fetch('/.netlify/functions/validar', {
    method: 'POST',
    body: JSON.stringify({ id })
  });

  const data = await res.json();
  alert(data.mensaje);
}