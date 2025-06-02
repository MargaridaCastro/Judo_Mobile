const RSS_URLS = [
  'https://www.judoinside.com/rss/news',
  'https://www.eju.net/feed',
  'https://irishjudoassociation.ie/feed',
  'https://www.bbc.com/sport/judo'
];

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';
const STORAGE_KEY = 'noticiasJudo';
const STORAGE_TIME_KEY = 'noticiasJudoHora';
const UMA_SEMANA_MS = 7 * 24 * 60 * 60 * 1000;

async function buscarNoticias() {
  const agora = Date.now();
  const ultimaBusca = localStorage.getItem(STORAGE_TIME_KEY);
  const noticiasSalvas = localStorage.getItem(STORAGE_KEY);

  if (noticiasSalvas && ultimaBusca && (agora - Number(ultimaBusca)) < UMA_SEMANA_MS) {
    mostrarNoticias(JSON.parse(noticiasSalvas));
    if ((agora - Number(ultimaBusca)) > 60 * 60 * 1000) {
      atualizarNoticias(); 
    }
    return;
  }

  atualizarNoticias();
}

async function atualizarNoticias() {
  try {
    let todasNoticias = [];

    for (const url of RSS_URLS) {
      const response = await fetch(RSS2JSON_API + encodeURIComponent(url));
      const data = await response.json();

      if (data.status === 'ok' && data.items) {
        const umaSemanaAtras = Date.now() - UMA_SEMANA_MS;
        const noticiasRecentes = data.items.filter(item =>
          new Date(item.pubDate).getTime() >= umaSemanaAtras
        );
        todasNoticias = todasNoticias.concat(noticiasRecentes);
      }
    }

    if (todasNoticias.length > 0) {
      todasNoticias.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todasNoticias));
      localStorage.setItem(STORAGE_TIME_KEY, Date.now());
      mostrarNoticias(todasNoticias);
    } else {
      mostrarErro('Nenhuma notícia recente encontrada.');
    }
  } catch (e) {
    mostrarErro('Erro ao buscar notícias.');
    console.error(e);
  }
}

function mostrarNoticias(noticias) {
  const container = document.getElementById('noticias');
  container.innerHTML = '';

  if (noticias.length === 0) {
    container.innerHTML = '<p>Nenhuma notícia nova de Judô encontrada.</p>';
    return;
  }

  noticias.forEach(noticia => {
    const div = document.createElement('div');
    div.classList.add('caixa-noticia');
    div.innerHTML = `
      <h3><a href="${noticia.link}" target="_blank" rel="noopener noreferrer">${noticia.title}</a></h3>
      <p>${noticia.description || noticia.content || ''}</p>
      <small>Publicado em: ${new Date(noticia.pubDate).toLocaleString()}</small>
    `;
    container.appendChild(div);
  });
}

function mostrarErro(msg) {
  const container = document.getElementById('noticias');
  container.innerHTML = `<p style="color:red;">${msg}</p>`;
}


const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
  item.addEventListener('click', function () {
    menuItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouch) {
  const submenuToggle = document.getElementById('praticarBtn');
  const submenu = document.getElementById('praticarSubmenu');
  submenuToggle.addEventListener('click', () => {
    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
  });
}

buscarNoticias();
setInterval(atualizarNoticias, 60 * 60 * 1000); 

document.addEventListener('DOMContentLoaded', () => {
  const word = 'JUDO';
  const container = document.getElementById('loading-text');
  let index = 0;

  const typeLetter = () => {
    if (index < word.length) {
      const span = document.createElement('span');
      span.setAttribute('data-letter', word[index]);
      span.textContent = word[index];
      container.appendChild(span);
      index++;
      setTimeout(typeLetter, 300);
    } else {
      setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hide');
      }, 1200);
    }
  };

  typeLetter();
});
