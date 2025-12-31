const CONFIG = {
    apiKey: "$2a$10$M55GAQGmXXRYA96RdrzW.uAiqpU.X2JqBMvXOyp0dDkE.4zO/0dfa",
    binNews: "69538bcd43b1c97be90de1e6", // Bin khusus berita
    binCountries: "6954de83ae596e708fbbca37" 
};

async function syncArcadiaIntelligence() {
    try {

        const [newsRes, countriesRes] = await Promise.all([
            fetch(`https://api.jsonbin.io/v3/b/${CONFIG.binNews}/latest`, {
                headers: { "X-Master-Key": CONFIG.apiKey }
            }),
            fetch(`https://api.jsonbin.io/v3/b/${CONFIG.binCountries}/latest`, {
                headers: { "X-Master-Key": CONFIG.apiKey }
            })
        ]);

        if (!newsRes.ok || !countriesRes.ok) throw new Error("Synchronization Failed");

        const newsData = await newsRes.json();
        const countriesData = await countriesRes.json();

        renderHighlight(newsData.record.news[0]);
        renderCountries(countriesData.record.countries);

    } catch (err) {
        console.error("SYSTEM ERROR:", err);
    }
}

function renderHighlight(latest) {
    const container = document.getElementById('recent-news-content');
    if (!latest) return;
    container.innerHTML = `
        <div class="w-full h-[200px] mx-auto overflow-hidden rounded-lg mb-4">
            <img src="${latest.image}" class="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500">
        </div>
        <p class="text-center text-sm uppercase tracking-wide font-bold mb-4">${latest.title}</p>
        <div class="text-sm font-sans text-gray-400 space-y-4 text-justify">
            ${latest.content.map(p => `<p>${p}</p>`).join('')}
        </div>`;
}

function renderCountries(countries) {
    const container = document.getElementById('countries-list');
    if (!countries) return;
    container.innerHTML = countries.map(c => `
        <div class="flex items-start space-x-6 border-b border-zinc-900 pb-6 mb-6 last:border-0">
            <img src="${c.president_image}" alt="Leader" class="w-24 h-36 object-cover border border-zinc-700">
            <div class="space-y-2">
                <div class="flex items-center space-x-3">
                    <img src="${c.flag_url}" alt="Flag" class="w-10 h-6 object-cover border border-white/20">
                    <h3 class="font-bbh text-xl uppercase">${c.name}</h3>
                </div>
                <p class="text-gray-400 font-sans text-sm">${c.description}</p>
            </div>
        </div>`).join('');
}

document.addEventListener('DOMContentLoaded', syncArcadiaIntelligence);
