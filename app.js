document.addEventListener('DOMContentLoaded', function() {
  // Hide loading overlay when everything is loaded
  window.addEventListener('load', function() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 500);
  });

  // Current song information
  let songIndex = 0;
  let audioElement = new Audio();
  let isPlaying = false;
  let isShuffle = false;
  let isRepeat = false;
  let updateLyricsInterval;
  
  // DOM Elements
  const masterPlay = document.getElementById("masterPlay");
  const myProgressBar = document.getElementById("myProgressBar");
  const gif = document.getElementById("gif");
  const masterSongName = document.getElementById("masterSongName");
  const currentSongTitle = document.getElementById("currentSongTitle");
  const currentSongAlbum = document.getElementById("currentSongAlbum");
  const currentSongCover = document.getElementById("currentSongCover");
  const lyricsDisplay = document.getElementById("lyricsDisplay");
  const currentTimeDisplay = document.getElementById("currentTime");
  const totalTimeDisplay = document.getElementById("totalTime");
  const volumeSlider = document.getElementById("volumeSlider");
  const searchInput = document.getElementById("searchInput");
  const songItemContainer = document.getElementById("songItemContainer");
  const songInfo = document.getElementById("songInfo");
  
  // Mobile player elements
  const mobilePlayer = document.getElementById("mobilePlayer");
  const mobilePlayerImg = document.getElementById("mobilePlayerImg");
  const mobilePlayerTitle = document.getElementById("mobilePlayerTitle");
  const mobilePlayerArtist = document.getElementById("mobilePlayerArtist");
  const mobilePlayBtn = document.getElementById("mobilePlayBtn");
  const mobileNextBtn = document.getElementById("mobileNextBtn");
  
  // Control buttons
  const previousBtn = document.getElementById("previous");
  const nextBtn = document.getElementById("next");
  const shuffleBtn = document.getElementById("shuffle");
  const repeatBtn = document.getElementById("repeat");
  
  // Songs array with additional information
  const songs = [
    {
      songName: "Ajab Si (Om Shanti Om)",
      artist: "KK",
      filepath: "songs/1.mp3",
      coverPath: "covers/1.jpg",
      album: "Om Shanti Om (2007)",
      duration: 241,
      lyrics: [
        { time: 0, text: "Ajab si, ajab si" },
        { time: 15, text: "Teri meri, yeh kahani hai" },
        { time: 30, text: "Hai jadu sa, kuchh ajab sa" },
        { time: 45, text: "Kuchh alag sa, yeh milan" }
      ]
    },
    {
      songName: "Aye Bekhabar (Zeher)",
      artist: "KK",
      filepath: "songs/2.mp3",
      coverPath: "covers/2.jpg",
      album: "Zeher (2005)",
      duration: 343,
      lyrics: [
        { time: 0, text: "Aye bekhabar, aye bekhabar" },
        { time: 20, text: "Tujhko pata hai kya" },
        { time: 40, text: "Tere bina, jeena nahi" },
        { time: 60, text: "Marna nahi, aye bekhabar" }
      ]
    },
    {
      songName: "Beetein Lamhein (Live-The Train)",
      artist: "KK",
      filepath: "songs/3.mp3",
      coverPath: "covers/3.jpg",
      album: "The Train (2007)",
      duration: 298,
      lyrics: [
        { time: 0, text: "Beetein lamhein, wo saari baatein" },
        { time: 15, text: "Yaad aati hain, dil dukhaati hain" },
        { time: 30, text: "Kyun hota hai aisa, ke jaane ke baad" },
        { time: 45, text: "Pyaar aur bhi gehra ho jaata hai" }
      ]
    },
    {
      songName: "Dil Kyun Yeh Mera (Kites)",
      artist: "KK",
      filepath: "songs/4.mp3",
      coverPath: "covers/4.jpg",
      album: "Kites (2010)",
      duration: 333,
      lyrics: [
        { time: 0, text: "Dil kyun yeh mera, dhadke unn sunn" },
        { time: 15, text: "Jaise keh raha ho, tu hai meri mann" },
        { time: 30, text: "Dil kyun yeh mera, roke na ruke" },
        { time: 45, text: "Jaise beh raha ho, teri hi dhun" }
      ]
    },
    {
      songName: "Dil Nashin Dil Nashin (Aashiq Banaya Aapne)",
      artist: "KK",
      filepath: "songs/5.mp3",
      coverPath: "covers/5.jpg",
      album: "Aashiq Banaya Aapne (2005)",
      duration: 392,
      lyrics: [
        { time: 0, text: "Dil nashin dil nashin, ho gaya hai" },
        { time: 20, text: "Tere ishq mein, kho gaya hai" },
        { time: 40, text: "Dil nashin dil nashin, ho gaya hai" },
        { time: 60, text: "Tere pyaar mein, dooba hai" }
      ]
    },
    {
      songName: "Dus Bahane (Dus)",
      artist: "KK, Shaan",
      filepath: "songs/6.mp3",
      coverPath: "covers/6.jpg",
      album: "Dus (2005)",
      duration: 206,
      lyrics: [
        { time: 0, text: "Dus bahane karke le gaye dil" },
        { time: 10, text: "Dus bahane karke le gaye dil" },
        { time: 20, text: "Dus bahane karke le gaye dil" },
        { time: 30, text: "Dus bahane karke le gaye dil" }
      ]
    },
    {
      songName: "Khuda Jaane (Bachna Ae Haseeno)",
      artist: "KK",
      filepath: "songs/7.mp3",
      coverPath: "covers/7.jpg",
      album: "Bachna Ae Haseeno (2008)",
      duration: 333,
      lyrics: [
        { time: 0, text: "Khuda jaane, ke yeh ho kya raha hai" },
        { time: 15, text: "Dil mera, behka sa raha hai" },
        { time: 30, text: "Khuda jaane, ke yeh ho kya raha hai" },
        { time: 45, text: "Tere bina, ab reh na pa raha hai" }
      ]
    },
    {
      songName: "Saanson Ke (Raees)",
      artist: "KK",
      filepath: "songs/8.mp3",
      coverPath: "covers/8.jpg",
      album: "Raees (2017)",
      duration: 491,
      lyrics: [
        { time: 0, text: "Saanson ke, saanson mein" },
        { time: 20, text: "Dhadkanon ke, dhadkan mein" },
        { time: 40, text: "Teri hi khushboo, teri hi chahat" },
        { time: 60, text: "Teri hi yaadein, tera hi pyaar" }
      ]
    },
    {
      songName: "Tu Hi Meri Shab Hai (Gangster)",
      artist: "KK",
      filepath: "songs/9.mp3",
      coverPath: "covers/9.jpg",
      album: "Gangster (2006)",
      duration: 371,
      lyrics: [
        { time: 0, text: "Tu hi meri shab hai, tu hi meri subah hai" },
        { time: 20, text: "Tu hi meri chaahat, tu hi meri dua hai" },
        { time: 40, text: "Tu hi meri shab hai, tu hi meri subah hai" },
        { time: 60, text: "Tu hi meri chaahat, tu hi meri dua hai" }
      ]
    },
    {
      songName: "Tujhe Sochta Hoon (Jannat)",
      artist: "KK",
      filepath: "songs/10.mp3",
      coverPath: "covers/10.jpg",
      album: "Jannat (2008)",
      duration: 313,
      lyrics: [
        { time: 0, text: "Tujhe sochta hoon main, har pal har lamha" },
        { time: 15, text: "Tere bina lagta hai, adhoora sa har saans" },
        { time: 30, text: "Tujhe sochta hoon main, har pal har lamha" },
        { time: 45, text: "Tere bina lagta hai, adhoora sa har saans" }
      ]
    }
  ];

  // Initialize player
  function initializePlayer() {
    // Load first song
    loadSong(songIndex);
    
    // Populate song list
    renderSongList();
    
    // Set up event listeners
    setupEventListeners();
  }

  // Load song
  function loadSong(index) {
    const song = songs[index];
    audioElement.src = song.filepath;
    masterSongName.textContent = `${song.songName} - ${song.artist}`;
    currentSongTitle.textContent = song.songName;
    currentSongAlbum.textContent = `Album: ${song.album}`;
    currentSongCover.src = song.coverPath;
    totalTimeDisplay.textContent = formatTime(song.duration);
    
    // Update mobile player
    mobilePlayerImg.src = song.coverPath;
    mobilePlayerTitle.textContent = song.songName;
    mobilePlayerArtist.textContent = song.artist;
    
    // Display lyrics
    displayLyrics(song.lyrics);
    
    // Highlight current song in list
    highlightCurrentSong(index);
    
    // If already playing, continue playback
    if (isPlaying) {
      audioElement.play().catch(e => console.log("Playback error:", e));
    }
  }

  // Display lyrics
  function displayLyrics(lyrics) {
    lyricsDisplay.innerHTML = '';
    
    if (lyrics && lyrics.length > 0) {
      lyrics.forEach(line => {
        const p = document.createElement('p');
        p.className = 'lyrics-line';
        p.textContent = line.text;
        p.setAttribute('data-time', line.time);
        lyricsDisplay.appendChild(p);
      });
    } else {
      const p = document.createElement('p');
      p.className = 'lyrics-line';
      p.textContent = 'Lyrics not available for this song';
      lyricsDisplay.appendChild(p);
    }
  }

  // Format time (seconds to MM:SS)
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Render song list
  function renderSongList(filter = '') {
    songItemContainer.innerHTML = '';
    
    const filteredSongs = filter ? 
      songs.filter(song => 
        song.songName.toLowerCase().includes(filter.toLowerCase()) ||
        song.album.toLowerCase().includes(filter.toLowerCase())
      ) : 
      songs;
    
    filteredSongs.forEach((song, index) => {
      const songItem = document.createElement('div');
      songItem.className = 'songItem';
      songItem.innerHTML = `
        <img src="${song.coverPath}" alt="${song.songName}">
        <span class="songName">${song.songName}</span>
        <span class="songlistplay">
          <span class="timestamp">${formatTime(song.duration)} 
            <i id="${index}" class="fas fa-play songItemPlay"></i>
          </span>
        </span>
      `;
      songItemContainer.appendChild(songItem);
      
      // Add click event to play song
      songItem.addEventListener('click', () => playSong(index));
    });
  }

  // Highlight current song in list
  function highlightCurrentSong(index) {
    const songItems = document.querySelectorAll('.songItem');
    songItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Play song
  function playSong(index) {
    songIndex = index;
    loadSong(songIndex);
    audioElement.play()
      .then(() => {
        isPlaying = true;
        updatePlayButtons();
        songInfo.classList.add('active');
        gif.style.opacity = 1;
      })
      .catch(e => console.log("Playback error:", e));
  }

  // Update play/pause buttons
  function updatePlayButtons() {
    // Update master play button
    if (isPlaying) {
      masterPlay.innerHTML = '<i class="fas fa-pause"></i>';
      mobilePlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      masterPlay.innerHTML = '<i class="fas fa-play"></i>';
      mobilePlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    // Update all song item play buttons
    document.querySelectorAll('.songItemPlay').forEach((btn, i) => {
      if (isPlaying && i === songIndex) {
        btn.classList.remove('fa-play');
        btn.classList.add('fa-pause');
      } else {
        btn.classList.remove('fa-pause');
        btn.classList.add('fa-play');
      }
    });
  }

  // Set up event listeners
  function setupEventListeners() {
    // Play/Pause button
    masterPlay.addEventListener('click', togglePlay);
    mobilePlayBtn.addEventListener('click', togglePlay);
    
    // Progress bar
    myProgressBar.addEventListener('input', setProgress);
    
    // Time update
    audioElement.addEventListener('timeupdate', updateProgress);
    
    // Song ended
    audioElement.addEventListener('ended', handleSongEnd);
    
    // Previous/Next buttons
    previousBtn.addEventListener('click', previousSong);
    nextBtn.addEventListener('click', nextSong);
    mobileNextBtn.addEventListener('click', nextSong);
    
    // Shuffle/Repeat buttons
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    // Volume control
    volumeSlider.addEventListener('input', setVolume);
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
      renderSongList(e.target.value);
    });
    
    // Click on song item play button
    songItemContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('songItemPlay')) {
        const index = parseInt(e.target.id);
        playSong(index);
      }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          nextSong();
          break;
        case 'ArrowLeft':
          previousSong();
          break;
      }
    });
  }

  // Toggle play/pause
  function togglePlay() {
    if (isPlaying) {
      audioElement.pause();
      clearInterval(updateLyricsInterval);
    } else {
      audioElement.play()
        .then(() => {
          startLyricsUpdate();
        })
        .catch(e => console.log("Playback error:", e));
    }
    isPlaying = !isPlaying;
    updatePlayButtons();
    gif.style.opacity = isPlaying ? 1 : 0;
  }

  // Start updating lyrics highlighting
  function startLyricsUpdate() {
    clearInterval(updateLyricsInterval);
    updateLyricsHighlight();
    updateLyricsInterval = setInterval(updateLyricsHighlight, 500);
  }

  // Update lyrics highlighting based on current time
  function updateLyricsHighlight() {
    const currentTime = audioElement.currentTime;
    const lyricsLines = document.querySelectorAll('.lyrics-line');
    
    // Reset all lines
    lyricsLines.forEach(line => {
      line.classList.remove('active');
    });
    
    // Find and highlight the current line
    if (songs[songIndex].lyrics) {
      let activeLine = null;
      for (let i = songs[songIndex].lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= songs[songIndex].lyrics[i].time) {
          activeLine = document.querySelector(`.lyrics-line[data-time="${songs[songIndex].lyrics[i].time}"]`);
          break;
        }
      }
      
      if (activeLine) {
        activeLine.classList.add('active');
        // Scroll to active line
        activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  // Update progress bar
  function updateProgress() {
    const { currentTime, duration } = audioElement;
    const progressPercent = (currentTime / duration) * 100;
    myProgressBar.value = progressPercent;
    currentTimeDisplay.textContent = formatTime(currentTime);
  }

  // Set progress
  function setProgress() {
    const progress = myProgressBar.value;
    const duration = audioElement.duration;
    audioElement.currentTime = (progress / 100) * duration;
  }

  // Handle song end
  function handleSongEnd() {
    if (isRepeat) {
      audioElement.currentTime = 0;
      audioElement.play();
    } else {
      nextSong();
    }
  }

  // Next song
  function nextSong() {
    if (isShuffle) {
      playRandomSong();
    } else {
      songIndex = (songIndex + 1) % songs.length;
    }
    loadSong(songIndex);
    if (isPlaying) {
      audioElement.play()
        .then(() => {
          startLyricsUpdate();
        })
        .catch(e => console.log("Playback error:", e));
    }
    updatePlayButtons();
  }

  // Previous song
  function previousSong() {
    if (audioElement.currentTime > 3) {
      // If more than 3 seconds into song, restart current song
      audioElement.currentTime = 0;
    } else {
      // Otherwise go to previous song
      songIndex = (songIndex - 1 + songs.length) % songs.length;
      loadSong(songIndex);
      if (isPlaying) {
        audioElement.play()
          .then(() => {
            startLyricsUpdate();
          })
          .catch(e => console.log("Playback error:", e));
      }
      updatePlayButtons();
    }
  }

  // Play random song
  function playRandomSong() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * songs.length);
    } while (newIndex === songIndex && songs.length > 1);
    songIndex = newIndex;
  }

  // Toggle shuffle
  function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
  }

  // Toggle repeat
  function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
    audioElement.loop = isRepeat;
  }

  // Set volume
  function setVolume() {
    audioElement.volume = volumeSlider.value / 100;
    const volumeIcon = document.querySelector('.volume-control i');
    if (volumeSlider.value == 0) {
      volumeIcon.className = 'fas fa-volume-mute';
    } else {
      volumeIcon.className = 'fas fa-volume-up';
    }
  }

  // Initialize the player
  initializePlayer();
});