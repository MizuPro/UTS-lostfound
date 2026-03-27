// assets/js/krl-location.js
document.addEventListener('DOMContentLoaded', () => {
    // Data Rute dan Stasiun KRL di Indonesia
    const krlData = [
        {
            route: "Bogor Line (Jakarta Kota - Bogor/Nambo)",
            stations: [
                "Jakarta Kota", "Jayakarta", "Mangga Besar", "Sawah Besar", "Juanda", 
                "Gondangdia", "Cikini", "Manggarai", "Tebet", "Cawang", "Duren Kalibata", 
                "Pasar Minggu Baru", "Pasar Minggu", "Tanjung Barat", "Lenteng Agung", 
                "Universitas Pancasila", "Universitas Indonesia", "Pondok Cina", "Depok Baru", 
                "Depok", "Citayam", "Bojong Gede", "Cilebut", "Bogor", "Pondok Rajeg", "Cibinong", "Gunung Putri", "Nambo"
            ]
        },
        {
            route: "Cikarang Line (Cikarang - Jatinegara/Manggarai/Senen)",
            stations: [
                "Cikarang", "Metland Telagamurni", "Cibitung", "Tambun", "Bekasi Timur", 
                "Bekasi", "Kranji", "Cakung", "Klender Baru", "Buaran", "Klender", 
                "Jatinegara", "Matraman", "Manggarai", "Sudirman", "Sudirman Baru (BNI City)", 
                "Karet", "Tanah Abang", "Duri", "Angke", "Kampung Bandan", "Rajawali", "Kemayoran", "Pasar Senen", "Gang Sentiong", "Kramat", "Pondok Jati"
            ]
        },
        {
            route: "Rangkasbitung Line (Tanah Abang - Rangkasbitung)",
            stations: [
                "Tanah Abang", "Palmerah", "Kebayoran", "Pondok Ranji", "Jurangmangu", 
                "Sudimara", "Rawa Buntu", "Serpong", "Cisauk", "Cicayur", "Parung Panjang", 
                "Cilejit", "Daru", "Tenjo", "Tigaraksa", "Cikoya", "Maja", "Citeras", "Rangkasbitung"
            ]
        },
        {
            route: "Tangerang Line (Duri - Tangerang)",
            stations: [
                "Duri", "Grogol", "Pesing", "Taman Kota", "Bojong Indah", 
                "Rawa Buaya", "Kalideres", "Poris", "Batu Ceper", "Tanah Tinggi", "Tangerang"
            ]
        },
        {
            route: "Tanjung Priok Line (Jakarta Kota - Tanjung Priok)",
            stations: ["Jakarta Kota", "Kampung Bandan", "Ancol", "JIS", "Tanjung Priok"]
        },
        {
            route: "Yogyakarta Line (KRL Jogja-Solo-Palur)",
            stations: [
                "Yogyakarta", "Lempuyangan", "Maguwo", "Brambanan", "Srowot", 
                "Klaten", "Ceper", "Delanggu", "Gawok", "Purwosari", "Solo Balapan", "Solo Jebres", "Palur"
            ]
        },
        {
            route: "Prambanan Ekspres / Prameks",
            stations: ["Yogyakarta", "Wates", "Wojo", "Jenar", "Kutoarjo"]
        }
    ];

    const routeSelect = document.getElementById('routeSelect');
    const stationGroup = document.getElementById('stationGroup');
    const stationGrid = document.getElementById('stationGrid');
    const selectedStationInput = document.getElementById('selectedStation');
    const platformGroup = document.getElementById('platformGroup');
    const platformSelect = document.getElementById('platformSelect');
    const confirmBtn = document.getElementById('confirmLocationBtn');

    // Attach to inputs that need this modal
    // We target inputs in pelapor report, officer report lost, and officer report found
    // Also include edits and filters to make it completely consistent
    const targetInputs = [
        document.getElementById('lostLocation'),
        document.getElementById('officerLostLocation'),
        document.getElementById('foundLocation'),
        document.getElementById('editReportLocation'),
        document.getElementById('officerLostLocationFilter'),
        document.getElementById('officerEditLostLocation'),
        document.getElementById('officerFoundLocationFilter'),
        document.getElementById('officerEditFoundLocation')
    ].filter(el => el !== null);

    let currentActiveInput = null;

    targetInputs.forEach(input => {
        if (input) {
            input.setAttribute('readonly', 'readonly');
            input.style.cursor = 'pointer';
            input.dataset.bsToggle = 'modal';
            input.dataset.bsTarget = '#locationModal';
            
            input.addEventListener('click', () => {
                currentActiveInput = input;
            });
        }
    });

    if (routeSelect) {
        // Populate Routes
        krlData.forEach((data, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = data.route;
            routeSelect.appendChild(option);
        });

        // Event: Route Changed
        routeSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            stationGrid.innerHTML = '';
            selectedStationInput.value = '';
            platformSelect.value = '';
            platformGroup.classList.add('hidden');
            checkConfirmButton();

            if (val === '') {
                stationGroup.classList.add('hidden');
                return;
            }

            stationGroup.classList.remove('hidden');
            const stations = krlData[val].stations;
            
            stations.forEach(station => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'station-btn';
                btn.textContent = station;
                btn.addEventListener('click', () => {
                    // Remove active from all
                    document.querySelectorAll('.station-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    selectedStationInput.value = station;
                    
                    // Show platform select
                    platformGroup.classList.remove('hidden');
                    checkConfirmButton();
                });
                stationGrid.appendChild(btn);
            });
        });

        // Event: Platform Changed
        platformSelect.addEventListener('change', () => {
            checkConfirmButton();
        });

        function checkConfirmButton() {
            if (selectedStationInput.value !== '' && platformSelect.value !== '') {
                confirmBtn.removeAttribute('disabled');
            } else {
                confirmBtn.setAttribute('disabled', 'disabled');
            }
        }

        // Event: Confirm
        confirmBtn.addEventListener('click', () => {
            if (currentActiveInput) {
                const finalStr = `Stasiun ${selectedStationInput.value}, ${platformSelect.value}`;
                currentActiveInput.value = finalStr;
                
                // Hide modal (Bootstrap 5 way using data api)
                const modalEl = document.getElementById('locationModal');
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        });
    }
});
