const apikey = '85aba2e5d87c4f1c933b962249c570be';
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
const defaultSource = 'the-washington-post';

window.addEventListener('load', async e => {
    updateNews();
    await updateSources();
    sourceSelector.value = defaultSource;

    sourceSelector.addEventListener('change', e => {
        updateNews(e.target.value);
    });

    // test if service worker is present 
    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('sw.js');
            console.log('SW registered');
        } catch (error) {
            console.log('Service Failed');
        }
    }
});

async function updateSources() {
    const res = await fetch('https://newsapi.org/v1/sources');
    const json = await res.json();

    sourceSelector.innerHTML = json.sources.map(src => `<option value="${src.id}">${src.name}</option>`).join('\n');
}

async function updateNews(source = defaultSource) {
    const res = await fetch('https://newsapi.org/v1/articles?source='+source+'&apiKey=85aba2e5d87c4f1c933b962249c570be');
    //console.log(source);
    const json = await res.json();
    main.innerHTML = json.articles.map(createArticle).join('\n');
}

function createArticle(article) {
    return `
        <div class="post-preview">
            <a href="${article.url}" target="_blank">
                <h2 class="post-title">
                  ${article.title}
                </h2>
                <h3 class="post-subtitle">
                  ${article.description}
                </h3>
            </a>
            <p class="post-meta">Posted by
                <a href="javascript:void(0);">${sourceSelector.value}</a>
            </p>
        </div>
        <hr>
    `;
}