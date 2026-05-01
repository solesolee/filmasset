const gridElement = document.getElementById('grid');
const creditDisplay = document.getElementById('credit');
const winDisplay = document.getElementById('winDisplay');
const flash = document.getElementById('flash');
const spinBtn = document.getElementById('spinBtn');

/* BACKSOUND LOOP */
const bgMusic = new Audio('suara/backsound.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.4;

/* EFEK PETIR */
const thunderSound = new Audio('suara/petir.mp3');
thunderSound.volume = 0.8;

// ==============================================
// DAFTAR SIMBOL
// ==============================================
const symbols = [
    { id:'permata_biru', gambar:'gambar/simbol_biru.png', lebar:'clamp(55px,13vw,85px)', tinggi:'auto' },
    { id:'permata_ungu', gambar:'gambar/simbol_ungu.png', lebar:'clamp(55px,13vw,85px)', tinggi:'auto' },
    { id:'permata_kuning', gambar:'gambar/simbol_kuning.png', lebar:'clamp(55px,13vw,85px)', tinggi:'auto' },
    { id:'permata_merah', gambar:'gambar/simbol_merah.png', lebar:'clamp(55px,13vw,85px)', tinggi:'auto' },
    { id:'permata_hijau', gambar:'gambar/simbol_hijau.png', lebar:'clamp(55px,13vw,85px)', tinggi:'auto' },
    { id:'guci', gambar:'gambar/simbol_guci.png', lebar:'clamp(55px,13vw,85px)', tinggi:'auto' },
    { id:'jam_pasir', gambar:'gambar/simbol_jam.png', lebar:'clamp(55px,13vw,85px)', tinggi:'auto' },
    { id:'cincin', gambar:'gambar/simbol_cincin.png', lebar:'clamp(55px,13vw,85px)', tinggi:'auto' },
    { id:'mahkota', gambar:'gambar/simbol_mahkota.png', lebar:'clamp(55px,13vw,85px)', tinggi:'auto' },
    { id:'petir', gambar:'gambar/simbol_petir.png', lebar:'clamp(55px,13vw,85px)', tinggi:'auto' }
];

let credit = 4200400;
const BET_AMOUNT = 15000;

function initGrid() {
    gridElement.innerHTML = '';

    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'symbol-3d bg-deepPurple/70 border border-borderColor/40 rounded-md aspect-square flex items-center justify-center shadow-gem overflow-hidden';

        const symbolDiv = document.createElement('div');
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

        const imgEl = document.createElement('img');
        imgEl.src = randomSymbol.gambar;
        imgEl.alt = randomSymbol.id;
        imgEl.style.width = randomSymbol.lebar;
        imgEl.style.height = randomSymbol.tinggi;
        imgEl.classList.add('transition-all', 'duration-200');

        symbolDiv.appendChild(imgEl);
        cell.appendChild(symbolDiv);
        gridElement.appendChild(cell);
    }
}

initGrid();

function play() {

    /* MULAIKAN BACKSOUND SAAT KLIK PERTAMA */
    if (bgMusic.paused) {
        bgMusic.play();
    }

    if (credit < BET_AMOUNT) {
        alert("Kredit tidak cukup!");
        return;
    }

    credit -= BET_AMOUNT;
    creditDisplay.innerText = `Rp ${credit.toLocaleString('id-ID')},00`;
    winDisplay.innerText = 'Rp 0,00';

    spinBtn.disabled = true;

    /* PETIR */
    setTimeout(() => {
        thunderSound.currentTime = 0;
        thunderSound.play();

        flash.classList.add('strike');
        setTimeout(() => flash.classList.remove('strike'), 600);
    }, 250);

    const cells = document.querySelectorAll('.symbol-3d');

    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.remove('falling');
            void cell.offsetWidth;
            cell.classList.add('falling');

            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            const imgEl = cell.querySelector('img');

            imgEl.src = randomSymbol.gambar;
            imgEl.alt = randomSymbol.id;

        }, Math.floor(index / 5) * 80);
    });

    setTimeout(() => {

        function cekDanUbahSimbol() {
            const semuaGambar = document.querySelectorAll('.symbol-3d img');
            const hitungan = {};

            semuaGambar.forEach(gambar => {
                const namaFile = gambar.getAttribute('src');
                hitungan[namaFile] = (hitungan[namaFile] || 0) + 1;
            });

            semuaGambar.forEach(gambar => {
                const namaFile = gambar.getAttribute('src');

                if (hitungan[namaFile] >= 8) {
                    const simbolPengganti = symbols.filter(s => s.gambar !== namaFile);
                    const simbolAcak = simbolPengganti[Math.floor(Math.random() * simbolPengganti.length)];

                    gambar.src = simbolAcak.gambar;
                    gambar.alt = simbolAcak.id;

                    hitungan[namaFile]--;
                }
            });
        }

        cekDanUbahSimbol();
        spinBtn.disabled = false;

    }, 1300);
}