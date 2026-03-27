<!-- partials/modal-location.php -->
<div class="modal fade" id="locationModal" tabindex="-1" aria-labelledby="locationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-fullscreen-md-down" style="max-width: 95vw;">
        <div class="modal-content custom-modal-content">
            <div class="modal-header custom-modal-header d-flex justify-content-between align-items-center">
                <h5 class="modal-title m-0" id="locationModalLabel">
                    <span style="font-size:20px;margin-right:6px;">🗺️</span> Peta Rute KRL Interaktif
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <div class="modal-tabs border-bottom px-4 pt-3">
                <ul class="nav nav-tabs border-0 flex-nowrap overflow-auto" id="krlMapTabs" role="tablist" style="white-space:nowrap;">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active fw-semibold" id="jabodetabek-tab" data-bs-toggle="tab" data-bs-target="#jabodetabek" type="button" role="tab">Jabodetabek & Merak</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link fw-semibold" id="jogja-tab" data-bs-toggle="tab" data-bs-target="#jogja" type="button" role="tab">Jogja - Solo</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link fw-semibold" id="bandung-tab" data-bs-toggle="tab" data-bs-target="#bandung" type="button" role="tab">Bandung Raya</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link fw-semibold" id="surabaya-tab" data-bs-toggle="tab" data-bs-target="#surabaya" type="button" role="tab">Surabaya & Jatim</button>
                    </li>
                </ul>
            </div>

            <div class="modal-body custom-modal-body p-0 position-relative" style="height: 80vh; min-height: 550px; background: linear-gradient(135deg, #fafbfc 0%, #f0f2f5 100%); overflow: hidden;" id="krlMapBody">
                <!-- Map Controls -->
                <div class="map-controls position-absolute z-3 d-flex flex-column gap-2" style="left: 16px; top: 16px;">
                    <button type="button" class="btn btn-light shadow-sm border rounded-circle d-flex align-items-center justify-content-center" id="zoomInBtn" title="Zoom In" style="width:38px;height:38px;font-size:18px;">+</button>
                    <button type="button" class="btn btn-light shadow-sm border rounded-circle d-flex align-items-center justify-content-center" id="zoomOutBtn" title="Zoom Out" style="width:38px;height:38px;font-size:18px;">−</button>
                    <button type="button" class="btn btn-light shadow-sm border rounded-circle d-flex align-items-center justify-content-center" id="resetZoomBtn" title="Reset View" style="width:38px;height:38px;font-size:14px;">↻</button>
                </div>
                

                <!-- Map hint -->
                <div class="position-absolute z-3 text-muted d-flex align-items-center gap-1" style="bottom: 16px; right: 16px; font-size: 11px; background: rgba(255,255,255,0.85); padding: 6px 12px; border-radius: 8px; backdrop-filter: blur(4px);">
                    Scroll zoom · Drag untuk geser · Klik stasiun untuk memilih
                </div>

                <div class="tab-content h-100" id="krlMapTabContent">
                    <!-- JABODETABEK -->
                    <div class="tab-pane fade show active h-100 position-relative" id="jabodetabek" role="tabpanel">
                        <div class="map-legend position-absolute bg-white bg-opacity-95 p-3 shadow-sm border rounded-3 z-3" style="top: 16px; right: 16px; font-size: 11px; backdrop-filter: blur(8px);">
                            <div class="fw-bold mb-2" style="font-size:12px;">Petunjuk Jalur</div>
                            <div class="d-flex align-items-center gap-2 mb-1"><span class="rounded-circle d-inline-block" style="background:#E2211C;width:10px;height:10px;min-width:10px;"></span> Bogor</div>
                            <div class="d-flex align-items-center gap-2 mb-1"><span class="rounded-circle d-inline-block" style="background:#00A2E9;width:10px;height:10px;min-width:10px;"></span> Cikarang</div>
                            <div class="d-flex align-items-center gap-2 mb-1"><span class="rounded-circle d-inline-block" style="background:#8CC63F;width:10px;height:10px;min-width:10px;"></span> Rangkasbitung</div>
                            <div class="d-flex align-items-center gap-2 mb-1"><span class="rounded-circle d-inline-block" style="background:#1A237E;width:10px;height:10px;min-width:10px;"></span> Merak</div>
                            <div class="d-flex align-items-center gap-2 mb-1"><span class="rounded-circle d-inline-block" style="background:#F37021;width:10px;height:10px;min-width:10px;"></span> Tangerang</div>
                            <div class="d-flex align-items-center gap-2 mb-1"><span class="rounded-circle d-inline-block" style="background:#EA68A2;width:10px;height:10px;min-width:10px;"></span> Tanjung Priok</div>
                            <div class="d-flex align-items-center gap-2"><span class="d-inline-block rounded-circle" style="border:2px dashed #28166F;width:10px;height:10px;min-width:10px;"></span> Bandara Soetta</div>
                        </div>
                        <div id="panzoomJabodetabek" class="h-100 w-100" style="cursor: grab;"></div>
                    </div>

                    <!-- JOGJA-SOLO -->
                    <div class="tab-pane fade h-100 position-relative" id="jogja" role="tabpanel">
                        <div class="map-legend position-absolute bg-white bg-opacity-95 p-3 shadow-sm border rounded-3 z-3" style="top: 16px; right: 16px; font-size: 11px; backdrop-filter: blur(8px);">
                            <div class="fw-bold mb-2" style="font-size:12px;">Petunjuk Jalur</div>
                            <div class="d-flex align-items-center gap-2 mb-1"><span class="rounded-circle d-inline-block" style="background:#E2211C;width:10px;height:10px;min-width:10px;"></span> KRL Jogja - Solo</div>
                            <div class="d-flex align-items-center gap-2"><span class="rounded-circle d-inline-block" style="background:#00A2E9;width:10px;height:10px;min-width:10px;"></span> Prameks Yogya - Kutoarjo</div>
                        </div>
                        <div id="panzoomJogja" class="h-100 w-100" style="cursor: grab;"></div>
                    </div>

                    <!-- BANDUNG RAYA -->
                    <div class="tab-pane fade h-100 position-relative" id="bandung" role="tabpanel">
                        <div class="map-legend position-absolute bg-white bg-opacity-95 p-3 shadow-sm border rounded-3 z-3" style="top: 16px; right: 16px; font-size: 11px; backdrop-filter: blur(8px);">
                            <div class="fw-bold mb-2" style="font-size:12px;">Petunjuk Jalur</div>
                            <div class="d-flex align-items-center gap-2 mb-1"><span class="rounded-circle d-inline-block" style="background:#E2211C;width:10px;height:10px;min-width:10px;"></span> KRL Bandung Raya</div>
                            <div class="d-flex align-items-center gap-2"><span class="rounded-circle d-inline-block" style="background:#8CC63F;width:10px;height:10px;min-width:10px;"></span> Rancaekek - Tanjungsari</div>
                        </div>
                        <div id="panzoomBandung" class="h-100 w-100" style="cursor: grab;"></div>
                    </div>

                    <!-- SURABAYA & JATIM -->
                    <div class="tab-pane fade h-100 position-relative" id="surabaya" role="tabpanel">
                        <div class="map-legend position-absolute bg-white bg-opacity-95 p-3 shadow-sm border rounded-3 z-3" style="top: 16px; right: 16px; font-size: 11px; backdrop-filter: blur(8px);">
                            <div class="fw-bold mb-2" style="font-size:12px;">Petunjuk Jalur</div>
                            <div class="d-flex align-items-center gap-2 mb-1"><span class="rounded-circle d-inline-block" style="background:#E2211C;width:10px;height:10px;min-width:10px;"></span> KRL Surabaya - Porong</div>
                            <div class="d-flex align-items-center gap-2 mb-1"><span class="rounded-circle d-inline-block" style="background:#00A2E9;width:10px;height:10px;min-width:10px;"></span> Surabaya - Lamongan</div>
                            <div class="d-flex align-items-center gap-2"><span class="rounded-circle d-inline-block" style="background:#8CC63F;width:10px;height:10px;min-width:10px;"></span> Gubeng - Pasuruan</div>
                        </div>
                        <div id="panzoomSurabaya" class="h-100 w-100" style="cursor: grab;"></div>
                    </div>
                </div>
            </div>

            <div class="modal-footer custom-modal-footer d-flex justify-content-between align-items-center flex-wrap">
                <div class="selected-station-info mb-2 mb-md-0">
                    <span class="text-muted small d-block">Stasiun Terpilih:</span>
                    <strong id="selectedStationText" class="text-primary fs-5">Belum ada stasiun yang dipilih</strong>
                    <input type="hidden" id="selectedStation" value="">
                </div>
                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-outline-secondary px-4 rounded-pill" data-bs-dismiss="modal">Batal</button>
                    <button type="button" class="btn btn-primary px-4 rounded-pill" id="confirmLocationBtn" disabled>Konfirmasi Lokasi</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@panzoom/panzoom/dist/panzoom.min.js"></script>

