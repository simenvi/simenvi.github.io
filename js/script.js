document.addEventListener('DOMContentLoaded', () => {
    const slideViewer = document.getElementById('slide-viewer');
    const prevSlideBtn = document.getElementById('prev-slide');
    const nextSlideBtn = document.getElementById('next-slide');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const presentationAudio = document.getElementById('presentation-audio');
    const currentSlideInfo = document.getElementById('current-slide-info');
    const seekBar = document.getElementById('seek-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const volumeBar = document.getElementById('volume-bar');
    const fullscreenBtn = document.getElementById('fullscreen-btn'); // 獲取全螢幕按鈕
    const presentationContainer = document.querySelector('.presentation-container'); // 獲取簡報容器，這是我們要全螢幕的元素
    const toggleThumbnailsBtn = document.getElementById('toggle-thumbnails-btn'); // 獲取縮圖切換按鈕
    const thumbnailSidebar = document.getElementById('thumbnail-sidebar'); // 獲取縮圖側邊欄
    const thumbnailsContainer = document.getElementById('thumbnails-container'); // 獲取縮圖容器


    // 設定投影片總數和音訊檔案路徑
    // 請根據您的實際檔案命名和數量進行修改
    const totalSlides = pages; // 假設您有 ? 張投影片 (slide1.png 到 slide5.png)
    const slideImagePrefix = './slides/slide';
    const slideImageExtension = '.JPG';
    const audioPrefix = './audio/audio';
    const audioExtension = '.mp3';

    let currentSlideIndex = 1; // 從第一張投影片開始 (索引從 1 開始)
    let isPlaying = false;
    let currentVolume = volumeBar.value / 100; // 新增：初始化 currentVolume 為音量條的初始值

    // 格式化時間 (秒轉為分:秒)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // 更新播放按鈕的狀態
    function updatePlayButtonState(canPlay) {
        if (canPlay) {
            playPauseBtn.disabled = false;
            playPauseBtn.style.cursor = "pointer";
            let playstatus = isPlaying ? '暫停' : '播放';
            playPauseBtn.setAttribute('title', playstatus);
            playPauseBtn.innerHTML = isPlaying ? '<img src="../images/pause.svg" width="24" height="24">' : '<img src="../images/play.svg" width="24" height="24">';
        } else {
            playPauseBtn.disabled = true;
            playPauseBtn.style.cursor = "not-allowed";
            playPauseBtn.setAttribute('title','無音訊'); // 顯示無音訊或類似提示
            playPauseBtn.innerHTML = '<img src="../images/mute.svg" width="24" height="24">'; 
        }
    }

    // 更新縮圖的活躍狀態
    function updateActiveThumbnail() {
        // 移除所有縮圖的 active 類
        document.querySelectorAll('.thumbnail-item').forEach(item => {
            item.classList.remove('active');
        });
        // 為當前投影片的縮圖添加 active 類
        const activeThumbnail = document.querySelector(`.thumbnail-item[data-slide-index="${currentSlideIndex}"]`);
        if (activeThumbnail) {
            activeThumbnail.classList.add('active');
            // 滾動到當前活躍的縮圖，確保它可見
            activeThumbnail.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // 載入指定索引的投影片和音訊
    function loadSlide(index) {
        if (index < 1 || index > totalSlides) {
            return; // 超出範圍則不動作
        }

        currentSlideIndex = index;

        // 載入投影片圖片
        slideViewer.innerHTML = `<img src="${slideImagePrefix}${currentSlideIndex}${slideImageExtension}" alt="Slide ${currentSlideIndex}">`;

        // 載入對應的音訊檔案
        presentationAudio.src = `${audioPrefix}${currentSlideIndex}${audioExtension}`;
        presentationAudio.load(); // 重新載入音訊
        
        // 更新投影片資訊
        currentSlideInfo.textContent = `第 ${currentSlideIndex} / ${totalSlides} 頁`;

        // 更新縮圖活躍狀態
        updateActiveThumbnail();

        // 每次切換投影片時重置播放狀態
        playPauseBtn.setAttribute('title', '播放');
        playPauseBtn.innerHTML = '<img src="../images/play.svg" width="24" height="24">';        

        // 應用儲存的音量值
        presentationAudio.volume = currentVolume; // 關鍵更改：將儲存的音量應用到當前音訊
        volumeBar.value = currentVolume * 100; // 更新音量條的顯示值

        isPlaying = false;
        seekBar.value = 0;
        currentTimeSpan.textContent = '0:00';
        durationSpan.textContent = '0:00';
        
        // 預設將播放按鈕禁用，等待音訊載入結果
        updatePlayButtonState(false); 

        // --- 新增的自動播放邏輯 ---
        // 嘗試播放音訊。如果音訊載入成功（loadedmetadata），它會自動播放
        // 如果載入失敗（error），它會被禁用
        presentationAudio.play() .then(() => {
                // 自動播放成功
                isPlaying = true;
                updatePlayButtonState(true); // 啟用按鈕並更新為「暫停」
        }).catch(e => {
                // 自動播放被阻止或音訊不存在/載入失敗
                console.log(`嘗試自動播放音訊 ${presentationAudio.src} 失敗:`, e);
                isPlaying = false; // 確保播放狀態為 false
                updatePlayButtonState(false); // 禁用按鈕
         });
        // --- 結束新增的自動播放邏輯 ---
    }

    // 播放/暫停音訊
    function togglePlayPause() {
        if (presentationAudio.paused || presentationAudio.ended) {
            presentationAudio.play().catch(e => {
                console.log("播放音訊失敗:", e);
                // 如果自動播放被阻止，可以考慮給用戶提示
            });            
            playPauseBtn.setAttribute('title', '暫停');
            playPauseBtn.innerHTML = '<img src="../images/pause.svg" width="24" height="24">';
            isPlaying = true;
        } else {
            presentationAudio.pause();
            playPauseBtn.setAttribute('title', '播放');
            playPauseBtn.innerHTML = '<img src="../images/play.svg" width="24" height="24">';
            isPlaying = false;
        }
    }

    // 監聽音訊載入完成事件，更新總時長
    presentationAudio.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(presentationAudio.duration);
        seekBar.max = presentationAudio.duration;
        
        // 如果已經在播放中（自動播放成功），則保持按鈕啟用狀態
        // 如果還沒有播放（例如被瀏覽器阻止），則仍需使用者手動點擊
        // 但此處主要負責確保按鈕可用，實際播放狀態由 play() 或 pause() 決定
        if (!isPlaying) { // 只有在不是自動播放成功的情況下，才需要啟用按鈕
            updatePlayButtonState(true);
        }
    });

    // 監聽音訊載入錯誤事件 (例如檔案不存在或損壞)
    presentationAudio.addEventListener('error', (e) => {
        // 捕獲並處理錯誤，避免在控制台顯示為未捕獲的錯誤
        let errorMessage = "未知音訊錯誤";
        if (presentationAudio.error) {
            switch (presentationAudio.error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                    errorMessage = "音訊載入中止。";
                    break;
                case MediaError.MEDIA_ERR_NETWORK:
                    errorMessage = "網路錯誤導致音訊載入失敗。";
                    break;
                case MediaError.MEDIA_ERR_DECODE:
                    errorMessage = "音訊解碼錯誤。";
                    break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorMessage = "音訊源不受支援或檔案不存在 (404)。";
                    break;
                default:
                    errorMessage = "未定義的音訊錯誤。";
                    break;
            }
        }
        console.log(`音訊載入錯誤 for ${presentationAudio.src}: ${errorMessage}`, e);
        
        // **核心改動：音訊載入失敗，明確禁用播放按鈕**
        isPlaying = false; // 確保播放狀態為 false
        updatePlayButtonState(false);
        durationSpan.textContent = '0:00'; // 清空時長顯示
        seekBar.max = 0; // 重置進度條最大值
    });

    // 監聽音訊播放進度更新
    presentationAudio.addEventListener('timeupdate', () => {
        seekBar.value = presentationAudio.currentTime;
        currentTimeSpan.textContent = formatTime(presentationAudio.currentTime);
    });

    // 監聽音訊播放結束
    presentationAudio.addEventListener('ended', () => {
        isPlaying = false;
        playPauseBtn.setAttribute('title', '播放');
        playPauseBtn.innerHTML = '<img src="../images/play.svg" width="24" height="24">';
        seekBar.value = 0;
        currentTimeSpan.textContent = '0:00';
    });

    // 拖動進度條
    seekBar.addEventListener('input', () => {
        presentationAudio.currentTime = seekBar.value;
    });

    // 調整音量
    volumeBar.addEventListener('input', () => {
        currentVolume = volumeBar.value / 100; // 關鍵更改：更新儲存的音量值
        presentationAudio.volume = currentVolume; // 將音量應用到當前播放的音訊
    });    

    // *** 新增的 JavaScript 邏輯 ***
    function updateVolumeBarColor() {
        // volumeBar.value 是 0-100
        const percentage = volumeBar.value;
        // 更新 CSS 變數 --volume-fill
        volumeBar.style.setProperty('--volume-fill', `${percentage}%`);
        
        if (percentage > 70) {            
            volumeBar.setAttribute('title', '注意：音量大小');
            volumeBar.classList.add('volume-high');
        } else {
            volumeBar.setAttribute('title', '音量大小');
            volumeBar.classList.remove('volume-high');
        }
    }

    // 監聽音量條的 'input' 事件（當值改變時即時觸發）
    volumeBar.addEventListener('input', updateVolumeBarColor);

    // 確保在初始化時也檢查一次音量條的顏色
    updateVolumeBarColor(); // 第一次載入時設定正確的顏色

    // 上一頁按鈕點擊事件
    prevSlideBtn.addEventListener('click', () => {
        if (currentSlideIndex > 1) {
            loadSlide(currentSlideIndex - 1);
        }
    });

    // 下一頁按鈕點擊事件
    nextSlideBtn.addEventListener('click', () => {
        if (currentSlideIndex < totalSlides) {
            loadSlide(currentSlideIndex + 1);
        }
    });

    // 播放/暫停按鈕點擊事件
    playPauseBtn.addEventListener('click', togglePlayPause);

    // --- 全螢幕功能 ---
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) { // 如果目前不是全螢幕模式
            // 嘗試讓 presentationContainer 進入全螢幕
            if (presentationContainer.requestFullscreen) {
                presentationContainer.requestFullscreen();
            } else if (presentationContainer.webkitRequestFullscreen) { /* Safari */
                presentationContainer.webkitRequestFullscreen();
            } else if (presentationContainer.msRequestFullscreen) { /* IE11 */
                presentationContainer.msRequestFullscreen();
            }
        } else { // 如果目前是全螢幕模式
            // 退出全螢幕
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        }
    });

    // 監聽全螢幕狀態變化 (使用者按 ESC 鍵也會觸發)
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<img src="../images/nonfullscreen.svg" width="24" height="24">';
            fullscreenBtn.setAttribute('title',"離開全螢幕");
        } else {
            fullscreenBtn.innerHTML  = '<img src="../images/fullscreen.svg" width="24" height="24">';
            fullscreenBtn.setAttribute('title',"全螢幕檢視");
        }
    });
    document.addEventListener('webkitfullscreenchange', () => { /* Safari */
        if (document.webkitFullscreenElement) {
            fullscreenBtn.innerHTML = '<img src="../images/nonfullscreen.svg" width="24" height="24">';
            fullscreenBtn.setAttribute('title',"離開全螢幕");
        } else {
            fullscreenBtn.innerHTML  = '<img src="../images/fullscreen.svg" width="24" height="24">';
            fullscreenBtn.setAttribute('title',"全螢幕檢視");
        }
    });
    document.addEventListener('msfullscreenchange', () => { /* IE11 */
        if (document.msFullscreenElement) {
            fullscreenBtn.innerHTML = '<img src="../images/nonfullscreen.svg" width="24" height="24">';
            fullscreenBtn.setAttribute('title',"離開全螢幕");
        } else {
            fullscreenBtn.innerHTML  = '<img src="../images/fullscreen.svg" width="24" height="24">';
            fullscreenBtn.setAttribute('title',"全螢幕檢視");
        }
    });
    // --- 全螢幕功能結束 ---

    // --- 縮圖預覽功能 ---
    function generateThumbnails() {
        for (let i = 1; i <= totalSlides; i++) {
            const thumbItem = document.createElement('div');
            thumbItem.classList.add('thumbnail-item');
            thumbItem.setAttribute('data-slide-index', i); // 儲存頁碼

            const img = document.createElement('img');
            img.src = `${slideImagePrefix}${i}${slideImageExtension}`;
            img.alt = `Slide ${i} Thumbnail`;

            const span = document.createElement('span');
            span.textContent = `第 ${i} 頁`;

            thumbItem.appendChild(img);
            thumbItem.appendChild(span);

            thumbItem.addEventListener('click', () => {
                loadSlide(i); // 點擊縮圖切換到該頁
                // 點擊後可以考慮自動關閉縮圖側邊欄 (可選)
                // toggleThumbnails();
            });
            thumbnailsContainer.appendChild(thumbItem);
        }
    }

    function toggleThumbnails() {
        thumbnailSidebar.classList.toggle('open');
        document.body.classList.toggle('thumbnails-open'); // 為了讓主容器移動
        if (thumbnailSidebar.classList.contains('open')) {            
            toggleThumbnailsBtn.setAttribute('title',"收合簡報瀏覽");
            toggleThumbnailsBtn.innerHTML = '<img src="../images/ppt-off.svg" width="24" height="24">';
            updateActiveThumbnail(); // 確保縮圖區塊打開時，當前頁的縮圖是活躍的
        } else {            
            toggleThumbnailsBtn.setAttribute('title',"展開簡報瀏覽");
            toggleThumbnailsBtn.innerHTML = '<img src="../images/ppt-on.svg" width="24" height="24">';
        }
    }

    toggleThumbnailsBtn.addEventListener('click', toggleThumbnails);

    // 初始化載入第一頁投影片
    loadSlide(currentSlideIndex);

    // 生成所有縮圖
    generateThumbnails();
});