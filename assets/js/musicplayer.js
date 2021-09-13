const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const repeatBtn = $('.btn-repeat');
const randomBtn = $('.btn-random');
const playlist = $('.playlist');
const timeProgress = $('.time-progress');
const musicDuration = $('.music-duration');
let arrayTemp = [];
let count = 0;

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Hey Jude',
            singer: 'The Beatles',
            path: './assets/music/Hey Jude - THE BEATLES (Lyrics).mp3',
            image: './assets/img/BeatlesHeyJude.jpg'
        },
        {
            name: 'Yesterday',
            singer: 'The Beatles',
            path: './assets/music/Yesterday - The Beatles (Lyrics).mp3',
            image: './assets/img/the-beatles-yesterday-e1400183058726.jpg'
        },
        {
            name: 'Let It Be',
            singer: 'The Beatles',
            path: './assets/music/The Beatles (Paul McCartney) - Let It Be (Take 23) - Remastered (1080pHD).mp3',
            image: './assets/img/LetItBe.jpg'
        },
        {
            name: 'Don\'t Let Me Down',
            singer: 'The Beatles',
            path: './assets/music/Don\'t Let Me Down lyrics - The Beatles.mp3',
            image: './assets/img/60 portugal-1.jpg'
        },
        {
            name: 'I Wanna Hold Your Hand',
            singer: 'The Beatles',
            path: './assets/music/The Beatles - I Want To Hold Your Hand Lyrics.mp3',
            image: './assets/img/Beatles_Hand___1A.jpg'
        },
        {
            name: 'Help!',
            singer: 'The Beatles',
            path: './assets/music/The Beatles - Help! (Lyrics).mp3',
            image: './assets/img/th.jpg'
        },
        {
            name: 'Stand By Me',
            singer: 'John Lennon',
            path: './assets/music/John Lennon - Stand by me.mp3',
            image: './assets/img/JOHN_LENNON_STAND_BY_ME.jpg'
        }
    ],
    
    render: function () {
        var htmls = this.songs.map((song, index) => {
            return `
                    <div class="song ${index == this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb" style="background-image: url('${song.image}');">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('');
    }, 

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function() {
        const _this = this;

        // Xử lý quay cd 
        const cdAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnimate.pause();

        // Xử lý phóng to thu nhỏ cd
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const cdNewWidth = cdWidth - scrollTop;

            cd.style.width = cdNewWidth > 0 ? cdNewWidth + 'px' : 0;
            cd.style.opacity = cdNewWidth / cdWidth;
        }

        // Xử lý click play 
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause();
            } else {
                audio.play();
            }
        }

        // khi song play
        audio.onplay = function() {
            _this.isPlaying= true;
            player.classList.add('playing')
            cdAnimate.play()
        }

        // khi song pause
        audio.onpause = function() {
            _this.isPlaying= false;
            player.classList.remove('playing')
            cdAnimate.pause()
        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.round((audio.currentTime / audio.duration) * 100);
                const songMinutes = (audio.duration - audio.duration%60) / 60;
                const progressMinutes = (audio.currentTime - audio.currentTime%60) / 60; // 0 in 0:01
                let songSeconds = Math.floor(audio.duration % 60);
                let progressSeconds = Math.floor(audio.currentTime % 60); // 01 in 0:01
                progress.value = progressPercent;
                if(progressSeconds < 10) {      // render 01, 02, ... 
                    progressSeconds = `0${Math.floor(audio.currentTime % 60)}`
                }
                if(songSeconds < 10) {
                    songSeconds = `0${Math.floor(audio.duration % 60)}`
                }
                timeProgress.textContent = `${progressMinutes}:${progressSeconds}`
                musicDuration.textContent = `${songMinutes}:${songSeconds}`
            }
        }

        // khi tua 
        progress.oninput = function() {
            const seekTime = (audio.duration * progress.value) / 100;
            audio.currentTime = seekTime;
        }

        // Khi bấm next
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
        }

        // khi bấm prev
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
        }

        //  khi bấm random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        
        // khi bấm repeat 
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // next khi end song
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // click vào bài khác trong playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')

            if( !e.target.closest('.option')) {
                // Khi click vào song 
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            } 
            // khi click vào option
            else {

            }
        }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        this.scrollToActiveSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
        this.scrollToActiveSong();
    },

    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
            var isChecked = arrayTemp.includes(newIndex)
        } while(isChecked)

        arrayTemp[count] = newIndex;
        
        if(count == this.songs.length - 1) {
            arrayTemp = [];
            count = 0;
        }
        count++;
        
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        this.scrollToActiveSong();
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            if (this.currentIndex <= 3) {
              $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
              });
            } else {
              $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          }, 300);
    },

    start: function () {
        // Xử lý sự kiện 
        this.handleEvents();

        // Định nghĩa các thuộc tính
        this.defineProperties();

        // Render ra playlist
        this.render();

        // Tải bài hát hiện tại 
        this.loadCurrentSong();
    }
} 

app.start()