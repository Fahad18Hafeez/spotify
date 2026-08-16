let tracks = [];
let currentIndex = -1;
let isPlaying = false;
let audio = document.querySelector("#audio");
let playerImg = document.querySelector("#playerImg");
let playerTitle = document.querySelector("#playerTitle");
let playerArtist = document.querySelector("#playerArtist");
let quickGrid = document.querySelector(".quick-grid");
let madeGrid = document.querySelector(".made-grid");
let albumGrid = document.querySelector(".album-grid");
let recentGrid = document.querySelector(".recent-grid");
let searchInput = document.querySelector(".search-box input");
let playButton = document.querySelector(".play");
let controls = document.querySelector(".controls");
let progressInputs = document.querySelectorAll(".progress input");
let volumeInput = document.querySelector(".volume input");
fetch("data.json")
    .then(function(response) {
        if (!response.ok) {
            throw new Error("data.json load nahi hui");
        }
        return response.json();
    })
    .then(function(data) {
        tracks = data.tracks;
        console.log("Total Songs:", tracks.length);
        console.log("Songs:", tracks);
      showSongs();
    })
    .catch(function(error) {
     console.log("Fetch Error:", error);
    });
function showSongs() {
    quickGrid.innerHTML = "";
    tracks.slice(0, 6).forEach(function(song) {
        let card = document.createElement("div");
        card.classList.add("quick-card");
        card.dataset.id = song.id;
        card.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <span>${song.title}</span>
        `;
        quickGrid.appendChild(card);
    });
}
function showMadeForYou() {
    madeGrid.innerHTML = "";
    tracks.slice(0, 5).forEach(function(song) {
        let card = document.createElement("div");
        card.classList.add("made-card");
        card.dataset.id = song.id;
        card.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
        `;
        madeGrid.appendChild(card);
    });
}
function showAlbums() {
    albumGrid.innerHTML = "";
    tracks.slice(9, 13).forEach(function(song) {
        let card = document.createElement("div");
        card.classList.add("album-card");
        card.dataset.id = song.id;
        card.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
        `;
        albumGrid.appendChild(card);
    });
}
function showRecentlyPlayed() {
    recentGrid.innerHTML = "";
    tracks.slice(1, 6).forEach(function(song) {
        let card = document.createElement("div");
        card.classList.add("recent-card");
        card.dataset.id = song.id;
        card.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
        `;
        recentGrid.appendChild(card);
    });
}
function playSong(song) {
    if (!song) {
        return;
    }
    console.log("Playing:", song.title);
    console.log("Audio URL:", song.src);
    currentIndex = tracks.findIndex(function(track) {
        return track.id === song.id;
    });
    audio.pause();
    audio.src = song.src;
    audio.load();
    playerImg.src = song.cover;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    audio.play()
        .then(function() {
            isPlaying = true;
            playButton.textContent = "❚❚";
            console.log("Song successfully playing");
        })
        .catch(function(error) {
            isPlaying = false;
            playButton.textContent = "▶";
            console.log("Audio Play Error:", error);
        });
}
quickGrid.addEventListener("click", function(event) {
    let card = event.target.closest(".quick-card");
    if (!card) {
        return;
    }
    let id = Number(card.dataset.id);
    let song = tracks.find(function(track) {
        return track.id === id;
    });
    playSong(song);
});
madeGrid.addEventListener("click", function(event) {
    let card = event.target.closest(".made-card");
    if (!card) {
        return;
    }
    let id = Number(card.dataset.id);
    let song = tracks.find(function(track) {
        return track.id === id;
    });
    playSong(song);
});
albumGrid.addEventListener("click", function(event) {
    let card = event.target.closest(".album-card");
    if (!card) {
        return;
    }
    let id = Number(card.dataset.id);
    let song = tracks.find(function(track) {
        return track.id === id;
    });
    playSong(song);
});
recentGrid.addEventListener("click", function(event) {
    let card = event.target.closest(".recent-card");
    if (!card) {
        return;
    }
    let id = Number(card.dataset.id);
    let song = tracks.find(function(track) {
        return track.id === id;
    });
    playSong(song);
});
playButton.addEventListener("click", function() {
    if (currentIndex === -1) {
        playSong(tracks[0]);
        return;
    }
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        playButton.textContent = "▶";
    }
    else {
        audio.play()
            .then(function() {
                isPlaying = true;
                playButton.textContent = "❚❚";
            })
            .catch(function(error) {
                console.log("Play Error:", error);
            });
    }
});
function nextSong() {
    if (tracks.length === 0) {
        return;
    }
    let nextIndex = currentIndex + 1;
    if (nextIndex >= tracks.length) {
        nextIndex = 0;
    }
    playSong(tracks[nextIndex]);
}
function previousSong() {
    if (tracks.length === 0) {
        return;
    }
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }
    let previousIndex = currentIndex - 1;
    if (previousIndex < 0) {
        previousIndex = tracks.length - 1;
    }
    playSong(tracks[previousIndex]);
}
let buttons = controls.querySelectorAll("button");
buttons[0].addEventListener("click", function() {
    previousSong();
});
buttons[2].addEventListener("click", function() {
    nextSong();
});
audio.addEventListener("timeupdate", function() {
    if (!audio.duration) {
        return;
    }
    let percentage =
        (audio.currentTime / audio.duration) * 100;
    progressInputs[0].value = percentage;
    console.log(
        "Progress:",
        Math.floor(audio.currentTime)
    );
});
audio.addEventListener("loadedmetadata", function() {
    console.log(
        "Duration:",
        audio.duration
    );
});
progressInputs[0].addEventListener("input", function() {
    if (!audio.duration) {
        return;
    }
    let percentage = Number(
        progressInputs[0].value
    );
    audio.currentTime =
        (percentage / 100) * audio.duration;
});
volumeInput.addEventListener("input", function() {
    let volume =
        Number(volumeInput.value) / 100;
    audio.volume = volume;
    console.log("Volume:", volume);
});
audio.addEventListener("ended", function() {
    console.log("Song Ended");
    nextSong();
});
audio.addEventListener("error", function() {
    console.log("Audio file load nahi hui");
    console.log("Current URL:", audio.src);
});
searchInput.addEventListener("input", function() {
    let searchValue =
        searchInput.value.trim().toLowerCase();
    if (searchValue === "") {
        showSongs();
        showMadeForYou();
        showAlbums();
        showRecentlyPlayed();
        return;
    }
    let filteredSongs = tracks.filter(function(song) {
        return (
            song.title.toLowerCase().includes(searchValue) ||
            song.artist.toLowerCase().includes(searchValue) ||
            song.album.toLowerCase().includes(searchValue)
        );
    });
    quickGrid.innerHTML = "";
    filteredSongs.forEach(function(song) {
        let card = document.createElement("div");
        card.classList.add("quick-card");
        card.dataset.id = song.id;
        card.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <span>${song.title}</span>
        `;
        quickGrid.appendChild(card);
    });
    madeGrid.innerHTML = "";
    filteredSongs.forEach(function(song) {
        let card = document.createElement("div");
        card.classList.add("made-card");
        card.dataset.id = song.id;
        card.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <h3>${song.title}</h3>
          <p>${song.artist}</p>
        `;
      madeGrid.appendChild(card);
    });
});
let originalShowSongs = showSongs;
showSongs = function() {
    originalShowSongs();
    showMadeForYou();
    showAlbums();
    showRecentlyPlayed();
};