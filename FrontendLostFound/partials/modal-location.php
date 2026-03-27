<!-- partials/modal-location.php -->
<div class="modal fade" id="locationModal" tabindex="-1" aria-labelledby="locationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal-content">
            <div class="modal-header custom-modal-header">
                <h5 class="modal-title" id="locationModalLabel">Pilih Lokasi Kehilangan</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body custom-modal-body">
                <!-- Tahap 1: Rute -->
                <div class="form-group mb-3">
                    <label for="routeSelect">Tahap 1: Pilih Rute KRL</label>
                    <select id="routeSelect" class="form-select custom-select">
                        <option value="">-- Pilih Rute --</option>
                    </select>
                </div>

                <!-- Tahap 2: Stasiun -->
                <div class="form-group mb-3 hidden" id="stationGroup">
                    <label>Tahap 2: Pilih Stasiun</label>
                    <div id="stationGrid" class="station-grid">
                        <!-- Rendered by JS -->
                    </div>
                    <input type="hidden" id="selectedStation" value="">
                </div>

                <!-- Tahap 3: Peron -->
                <div class="form-group mb-3 hidden" id="platformGroup">
                    <label for="platformSelect">Tahap 3: Pilih Peron/Area</label>
                    <select id="platformSelect" class="form-select custom-select">
                        <option value="">-- Pilih Peron/Area --</option>
                        <option value="Peron 1">Peron 1</option>
                        <option value="Peron 2">Peron 2</option>
                        <option value="Peron 3">Peron 3</option>
                        <option value="Peron 4">Peron 4</option>
                        <option value="Peron 5">Peron 5</option>
                        <option value="Peron 6">Peron 6</option>
                        <option value="Peron 7">Peron 7</option>
                        <option value="Peron 8">Peron 8</option>
                        <option value="Peron 9">Peron 9</option>
                        <option value="Peron 10">Peron 10</option>
                        <option value="Peron 11">Peron 11</option>
                        <option value="Peron 12">Peron 12</option>
                        <option value="Area Stasiun Lainnya">Area Stasiun Lainnya</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer custom-modal-footer">
                <button type="button" class="btn btn-outline" data-bs-dismiss="modal">Batal</button>
                <button type="button" class="btn btn-primary" id="confirmLocationBtn" disabled>Konfirmasi</button>
            </div>
        </div>
    </div>
</div>

<style>
.custom-modal-content {
    border-radius: var(--radius-lg, 22px);
    border: 1px solid rgba(19, 19, 22, 0.1);
    background: var(--surface-2, #ffffff);
    box-shadow: var(--shadow, 0 18px 40px rgba(0,0,0,0.12));
}
.custom-modal-header {
    border-bottom: 1px solid rgba(19, 19, 22, 0.08);
    padding: 20px 24px;
}
.custom-modal-body {
    padding: 24px;
}
.custom-modal-footer {
    border-top: 1px solid rgba(19, 19, 22, 0.08);
    padding: 20px 24px;
}
.custom-select {
    width: 100%;
    border: 1.6px solid rgba(19,19,22,0.22);
    border-radius: 12px;
    padding: 12px 16px;
    background: rgba(255,255,255,0.78);
}
.custom-select:focus {
    border-color: rgba(17,17,17,0.75);
    box-shadow: 0 0 0 4px rgba(17,17,17,0.08);
}
.station-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;
    padding-right: 8px;
}
.station-btn {
    padding: 8px 12px;
    border: 1px solid rgba(19, 19, 22, 0.15);
    border-radius: 8px;
    background: #fff;
    font-size: 13px;
    cursor: pointer;
    transition: 0.2s;
    text-align: center;
}
.station-btn:hover {
    background: rgba(17,17,17,0.05);
}
.station-btn.active {
    background: var(--primary, #111);
    color: #fff;
    border-color: var(--primary, #111);
}
</style>
