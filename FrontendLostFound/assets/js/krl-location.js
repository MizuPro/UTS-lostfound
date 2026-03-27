// assets/js/krl-location.js
// Interactive KRL Route Map — v4 — accurate to KAI Commuter reference map
document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // STATIONS — matched to official KAI Commuter Peta Rute
    // labelPos prevents overlap; isHub = larger dot
    // ============================================================
    const stations = {

        // ========== JABODETABEK & MERAK ==========

        // --- BOGOR LINE (Merah) — Jakarta Kota → Bogor ---
        'Jakarta Kota':        { x: 520, y: 190, isHub: true, labelPos: 'bottom' },
        'Jayakarta':           { x: 600, y: 170, labelPos: 'top' },
        'Mangga Besar':        { x: 640, y: 230, labelPos: 'right' },
        'Sawah Besar':         { x: 640, y: 290, labelPos: 'right' },
        'Juanda':              { x: 640, y: 350, labelPos: 'right' },
        'Gambir':              { x: 640, y: 385, labelPos: 'left' },
        'Gondangdia':          { x: 640, y: 420, labelPos: 'right' },
        'Cikini':              { x: 640, y: 475, labelPos: 'right' },
        'Manggarai':           { x: 640, y: 550, isHub: true, labelPos: 'bottom' },
        'Tebet':               { x: 640, y: 625, labelPos: 'right' },
        'Cawang':              { x: 640, y: 685, labelPos: 'right' },
        'Duren Kalibata':      { x: 640, y: 745, labelPos: 'right' },
        'Pasar Minggu Baru':   { x: 640, y: 805, labelPos: 'right' },
        'Pasar Minggu':        { x: 640, y: 865, labelPos: 'right' },
        'Tanjung Barat':       { x: 640, y: 925, labelPos: 'right' },
        'Lenteng Agung':       { x: 640, y: 985, labelPos: 'right' },
        'Univ. Pancasila':     { x: 640, y: 1045, labelPos: 'right' },
        'Univ. Indonesia':     { x: 640, y: 1105, labelPos: 'right' },
        'Pondok Cina':         { x: 640, y: 1165, labelPos: 'right' },
        'Depok Baru':          { x: 640, y: 1225, labelPos: 'right' },
        'Depok':               { x: 640, y: 1285, labelPos: 'right' },
        'Citayam':             { x: 640, y: 1355, isHub: true, labelPos: 'left' },
        'Bojong Gede':         { x: 640, y: 1415, labelPos: 'right' },
        'Cilebut':             { x: 640, y: 1475, labelPos: 'right' },
        'Bogor':               { x: 640, y: 1545, isTerminus: true, labelPos: 'right' },

        // Nambo Branch (from Citayam east)
        'Pondok Rajeg':        { x: 755, y: 1355, labelPos: 'top' },
        'Cibinong':            { x: 855, y: 1355, labelPos: 'top' },
        'Gunung Putri':        { x: 930, y: 1400, labelPos: 'right' },
        'Nambo':               { x: 930, y: 1470, isTerminus: true, labelPos: 'right' },

        // --- CIKARANG LINE (Biru) — Loop + East extension ---
        // East side vertical (north → south)
        'Rajawali':            { x: 920, y: 170, labelPos: 'right' },
        'Kemayoran':           { x: 920, y: 240, labelPos: 'right' },
        'Pasar Senen':         { x: 920, y: 310, labelPos: 'right' },
        'Gang Sentiong':       { x: 920, y: 370, labelPos: 'right' },
        'Kramat':              { x: 920, y: 430, labelPos: 'right' },
        'Pondok Jati':         { x: 920, y: 490, labelPos: 'right' },
        'Jatinegara':          { x: 920, y: 550, isHub: true, labelPos: 'right' },
        'Matraman':            { x: 785, y: 550, labelPos: 'top' },

        // Cikarang branch (south from Jatinegara)
        'Klender':             { x: 920, y: 620, labelPos: 'right' },
        'Buaran':              { x: 920, y: 680, labelPos: 'right' },
        'Klender Baru':        { x: 920, y: 740, labelPos: 'right' },
        'Cakung':              { x: 920, y: 800, labelPos: 'right' },
        'Kranji':              { x: 920, y: 860, labelPos: 'right' },
        'Bekasi':              { x: 920, y: 930, isHub: true, labelPos: 'right' },
        'Bekasi Timur':        { x: 920, y: 990, labelPos: 'right' },
        'Tambun':              { x: 920, y: 1050, labelPos: 'right' },
        'Cibitung':            { x: 920, y: 1110, labelPos: 'right' },
        'Metland Telaga Murni':{ x: 920, y: 1170, labelPos: 'right' },
        'Cikarang':            { x: 920, y: 1240, isTerminus: true, labelPos: 'right' },

        // Loop transit — center/west
        'Kampung Bandan':      { x: 520, y: 115, isHub: true, labelPos: 'top' },
        'Angke':               { x: 390, y: 250, labelPos: 'left' },
        'Duri':                { x: 390, y: 400, isHub: true, labelPos: 'left' },
        'Tanah Abang':         { x: 390, y: 550, isHub: true, labelPos: 'left' },
        'Karet':               { x: 460, y: 550, labelPos: 'top' },
        'BNI City':            { x: 510, y: 550, isHub: true, labelPos: 'bottom' },
        'Sudirman':            { x: 560, y: 550, labelPos: 'top' },

        // --- RANGKASBITUNG LINE (Hijau) — Tanah Abang → Rangkasbitung ---
        'Palmerah':            { x: 390, y: 620, labelPos: 'left' },
        'Kebayoran':           { x: 390, y: 680, labelPos: 'left' },
        'Pondok Ranji':        { x: 390, y: 740, labelPos: 'left' },
        'Jurang Mangu':        { x: 390, y: 800, labelPos: 'left' },
        'Sudimara':            { x: 390, y: 860, labelPos: 'left' },
        'Rawa Buntu':          { x: 390, y: 930, labelPos: 'left' },
        'Serpong':              { x: 390, y: 990, labelPos: 'left' },
        'Cisauk':              { x: 390, y: 1050, labelPos: 'left' },
        'Cicayur':             { x: 390, y: 1110, labelPos: 'left' },
        'Jatake':              { x: 390, y: 1170, labelPos: 'left' },     // ADDED
        'Parung Panjang':      { x: 390, y: 1240, isHub: true, labelPos: 'left' },
        'Parayasa':            { x: 390, y: 1300, labelPos: 'left' },     // ADDED
        'Cilejit':             { x: 390, y: 1360, labelPos: 'left' },
        'Daru':                { x: 390, y: 1420, labelPos: 'left' },
        'Tenjo':               { x: 390, y: 1480, labelPos: 'left' },
        'Tigaraksa':           { x: 390, y: 1540, labelPos: 'left' },
        'Cikoya':              { x: 390, y: 1600, labelPos: 'left' },
        'Maja':                { x: 390, y: 1665, labelPos: 'left' },
        'Citeras':             { x: 450, y: 1730, labelPos: 'bottom' },
        'Rangkasbitung':       { x: 540, y: 1730, isHub: true, labelPos: 'top' },

        // --- MERAK (satu garis lanjutan dari Rangkasbitung) ---
        'Catang':              { x: 640, y: 1730, labelPos: 'bottom' },
        'Walantaka':           { x: 740, y: 1730, labelPos: 'top' },
        'Karangantu':          { x: 840, y: 1730, labelPos: 'bottom' },
        'Cilegon':             { x: 940, y: 1730, labelPos: 'top' },
        'Merak':               { x: 1050, y: 1730, isTerminus: true, labelPos: 'bottom' },

        // --- TANGERANG LINE (Oranye) — Duri → Tangerang ---
        'Grogol':              { x: 340, y: 355, labelPos: 'left' },
        'Pesing':              { x: 340, y: 305, labelPos: 'left' },
        'Taman Kota':          { x: 340, y: 250, labelPos: 'left' },
        'Bojong Indah':        { x: 340, y: 195, labelPos: 'left' },
        'Rawa Buaya':          { x: 340, y: 140, labelPos: 'left' },
        'Kali Deres':          { x: 280, y: 88, labelPos: 'top' },     // renamed to match ref
        'Poris':               { x: 218, y: 88, labelPos: 'top' },
        'Batu Ceper':          { x: 152, y: 88, isHub: true, labelPos: 'top' },
        'Tanah Tinggi':        { x: 92, y: 88, labelPos: 'top' },
        'Tangerang':           { x: 32, y: 88, isTerminus: true, labelPos: 'top' },

        // --- TANJUNG PRIOK LINE (Pink) — Jakarta Kota → Tanjung Priok ---
        'Ancol':               { x: 650, y: 115, labelPos: 'top' },
        'JIS':                 { x: 790, y: 115, labelPos: 'top' },
        'Tanjung Priok':       { x: 1000, y: 115, isTerminus: true, labelPos: 'top' },

        // --- BANDARA LINE (Ungu gelap dash) ---
        // T1/T2/T3 positioned BELOW and LEFT of Tangerang line (y=88) to avoid overlap
        'T1':                  { x: 115, y: 170, labelPos: 'left' },
        'T2':                  { x: 75, y: 145, labelPos: 'left' },
        'T3':                  { x: 35, y: 120, labelPos: 'left' },
        'Bandara Soekarno-Hatta': { x: 10, y: 200, isTerminus: true, labelPos: 'left' },


        // ========== JOGJA - SOLO ==========
        // Shifted right so legend (now top-right) doesn't overlap
        'Yogyakarta':          { x: 200, y: 300, isHub: true, region: 'jogja', labelPos: 'top' },
        'Lempuyangan':         { x: 330, y: 300, region: 'jogja', labelPos: 'bottom' },
        'Maguwo':              { x: 460, y: 300, region: 'jogja', labelPos: 'top' },
        'Brambanan':           { x: 590, y: 300, region: 'jogja', labelPos: 'bottom' },
        'Srowot':              { x: 720, y: 300, region: 'jogja', labelPos: 'top' },
        'Klaten':              { x: 850, y: 300, isHub: true, region: 'jogja', labelPos: 'bottom' },
        'Ceper':               { x: 980, y: 300, region: 'jogja', labelPos: 'top' },
        'Delanggu':            { x: 1110, y: 300, region: 'jogja', labelPos: 'bottom' },
        'Gawok':               { x: 1240, y: 300, region: 'jogja', labelPos: 'top' },
        'Purwosari':           { x: 1370, y: 300, region: 'jogja', labelPos: 'bottom' },
        'Solo Balapan':        { x: 1500, y: 300, isHub: true, region: 'jogja', labelPos: 'top' },
        'Solo Jebres':         { x: 1630, y: 300, region: 'jogja', labelPos: 'bottom' },
        'Palur':               { x: 1760, y: 300, isTerminus: true, region: 'jogja', labelPos: 'top' },
        // Prameks — Yogyakarta → Kutoarjo (vertical branch down)
        'Wates':               { x: 200, y: 450, isHub: true, region: 'jogja', labelPos: 'right' },
        'Wojo':                { x: 200, y: 580, region: 'jogja', labelPos: 'right' },
        'Jenar':               { x: 200, y: 710, region: 'jogja', labelPos: 'right' },
        'Kutoarjo':            { x: 200, y: 840, isTerminus: true, region: 'jogja', labelPos: 'right' },


        // ========== BANDUNG RAYA ==========
        'Padalarang':          { x: 100, y: 300, isTerminus: true, region: 'bandung', labelPos: 'top' },
        'Gadobangkong':        { x: 230, y: 300, region: 'bandung', labelPos: 'bottom' },
        'Cimahi':              { x: 360, y: 300, isHub: true, region: 'bandung', labelPos: 'top' },
        'Cimindi':             { x: 490, y: 300, region: 'bandung', labelPos: 'bottom' },
        'Andir':               { x: 600, y: 300, region: 'bandung', labelPos: 'top' },
        'Ciroyom':             { x: 710, y: 300, region: 'bandung', labelPos: 'bottom' },
        'Bandung':             { x: 840, y: 300, isHub: true, region: 'bandung', labelPos: 'top' },
        'Cikudapateuh':        { x: 970, y: 300, region: 'bandung', labelPos: 'bottom' },
        'Kiaracondong':        { x: 1100, y: 300, isHub: true, region: 'bandung', labelPos: 'top' },
        'Haurpugur':           { x: 1230, y: 300, region: 'bandung', labelPos: 'bottom' },
        'Rancaekek':           { x: 1360, y: 300, isHub: true, region: 'bandung', labelPos: 'top' },
        'Cicalengka':          { x: 1500, y: 300, isTerminus: true, region: 'bandung', labelPos: 'top' },
        'Haurpugur Selatan':   { x: 1360, y: 430, region: 'bandung', labelPos: 'right' },
        'Tanjungsari':         { x: 1360, y: 560, isTerminus: true, region: 'bandung', labelPos: 'right' },


        // ========== SURABAYA & JATIM ==========
        'Surabaya Kota':       { x: 200, y: 300, isHub: true, region: 'surabaya', labelPos: 'top' },
        'Surabaya Gubeng':     { x: 380, y: 300, isHub: true, region: 'surabaya', labelPos: 'top' },
        'Wonokromo':           { x: 540, y: 300, isHub: true, region: 'surabaya', labelPos: 'top' },
        'Ngagel':              { x: 540, y: 400, region: 'surabaya', labelPos: 'right' },
        'Margorejo':           { x: 540, y: 490, region: 'surabaya', labelPos: 'right' },
        'Sawotratap':          { x: 540, y: 580, region: 'surabaya', labelPos: 'right' },
        'Gedangan':            { x: 540, y: 670, region: 'surabaya', labelPos: 'right' },
        'Sidoarjo':            { x: 540, y: 760, isHub: true, region: 'surabaya', labelPos: 'right' },
        'Tanggulangin':        { x: 540, y: 850, region: 'surabaya', labelPos: 'right' },
        'Porong':              { x: 540, y: 940, isTerminus: true, region: 'surabaya', labelPos: 'right' },
        'Benowo':              { x: 200, y: 420, region: 'surabaya', labelPos: 'left' },
        'Kandangan':           { x: 200, y: 530, region: 'surabaya', labelPos: 'left' },
        'Cerme':               { x: 200, y: 640, region: 'surabaya', labelPos: 'left' },
        'Duduk Sampeyan':      { x: 200, y: 750, region: 'surabaya', labelPos: 'left' },
        'Lamongan':            { x: 200, y: 860, isTerminus: true, region: 'surabaya', labelPos: 'left' },
        'Waru':                { x: 720, y: 300, region: 'surabaya', labelPos: 'top' },
        'Bangil':              { x: 880, y: 300, isHub: true, region: 'surabaya', labelPos: 'top' },
        'Pasuruan':            { x: 1040, y: 300, isTerminus: true, region: 'surabaya', labelPos: 'top' },
    };


    // ============================================================
    // ROUTES — path sequences
    // ============================================================
    const routes = [
        // --- JABODETABEK ---
        { name:"Bogor Line", color:"#E2211C", sw:8,
          lines:["Jakarta Kota","Jayakarta","Mangga Besar","Sawah Besar","Juanda","Gambir","Gondangdia","Cikini","Manggarai","Tebet","Cawang","Duren Kalibata","Pasar Minggu Baru","Pasar Minggu","Tanjung Barat","Lenteng Agung","Univ. Pancasila","Univ. Indonesia","Pondok Cina","Depok Baru","Depok","Citayam","Bojong Gede","Cilebut","Bogor"] },
        { name:"Nambo Branch", color:"#E2211C", sw:6,
          lines:["Citayam","Pondok Rajeg","Cibinong","Gunung Putri","Nambo"] },

        { name:"Cikarang Line East", color:"#00A2E9", sw:8,
          lines:["Jatinegara","Klender","Buaran","Klender Baru","Cakung","Kranji","Bekasi","Bekasi Timur","Tambun","Cibitung","Metland Telaga Murni","Cikarang"] },
        { name:"Cikarang Line Loop", color:"#00A2E9", sw:8,
          lines:["Jatinegara","Pondok Jati","Kramat","Gang Sentiong","Pasar Senen","Kemayoran","Rajawali","Kampung Bandan","Angke","Duri","Tanah Abang","Karet","Sudirman","Manggarai","Matraman","Jatinegara"] },

        { name:"Rangkasbitung Line", color:"#8CC63F", sw:8,
          lines:["Tanah Abang","Palmerah","Kebayoran","Pondok Ranji","Jurang Mangu","Sudimara","Rawa Buntu","Serpong","Cisauk","Cicayur","Jatake","Parung Panjang","Parayasa","Cilejit","Daru","Tenjo","Tigaraksa","Cikoya","Maja","Citeras","Rangkasbitung"] },

        { name:"Merak Line", color:"#1A237E", sw:7,
          lines:["Rangkasbitung","Catang","Walantaka","Karangantu","Cilegon","Merak"] },

        { name:"Tangerang Line", color:"#F37021", sw:8,
          lines:["Duri","Grogol","Pesing","Taman Kota","Bojong Indah","Rawa Buaya","Kali Deres","Poris","Batu Ceper","Tanah Tinggi","Tangerang"] },

        { name:"Tanjung Priok Line", color:"#EA68A2", sw:7,
          lines:["Jakarta Kota","Kampung Bandan","Ancol","JIS","Tanjung Priok"] },

        { name:"Bandara Line", color:"#28166F", sw:5, strokeDash:"10,6",
          lines:["Manggarai","BNI City","Tanah Abang","Duri","Batu Ceper","T1","T2","T3","Bandara Soekarno-Hatta"] },

        // --- JOGJA ---
        { name:"KRL Jogja-Solo", color:"#E2211C", sw:8, region:'jogja',
          lines:["Yogyakarta","Lempuyangan","Maguwo","Brambanan","Srowot","Klaten","Ceper","Delanggu","Gawok","Purwosari","Solo Balapan","Solo Jebres","Palur"] },
        { name:"Prameks Yogya-Kutoarjo", color:"#00A2E9", sw:7, region:'jogja',
          lines:["Yogyakarta","Wates","Wojo","Jenar","Kutoarjo"] },

        // --- BANDUNG ---
        { name:"KRL Bandung Raya", color:"#E2211C", sw:8, region:'bandung',
          lines:["Padalarang","Gadobangkong","Cimahi","Cimindi","Andir","Ciroyom","Bandung","Cikudapateuh","Kiaracondong","Haurpugur","Rancaekek","Cicalengka"] },
        { name:"Rancaekek-Tanjungsari", color:"#8CC63F", sw:6, region:'bandung',
          lines:["Rancaekek","Haurpugur Selatan","Tanjungsari"] },

        // --- SURABAYA ---
        { name:"KRL Surabaya-Porong", color:"#E2211C", sw:8, region:'surabaya',
          lines:["Surabaya Kota","Surabaya Gubeng","Wonokromo","Ngagel","Margorejo","Sawotratap","Gedangan","Sidoarjo","Tanggulangin","Porong"] },
        { name:"Surabaya-Lamongan", color:"#00A2E9", sw:7, region:'surabaya',
          lines:["Surabaya Kota","Benowo","Kandangan","Cerme","Duduk Sampeyan","Lamongan"] },
        { name:"Gubeng-Pasuruan", color:"#8CC63F", sw:7, region:'surabaya',
          lines:["Surabaya Gubeng","Waru","Bangil","Pasuruan"] },
    ];


    // ============================================================
    // DOM REFERENCES
    // ============================================================
    const confirmBtn           = document.getElementById('confirmLocationBtn');
    const selectedTextEl       = document.getElementById('selectedStationText');
    const selectedStationHidden= document.getElementById('selectedStation');

    const targetInputs = [
        'lostLocation','officerLostLocation','foundLocation','editReportLocation',
        'officerLostLocationFilter','officerEditLostLocation',
        'officerFoundLocationFilter','officerEditFoundLocation'
    ].map(id => document.getElementById(id)).filter(Boolean);

    let currentActiveInput = null;
    let selectedStationName = null;

    targetInputs.forEach(input => {
        input.setAttribute('readonly', 'readonly');
        input.style.cursor = 'pointer';
        input.dataset.bsToggle = 'modal';
        input.dataset.bsTarget = '#locationModal';
        input.addEventListener('click', () => { currentActiveInput = input; resetSelection(); });
    });

    function resetSelection() {
        selectedStationName = null;
        if (selectedStationHidden) selectedStationHidden.value = '';
        if (selectedTextEl) {
            selectedTextEl.textContent = 'Belum ada stasiun yang dipilih';
            selectedTextEl.classList.remove('text-success');
            selectedTextEl.classList.add('text-primary');
        }
        if (confirmBtn) confirmBtn.setAttribute('disabled', 'disabled');
        document.querySelectorAll('.station-node').forEach(n => n.classList.remove('active'));
    }


    // ============================================================
    // SVG RENDERER
    // ============================================================
    function createRouteSVG(region) {
        const svgns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgns, "svg");

        const viewBoxMap = {
            jabodetabek: '-30 20 1150 1850',
            jogja:       '120 210 1730 710',
            bandung:     '20 200 1570 440',
            surabaya:    '90 200 1060 820',
        };
        svg.setAttribute('viewBox', viewBoxMap[region] || '0 0 1200 1800');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.userSelect = 'none';

        const isJabo = (region === 'jabodetabek');
        const localRoutes = routes.filter(r => r.region ? r.region === region : isJabo);
        const localStations = Object.entries(stations).filter(([_, d]) =>
            d.region ? d.region === region : (isJabo && !d.jogja)
        );

        // 1. Draw route paths
        localRoutes.forEach(route => {
            if (route.lines.length < 2) return;
            const path = document.createElementNS(svgns, 'path');
            let d = '';
            for (let i = 0; i < route.lines.length; i++) {
                const st = stations[route.lines[i]];
                if (!st) continue;
                d += (i === 0 ? `M ${st.x} ${st.y} ` : `L ${st.x} ${st.y} `);
            }
            path.setAttribute('d', d);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', route.color);
            path.setAttribute('stroke-width', String(route.sw || 8));
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            if (route.strokeDash) path.setAttribute('stroke-dasharray', route.strokeDash);
            svg.appendChild(path);
        });

        // 2. Draw station nodes
        localStations.forEach(([name, data]) => {
            // Skip invisible waypoints — they're only for path routing
            if (data.isWaypoint) return;

            const g = document.createElementNS(svgns, 'g');
            g.setAttribute('class', 'station-node');
            g.setAttribute('transform', `translate(${data.x}, ${data.y})`);
            g.dataset.stationName = name;

            const circle = document.createElementNS(svgns, 'circle');
            circle.setAttribute('r', data.isHub ? '10' : (data.isTerminus ? '9' : '6'));
            circle.setAttribute('fill', '#ffffff');
            circle.setAttribute('stroke', '#111');
            circle.setAttribute('stroke-width', data.isHub ? '3.5' : '2.5');

            // Label positioning
            const pos = data.labelPos || 'right';
            let tx = 0, ty = 0, anchor = 'start';
            const gap = data.isHub ? 18 : 14;
            switch (pos) {
                case 'right':     tx = gap;  ty = 5;      anchor = 'start';  break;
                case 'left':      tx = -gap; ty = 5;      anchor = 'end';    break;
                case 'top':       tx = 0;    ty = -(gap);  anchor = 'middle'; break;
                case 'bottom':    tx = 0;    ty = gap+10;  anchor = 'middle'; break;
                case 'top-left':  tx = -gap; ty = -gap;    anchor = 'end';    break;
                case 'top-right': tx = gap;  ty = -gap;    anchor = 'start';  break;
            }
            const fSize = data.isHub ? 13 : 10.5;
            const fWeight = data.isHub ? '700' : '400';

            // White halo behind text for contrast
            const halo = document.createElementNS(svgns, 'text');
            halo.setAttribute('class', 'station-label station-halo');
            halo.textContent = name;
            halo.setAttribute('x', tx); halo.setAttribute('y', ty);
            halo.setAttribute('text-anchor', anchor);
            halo.setAttribute('font-family', "'Inter','Segoe UI',system-ui,sans-serif");
            halo.setAttribute('font-size', fSize + 'px');
            halo.setAttribute('font-weight', fWeight);
            halo.setAttribute('fill', 'white');
            halo.setAttribute('stroke', 'white');
            halo.setAttribute('stroke-width', '5');
            halo.setAttribute('stroke-linejoin', 'round');
            halo.setAttribute('paint-order', 'stroke');

            // Foreground text
            const text = document.createElementNS(svgns, 'text');
            text.setAttribute('class', 'station-label');
            text.textContent = name;
            text.setAttribute('x', tx); text.setAttribute('y', ty);
            text.setAttribute('text-anchor', anchor);
            text.setAttribute('font-family', "'Inter','Segoe UI',system-ui,sans-serif");
            text.setAttribute('font-size', fSize + 'px');
            text.setAttribute('font-weight', fWeight);
            text.setAttribute('fill', '#111');

            g.appendChild(circle);
            g.appendChild(halo);
            g.appendChild(text);

            g.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.station-node').forEach(n => n.classList.remove('active'));
                g.classList.add('active');
                selectedStationName = name;
                if (selectedStationHidden) selectedStationHidden.value = name;
                if (selectedTextEl) {
                    selectedTextEl.textContent = `Stasiun ${name}`;
                    selectedTextEl.classList.add('text-success');
                    selectedTextEl.classList.remove('text-primary');
                }
                if (confirmBtn) confirmBtn.removeAttribute('disabled');
            });
            g.addEventListener('touchend', (e) => { e.preventDefault(); g.click(); });
            svg.appendChild(g);
        });

        return svg;
    }


    // ============================================================
    // PANZOOM
    // ============================================================
    const containerIds = {
        jabodetabek:'panzoomJabodetabek', jogja:'panzoomJogja',
        bandung:'panzoomBandung', surabaya:'panzoomSurabaya',
    };
    const containers = {}, instances = {};

    Object.entries(containerIds).forEach(([region, id]) => {
        const el = document.getElementById(id);
        if (el) { containers[region] = el; el.appendChild(createRouteSVG(region)); }
    });

    if (typeof Panzoom !== 'undefined') {
        const opts = { maxScale: 15, minScale: 0.3, step: 0.15, contain: 'outside' };

        Object.entries(containers).forEach(([region, c]) => {
            const svgEl = c.querySelector('svg');
            if (!svgEl) return;
            instances[region] = Panzoom(svgEl, opts);
            c.parentElement.addEventListener('wheel', instances[region].zoomWithWheel);
        });

        // Initial zoom — Jabodetabek starts zoomed to upper-center area
        if (instances.jabodetabek) {
            setTimeout(() => {
                instances.jabodetabek.zoom(1.4, { animate: false });
                instances.jabodetabek.pan(-60, -100, { animate: false });
            }, 150);
        }

        const getActive = () => {
            for (const [r, inst] of Object.entries(instances)) {
                const tab = document.getElementById(r);
                if (tab && tab.classList.contains('active')) return { region: r, inst };
            }
            return { region: 'jabodetabek', inst: instances.jabodetabek };
        };

        const zoomIn  = document.getElementById('zoomInBtn');
        const zoomOut = document.getElementById('zoomOutBtn');
        const resetZ  = document.getElementById('resetZoomBtn');
        if (zoomIn)  zoomIn.addEventListener('click',  () => { const a = getActive(); if (a.inst) a.inst.zoomIn(); });
        if (zoomOut) zoomOut.addEventListener('click', () => { const a = getActive(); if (a.inst) a.inst.zoomOut(); });
        if (resetZ)  resetZ.addEventListener('click',  () => {
            const a = getActive();
            if (a.inst) {
                a.inst.reset({ animate: true });
                if (a.region === 'jabodetabek') {
                    setTimeout(() => { a.inst.zoom(1.4, {animate:true}); a.inst.pan(-60,-100,{animate:true}); }, 200);
                }
            }
        });

        document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(btn => {
            btn.addEventListener('shown.bs.tab', (e) => {
                const tid = e.target.getAttribute('data-bs-target').substring(1);
                if (instances[tid]) {
                    instances[tid].reset({ animate: false });
                    if (tid === 'jabodetabek') {
                        setTimeout(() => { instances[tid].zoom(1.4,{animate:false}); instances[tid].pan(-60,-100,{animate:false}); }, 100);
                    }
                }
            });
        });
    }


    // ============================================================
    // CONFIRM BUTTON
    // ============================================================
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (currentActiveInput && selectedStationName) {
                currentActiveInput.value = `Stasiun ${selectedStationName}`;
                const modalEl = document.getElementById('locationModal');
                const mi = bootstrap.Modal.getInstance(modalEl);
                if (mi) mi.hide();
            }
        });
    }
});
