const JSONBIN_CONFIG = {
    binId: "69538bcd43b1c97be90de1e6",
    apiKey: "$2a$10$M55GAQGmXXRYA96RdrzW.uAiqpU.X2JqBMvXOyp0dDkE.4zO/0dfa" 
};

async function syncArcadiaIntelligence() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_CONFIG.binId}/latest`, {
            headers: { "X-Master-Key": JSONBIN_CONFIG.apiKey }
        });

        if (!response.ok) throw new Error("Database Sync Failed");

        const data = await response.json();
        
        // Eksekusi pembaruan UI
        updateRecentNews(data.record.news);
        updateCountriesList(data.record.countries); // Mengasumsikan ada array 'countries' di Bin Anda

    } catch (err) {
        console.error("CRITICAL SYSTEM ERROR:", err);
    }
}

function updateRecentNews(newsList) {
    const newsContainer = document.getElementById('recent-news-content');
    if (!newsContainer || !newsList || newsList.length === 0) return;

    const latest = newsList[0]; // Ambil berita paling baru
    
    newsContainer.innerHTML = `
        <div class="w-full h-[200px] mx-auto overflow-hidden rounded-lg mb-4">
            <img src="${latest.image}" alt="Intel Image" 
                 class="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500">
        </div>
        <p class="text-center text-sm uppercase tracking-wide font-bold mb-4">${latest.title}</p>
        <div class="text-sm font-sans text-gray-400 space-y-4">
            ${latest.content.map(p => `<p>${p}</p>`).join('')}
        </div>
    `;
}

function updateCountriesList(countries) {
    const countryContainer = document.getElementById('countries-list');
    if (!countryContainer || !countries) return;

    countryContainer.innerHTML = countries.map(c => `
        <div class="flex items-start space-x-6 border-b border-zinc-900 pb-6 mb-6 last:border-0">
            <img src="${c.president_image}" alt="Leader" class="w-24 h-36 object-cover border border-zinc-700">
            <div class="space-y-2">
                <div class="flex items-center space-x-3">
                    <img src="${c.flag_url}" alt="Flag" class="w-10 h-6 object-cover border border-white/20">
                    <h3 class="font-bbh text-xl uppercase">${c.name}</h3>
                </div>
                <p class="text-gray-400 font-sans text-sm">${c.description}</p>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', syncArcadiaIntelligence);
