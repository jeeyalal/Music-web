let currentsong = new Audio()
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

    currentsong.src = `/Music-web/songs/${track}`


    currentsong.play();
    play.src = "pause.svg"
    document.querySelector(".song-info").innerHTML = `${track}`;

    document.querySelector(".song-time").innerHTML = "00:00 / 00:00";
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



    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg"
        }
        else {
            currentsong.pause();
            play.src = 'play.svg'
        }
    })


    // updtae
    // currentsong.addEventListener("timeupdate", ()=> { 
    //     console.log(currentsong.currentTime, currentsongs.duration);
    //     console.log(currentsong.currentTime, currentsong.duration);

    //     document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(currentsong.
    //         currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
    // })
    currentsong.addEventListener("timeupdate", () => {
        if (!isNaN(currentsong.duration)) {
            document.querySelector(".song-time").innerHTML =
                `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
        }

        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    });

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)
        document.querySelector(".circle").style.left = percent * 100 + "%"
        currentsong.currentTime = ((currentsong.duration)* percent)/100
    })


    document.querySelector(".menu").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%"
    })
}

function secondsToMinutesSeconds(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;




}

main();
