document.addEventListener('DOMContentLoaded', function () {
    // 地図の初期設定
    const map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // ドラッグ＆ドロップエリアの設定
    const dropZone = document.getElementById('drop-zone');
    let gpxLayer; // GPXレイヤーを保持する変数

    dropZone.addEventListener('dragover', function (event) {
        event.preventDefault();
        dropZone.style.backgroundColor = '#f0f0f0';
    });

    dropZone.addEventListener('dragleave', function (event) {
        event.preventDefault();
        dropZone.style.backgroundColor = '#fff';
    });

    dropZone.addEventListener('drop', function (event) {
        event.preventDefault();
        dropZone.style.backgroundColor = '#fff';

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();

            reader.onload = function (e) {
                const gpxData = e.target.result;

                // 既存のGPXレイヤーを削除
                if (gpxLayer) {
                    map.removeLayer(gpxLayer);
                }

                gpxLayer = new L.GPX(gpxData, {
                    async: true,
                    marker_options: {
                        startIconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
                        endIconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
                        shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png'
                    }
                }).on('loaded', function (e) {
                    map.fitBounds(e.target.getBounds());

                    // 距離と累積標高を取得
                    const distance = gpxLayer.get_distance();
                    const elevation = gpxLayer.get_elevation_gain();

                    // 情報を表示
                    document.getElementById('distance').textContent = `Distance: ${(distance / 1000).toFixed(2)} km`;
                    document.getElementById('elevation').textContent = `Elevation Gain: ${elevation.toFixed(2)} m`;
                }).addTo(map);
            };

            reader.readAsText(file);
        }
    });

    // トラックを消すボタンの設定
    const clearButton = document.getElementById('clear-button');
    clearButton.addEventListener('click', function () {
        if (gpxLayer) {
            map.removeLayer(gpxLayer);
            gpxLayer = null; // GPXレイヤーをリセット

            // 情報をリセット
            document.getElementById('distance').textContent = 'Distance: N/A';
            document.getElementById('elevation').textContent = 'Elevation Gain: N/A';
        }
    });
});
