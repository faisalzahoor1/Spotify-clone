

async function getsongs() {
    let a = await fetch("http://192.168.18.128:3000/Songs/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    console.log(as);
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/Songs/")[1]);
        }
    }
    return songs;

}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);  // Use Math.floor to remove floating points

    return `${minutes}:${secs}`;
}

let currsong = new Audio();
let songs;

const playmusic = (track, pause = false) => {
    currsong.src = "/songs/" + track;
    if (!pause) {
        currsong.play();
        play.src = "pause.svg";
    }
    currsong.play();
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function main() {
    let songs = await getsongs();
    console.log(songs)
    playmusic(songs[0], true)
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    // songul.innerHTML = '';  // Clear the list to avoid appending multiple times

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
       document.querySelector(".circle").style.left = (currsong.currentTime/currsong.duration)*100+"%"
        
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        // Calculate percentage of where the click happened on the seek bar
        let perc = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        
        // Move the circle to the clicked position
        document.querySelector(".circle").style.left = perc + "%";
    
        // Set the current time of the song based on the percentage
        currsong.currentTime = (perc / 100) * currsong.duration;  // Correctly update currentTime based on the percentage of the total duration
    });
    
    previous.addEventListener("click", ()=>{
        let index = songs.indexOf(currsong.src.split("/").slice(-1)[0]);
        if ((index-1) >=0) {
            playmusic(songs[index-1]);
        }
    })
    next.addEventListener("click", ()=>{
        let index = songs.indexOf(currsong.src.split("/").slice(-1)[0]);
        if ((index+1) < songs.length-1) {
            playmusic(songs[index+1]);
        }
    })
}

main();