<style>
/* Modal Sizing — near fullscreen for maximum map space */
#locationModal .modal-dialog {
    max-width: 95vw;
    width: 95vw;
    margin: 1.5rem auto;
}
@media (max-width: 768px) {
    #locationModal .modal-dialog {
        max-width: 100vw;
        width: 100vw;
        margin: 0;
    }
}

.custom-modal-content {
    border-radius: var(--radius-lg, 22px);
    border: 1px solid rgba(19, 19, 22, 0.1);
    background: var(--surface-2, #ffffff);
    box-shadow: var(--shadow, 0 18px 40px rgba(0,0,0,0.12));
    overflow: hidden;
}
.custom-modal-header {
    border-bottom: 1px solid rgba(19, 19, 22, 0.08);
    padding: 20px 24px;
}
.custom-modal-footer {
    border-top: 1px solid rgba(19, 19, 22, 0.08);
    padding: 20px 24px;
    background: #f8f9fa;
    border-bottom-left-radius: 22px;
    border-bottom-right-radius: 22px;
}

/* Tab Styling */
#krlMapTabs .nav-link {
    border: none;
    border-bottom: 3px solid transparent;
    padding: 8px 16px;
    font-size: 13px;
    color: #666;
    transition: all 0.2s;
}
#krlMapTabs .nav-link:hover {
    color: #222;
    background: rgba(0,0,0,0.03);
}
#krlMapTabs .nav-link.active {
    color: #111;
    border-bottom-color: #E2211C;
    background: transparent;
}

/* KRL Map Interactivity Styles */
.station-node {
    cursor: pointer;
    transition: all 0.15s ease;
}
.station-node:hover circle {
    stroke-width: 4.5px !important;
    filter: drop-shadow(0 0 8px rgba(0,0,0,0.3));
}
.station-node.active circle {
    stroke: #E2211C !important;
    stroke-width: 4.5px !important;
    fill: #ffc107 !important;
    filter: drop-shadow(0 0 12px rgba(255,193,7,0.7));
}
/* Only style foreground text on active, not the halo */
.station-node.active text.station-label:not(.station-halo) {
    font-weight: 800 !important;
    fill: #E2211C !important;
}
.station-label {
    user-select: none;
    pointer-events: none;
    transition: fill 0.15s ease;
}
/* Halo always stays white */
.station-halo {
    fill: white !important;
    stroke: white !important;
}

/* Panzoom container SVG fill */
#panzoomJabodetabek svg,
#panzoomJogja svg,
#panzoomBandung svg,
#panzoomSurabaya svg {
    width: 100%;
    height: 100%;
    display: block;
}
</style>

