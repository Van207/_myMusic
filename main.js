

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const player = $('.player');
const progress = $('#progress')
const nextbtn = $('.btn-next')
const prevbtn = $('.btn-prev')
const randombtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const volUpBtn = $('.btn-volume-up')
const volDownBtn = $('.btn-volume-down')
const volumeRange = $('.volume-range')
const volumeControl = $('.volume-control')


const PLAYER_STORAGE_KEY = "MUSIC_PLAYER"

const app = {
    currenIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Có Chắc Yêu Là Đây',
            singer: 'Sơn Tùng M-TP',
            path: './assets/song/CCYLD.mp3',
            image: './assets/img/CCYLD.jpg',
        },
        {
            name: 'Hãy Trao Cho Anh',
            singer: 'Sơn Tùng M-TP ft. Snoop Dogg ',
            path: './assets/song/HTCA.mp3',
            image: './assets/img/HTCA.jpg',
        },
        {
            name: 'Lạc Trôi',
            singer: 'Sơn Tùng M-TP',
            path: './assets/song/LacTroi.mp3',
            image: './assets/img/LacTroi.jpg',
        },
        {
            name: 'Khuê Mộc Lang',
            singer: 'Hương Ly & Jombie (G5R)',
            path: './assets/song/KML.mp3',
            image: './assets/img/KML.jpg',
        },
        {
            name: 'Suýt Nữa Thì',
            singer: 'Andiez x Biti\'s Hunter',
            path: './assets/song/SuytNuaThi.mp3',
            image: './assets/img/snt.jpg',
        },
        {
            name: 'Rồi Tới Luôn',
            singer: 'Nguyễn Đình Vũ',
            path: './assets/song/RoiToiLuon.mp3',
            image: './assets/img/RoiToiLuon.jpg',
        },
        {
            name: 'Yêu Em Rất Nhiều',
            singer: 'Hoàng Tôn',
            path: './assets/song/yern.mp3',
            image: './assets/img/yern.jpg',
        },
        {
            name: 'Tháng Năm',
            singer: 'SOOBIN x SLIMV',
            path: './assets/song/ThangNam.mp3',
            image: './assets/img/ThangNam.jpg',
        },
        {
            name: 'I DO',
            singer: '911',
            path: './assets/song/IDo911.mp3',
            image: './assets/img/911.jpg',
        },
        {
            name: 'MY LOVE',
            singer: 'Westlife',
            path: './assets/song/MyLove.mp3',
            image: './assets/img/mylove.jpg',
        },
        
    ],
    
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currenIndex ? 'active' : ''}" data-index = ${index}>
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <div id="wave-song" class="${index === this.currenIndex ? 'wave-song-active' : ''}">  
                            <span></span>  
                            <span></span>  
                            <span></span>  
                            <span></span>  
                            <span></span>  
                        </div>
                    </div>
                </div>
            `
        })
        
        playlist.innerHTML = htmls.join("");
    },
    

    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currenIndex]
            }
        })
    },
    // xử lý sự kiện
    handlEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //Xử lý cd quay
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        
        // xử lý phóng to thu nhỏ cd khi scroll
        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi play btn 
        playBtn.onclick = function() {
            if(_this.isPlaying == true){
                audio.pause();
            }
            else{
                audio.play();
            }
        }

        // khi song play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play();
        }

        // khi song pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause();
        }

        // Tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent
            }
        }

        // xử lý khi tua
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime;
        }

        // Khi next
        nextbtn.onclick = function () {
            // Khi random gọi lại hàm playRandom, ngượi lại gọi hàm nextSong
            if(_this.isRandom){
                _this.playRandom();
            } 
            else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi prev
        prevbtn.onclick = function () {
            if(_this.isRandom){
                _this.playRandom();
            } 
            else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi random song
        randombtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randombtn.classList.toggle("active", _this.isRandom);
        }

        // Xử lý lặp lại song
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Next khi audio kết thúc
        audio.onended = function () {
            // Nếu repeat bật thì lặp lại bài
            if(_this.isRepeat) {
                audio.play();
            }
            else {
                nextbtn.click();
            }
        }

        // Lắng nghe khi click vào playlist
        playlist.onclick = function(e) {
            const songNotActive = e.target.closest('.song:not(.active)');
            if( songNotActive || e.target.closest('.option')) {
                
                // Khi click vào song ko phát (not(.active))
                if(songNotActive) {
                    _this.currenIndex = Number(songNotActive.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }

        // Khi giảm âm lượng
        volDownBtn.onclick = function () {
            if(audio.volume < 0.1){
                alert("Hiện đăng tắt tiếng")
            }
            else {
                audio.volume -= 0.1;
            }
        }

        // Khi volume up 
        volUpBtn.onclick = function () { 
            if(audio.volume >= 1){
                alert("Đạt mức âm thanh cao nhất của trang web!!\nĐể tăng âm thanh vui lòng tăng âm thanh thiết bị!")
            }
            else {
                audio.volume = audio.volume + 0.1;
            }
        }
        
        
    },


    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 100)
    },

    changeVolume: function() {
        audio.onvolumechange = function () {
            volumeRange.style.display = "block";
            setTimeout(function () {
                volumeRange.style.display = "none";
            }, 2000)
            volumeControl.value = audio.volume;
        }

        volumeControl.onchange = function () {
            audio.volume = volumeControl.value;
        }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },

    nextSong: function() {
        this.currenIndex++
        if (this.currenIndex >= this.songs.length) {
            this.currenIndex = 0
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currenIndex--
        if (this.currenIndex < 0) {
            this.currenIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
    },

    playRandom: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currenIndex)
        
        this.currenIndex = newIndex
        this.loadCurrentSong();
    },

    start: function(){
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

//      định nghĩa thuộc tính cho object
        this.defineProperties();
        this.changeVolume();
        // Sử lý sự kiện
        this.handlEvents();
        //Tải thông tin bài hát đầu tiên vào UI khi chạy
        this.loadCurrentSong();
        // Render bài hát
        this.render();

        // Hiển thị trạng thái ban đầu của repeat, random
        randombtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
}
app.start();
