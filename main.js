/**
 * 1.Render songs
 * 2.Scroll top
 * 3.Play / pause / seek
 * 4.CD rotate
 * 5.Next / prev
 * 6.Random
 * 7.Next / Repeat when ended
 * 8.Active song
 * 9.Scroll active song into view
 * 10.Play song when click
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const music = $('.music')
const dashboard = $('.dashboard')
const headerSong = $('.header__song')
const compactDisc = $('.compact-disc')
const compactDiscInner = $('.compact-disc__inner')
const compactDiscThumb = $('.compact-disc__thumb')
const btnRepeat = $('.btn.btn-repeat')
const btnPrevious = $('.btn.btn-prev')
const btnTogglePlay = $('.btn.btn-toggle-play')
const btnNext = $('.btn.btn-next')
const btnRandom = $('.btn.btn-random')
const progress = $('#progress')
const audio = $('#audio')
const playlist = $('.playlist')
const MUSIC_STORAGE_KEY = '3D_PLAYER'

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(MUSIC_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Cry On My Shoulder',
            singer: 'Nanamori',
            path: './assets/audio/Cry On My Shoulder - Super Stars.mp3',
            image: './assets/images/singer0.jpg'
        },
        {
            name: 'Forever Alone',
            singer: 'JustaTee',
            path: './assets/audio/Forever Alone - JustaTee.mp3',
            image: './assets/images/singer1.jpg'
        },
        {
            name: 'K-NAAN-Wavin-Flag',
            singer: 'Anh Khoa',
            path: './assets/audio/K-NAAN-Wavin-Flag.mp3',
            image: './assets/images/singer2.jpg'
        },
        {
            name: 'My Love',
            singer: 'Grace Karnklao',
            path: './assets/audio/My Love - Westlife.mp3',
            image: './assets/images/singer3.jpg'
        },
        {
            name: 'Pokemon Pikachu Dance',
            singer: 'Jasmine Rae',
            path: './assets/audio/Pokemon Pikachu Dance Song.mp3',
            image: './assets/images/singer4.jpg'
        },
        {
            name: 'Reality',
            singer: 'Madeline',
            path: './assets/audio/Reality.mp3',
            image: './assets/images/singer5.jpg'
        },
        {
            name: 'Shape of You',
            singer: 'Ed Sheeran',
            path: './assets/audio/Shape of You-Ed Sheeran.mp3',
            image: './assets/images/singer6.jpg'
        },
        {
            name: 'What Does The Fox Say...',
            singer: 'Ylvis',
            path: './assets/audio/The Fox What Does The Fox Say... - Ylvis.mp3',
            image: './assets/images/singer7.jpg'
        },
        {
            name: 'Until You',
            singer: 'Shayne Ward',
            path: './assets/audio/Until You - Shayne Ward.mp3',
            image: './assets/images/singer8.jpg'
        },
        {
            name: 'You Raise Me Up',
            singer: 'Westlife',
            path: './assets/audio/You Raise Me Up - Westlife.mp3',
            image: './assets/images/singer9.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(this.config))
    },
    loadConfig: function() {
        this.isRepeat = this.config.isRepeat
        this.isRandom = this.config.isRandom
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        // Current song into view
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 300);
    },
    handleEvents: function() {
        const _this = this
        const compactDiscWidth = compactDiscInner.offsetWidth

        // Xu ly CD quay / dung
        const cdRotate = compactDiscThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdRotate.pause()
        // Xu ly phong to / thu nho CD
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY
            const newCompactDiscWidth = compactDiscWidth - scrollTop
            compactDiscInner.style.width = newCompactDiscWidth > 0 ? newCompactDiscWidth + 'px' : 0
            compactDiscInner.style.opacity = newCompactDiscWidth / compactDiscWidth
        }
        // Xu ly khi click play
        btnTogglePlay.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        // Khi song duoc play
        audio.onplay = function() {
            _this.isPlaying = true
            music.classList.add('playing')
            compactDisc.classList.add('active')
            cdRotate.play()
            $('.song.active .spectrum').classList.remove('pause')
            $('.song.active .spectrum').classList.add('active')
        }
        // Khi song bi pause
        audio.onpause = function() {
            _this.isPlaying = false
            music.classList.remove('playing')
            compactDisc.classList.remove('active')
            cdRotate.pause()
            $('.song.active .spectrum').classList.remove('active')
            $('.song.active .spectrum').classList.add('pause')
        }
        // Khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100)
                progress.value = progressPercent
            }
        }
        // Khi tua song (su dung input thay change de fix bug)
        progress.oninput = function(event) {
            const seekTime = (audio.duration * event.target.value) / 100
            audio.currentTime = seekTime
        }
        // Khi click previous song
        btnPrevious.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Khi click next song
        btnNext.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Xu ly bat/tat random song
        btnRandom.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            btnRandom.classList.toggle('active', _this.isRandom)
        }
        // Xu ly bat/tat repeat song
        btnRepeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            btnRepeat.classList.toggle('active', _this.isRepeat)
        }
        // Xu ly ket thuc mot song
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                btnNext.click()
            }
        }
        // Lang nghe hanh vi click vao playlist
        playlist.onclick = function(event) {
            const songNode = event.target.closest('.song:not(.active)')
            const optionNode = event.target.closest('.option')
            if(songNode || optionNode) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if(optionNode) {
                    console.log(optionNode)
                }
            }
        }
    },
    loadCurrentSong: function() {
        headerSong.textContent = this.currentSong.name
        compactDiscThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        console.log(headerSong, compactDiscThumb, audio)
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                    <div class="image" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                    <div class="spectrum">
                        <div class="bar"></div>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    start: function() {
        // Thiet lap cau hinh vao ung dung
        this.loadConfig()
        // Dinh nghia cac thuoc tinh
        this.defineProperties()
        // Xu ly cac su kien
        this.handleEvents()
        // Tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()
        // Render cac bai hat playlist
        this.render()
    }
}
app.start()