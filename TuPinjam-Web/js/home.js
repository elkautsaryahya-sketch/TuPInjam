document.addEventListener("DOMContentLoaded", () => {
    let stokAlat = JSON.parse(localStorage.getItem("stokAlat"));

    // Kalau belum ada stok → set default
    if (!stokAlat) {
        stokAlat = {
            proyektor: 5,
            hdmi: 5,
            kabel: 5,
            laptop: 5
        };
        localStorage.setItem("stokAlat", JSON.stringify(stokAlat));
    }

    document.querySelectorAll(".alat-card").forEach(card => {
        const alat = card.dataset.alat;
        const stok = stokAlat[alat];

        const stokEl = document.getElementById(`stok-${alat}`);
        stokEl.textContent = `Tersedia = ${stok}`;

        // RESET WARNA
        stokEl.classList.remove("hijau", "orange", "merah");

        if (stok === 0) {
            stokEl.classList.add("merah");
            card.classList.add("disabled");
            card.removeAttribute("href");
        } 
        else if (stok <= 2) {
            stokEl.classList.add("orange");
        } 
        else {
            stokEl.classList.add("hijau");
        }
    });
});
