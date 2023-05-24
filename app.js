let cantidad_imagenes = 0;
async function downloadImage(url) {
  let img_order = ++cantidad_imagenes;
  console.log(`Comenzando descarga de imagen Nº${img_order}`);
  const img = await fetch(url);
  const blob = await img.blob();
  console.log(`Se descargó imagen Nº${img_order}`);
  return URL.createObjectURL(blob);
}
async function downloadToFooterUL() {
  console.log("Comenzando descarga de datos de pie de página");
  const data = await fetch("./jsons/network.json");
  const json = await data.json();
  console.log("Se descargaron los últimos datos");
  let inner_html_footer_UL = "";
  for (let i = 0; i < json.networks.length; i++) {
    const {
      network: { name, url },
      colorStyle,
      fontawesomeClass,
    } = json.networks[i];
    inner_html_footer_UL += `
<li>
  <a href="${url}" title="${name.toUpperCase()}" target="_blank">
    <i class="${fontawesomeClass}" style="--color: ${colorStyle}"></i>
  </a>
</li>
    `;
  }
  document.querySelector(".footer-container .network ul").innerHTML =
    inner_html_footer_UL;
}
async function downloadToHTML() {
  console.log("Comenzando descarga de datos principal");
  const data = await fetch("./jsons/data.json");
  const json = await data.json();
  console.log("Se descargaron correctamente los datos");
  let inner_html_main = "";
  for (let i = 0; i < json.posts.length; i++) {
    const { profile, content } = json.posts[i];
    const [photo_profile, photo_content] = await Promise.all([
      downloadImage(profile.url),
      downloadImage(content.url),
    ]);
    inner_html_main += `
<section class="card-container">
  <header class="card-header"><img class="fadeIn" src="${photo_profile}">
    <h3 class="fadeIn">${profile.name}</h3>
  </header>
  <article class="card-content">
    <div class="card-text">
      <p class="fadeIn">${content.text}</p>
    </div>
    <div class="card-image"><img class="fadeIn" src="${photo_content}"></div>
  </article>
</section>
    `;
  }
  document.querySelector(".container").innerHTML = inner_html_main;
  downloadToFooterUL();
  console.log("Se inyectó nuevas estructuras HTML");
  document.querySelector(".footer-container").classList.remove("hidden");
}
downloadToHTML();
