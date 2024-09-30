

let currsong = new Audio();
let songs;
let currFolder;


async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://192.168.18.128:3000/${currFolder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    console.log(as);
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1]);
        }
    }

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = '';  // Clear the list to avoid appending multiple times

    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                        <div class="cont">
                            <img src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Faisal</div>
                            </div>
                            <div class="playnow">
                                <div>Play now</div>
                                <img src="play.svg" alt="">
                            </div>
                        </div>
                    </li>`
        // let li = document.createElement('li');
        // li.textContent = song.replaceAll("%20"," "); // Ensure no extra spaces or line breaks in song name
        // songul.appendChild(li);  // Append each song as an <li> item
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);  // Use Math.floor to remove floating points

    return `${minutes}:${secs}`;
}



const playmusic = (track, pause = false) => {
    currsong.src = `/${currFolder}/` + track;
    if (!pause) {
        // currsong.play();
        play.src = "pause.svg";
    }
    // currsong.play();
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function songAlbum() {
    let a = await fetch(`http://192.168.18.128:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cards = document.querySelector(".cards");
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];
            let a = await fetch(`http://192.168.18.128:3000/songs/${folder}/info.json`);
            let response = await a.json();
            cards.innerHTML = cards.innerHTML + `<div data-folder="ncs" class="card">
                    <div class="playbt">
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 100 100">
                            <!-- Smaller Green Circle -->
                            <circle cx="50" cy="50" r="30" fill="green" />

                            <!-- Smaller Play Button Icon (Triangle) -->
                            <polygon points="40,35 40,65 65,50" fill="black" />
                        </svg>
                    </div>
                    <img src="/songs/${folder}/cover.jpeg" alt="">
                    <h3>${response.title}</h3>
                    <p>${response.description}</p>
                </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`/songs/${item.currentTarget.dataset.folder}`);
        })
    })
}


async function main() {
    await getsongs("/songs/ncs");
    playmusic(songs[0], true)

    songAlbum();
    play.addEventListener("click", () => {
        if (currsong.paused) {
            currsong.play();
            play.src = "pause.svg"
        } else {
            currsong.pause();
            play.src = "play1.svg";
        }
    })
    currsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currsong.currentTime)} / ${formatTime(currsong.duration)}`;
        document.querySelector(".circle").style.left = (currsong.currentTime / currsong.duration) * 100 + "%"

    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        // Calculate percentage of where the click happened on the seek bar
        let perc = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        // Move the circle to the clicked position
        document.querySelector(".circle").style.left = perc + "%";

        // Set the current time of the song based on the percentage
        currsong.currentTime = (perc / 100) * currsong.duration;  // Correctly update currentTime based on the percentage of the total duration
    });

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currsong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1]);
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currsong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length - 1) {
            playmusic(songs[index + 1]);
        }
    })

    


}

main();