let currentsong = new Audio();

async function getSongs() {
    try {
        let response = await fetch("http://127.0.0.1:3000/Music-web/songs/");
        let text = await response.text();
        let div = document.createElement("div");
        div.innerHTML = text;
        let as = div.getElementsByTagName("a");

        let songs = [];
        for (const element of as) {
            if (element.href.endsWith(".mp3")) {
                let songName = decodeURIComponent(element.href.split("/songs/")[1].trim());
                songs.push(songName);
            }
        }
        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

const playMusic = (track) => {
    if (currentsong.src !== `/Music-web/songs/${track}`) {
        currentsong.src = `/Music-web/songs/${track}`;
        currentsong.play();
        play.src = "pause.svg";  // Update UI to show "Pause"
    } else {
        // If same song is clicked again, toggle play/pause
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg";
        } else {
            currentsong.pause();
            play.src = "play.svg";
        }
    }
};

async function main() {
    let songs = await getSongs();
    if (songs.length === 0) {
        console.error("No songs found");
        return;
    }

    let songUl = document.querySelector(".songlist ul");
    songUl.innerHTML = "";

    for (const song of songs) {
        let li = document.createElement("li");
        li.innerHTML = `
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Harsh</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
            </div>
        `;
        li.addEventListener("click", () => {
            let songName = li.querySelector(".info div").textContent.trim();
            console.log("Playing:", songName);
            playMusic(songName);
        });
        songUl.appendChild(li);
    }

    // Play/Pause button event listener
    document.getElementById("play").addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg";
        } else {
            currentsong.pause();
            play.src = "play.svg";
        }
    });
}

main();
