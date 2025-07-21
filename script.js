

let currenttrack = new Audio();
let songs;







function formatTime(seconds) {
    if (isNaN(seconds)) {
        return "0:00";
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};


async function getfolder() {
    let f = await fetch("/songs");
    let response = await f.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    folder = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.includes("songs")) {
            folder.push(element.href.split("songs/")[1].replaceAll("/", "").replaceAll("%20", " "))

        }


    }


    return folder

}


let currfolder;
currfolder = "Arijit";

async function getsongs(folder) {
    currfolder = folder
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);

        }

    }
    return songs
}



async function main() {



    const playmusic = (track, pause = false) => {
        // let audio = new Audio(`/songs/${track}` );


        currenttrack.src = `/${currfolder}/` + track;

        // document.querySelector(".controls").querySelector(".play").querySelector("img").src="pause-circle-svgrepo-com.svg";

        document.querySelector(".info").querySelector(".scrolling-text").innerHTML = ` ${decodeURI(track)} `;

        if (!pause) {

            currenttrack.play();
            document.querySelector(".controls").querySelector(".play").querySelector("img").src = "pause-circle-svgrepo-com.svg";

        }


    }




    let folder = await getfolder();

    for (const foldername of folder) {


        let list = document.querySelector(".cardcont")

        list.innerHTML = list.innerHTML
            +
            `<div class="cards">
                            <div class="play1">
                                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg" stroke="#1ed760">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"
                                        stroke="#CCCCCC" stroke-width="0.192"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10.6935 15.8458L15.4137 13.059C16.1954 12.5974 16.1954 11.4026 15.4137 10.941L10.6935 8.15419C9.93371 7.70561 9 8.28947 9 9.21316V14.7868C9 15.7105 9.93371 16.2944 10.6935 15.8458Z"
                                            fill="#1ed760"></path>
                                    </g>
                                </svg>

                            </div>
                               <img src= /cover/${foldername}.jpg alt="${foldername} Cover">                          
                            <h5 class="name">${foldername}</h5>
                      </div>
`



    }




    let card = document.querySelectorAll(".cards")

    card.forEach(e => {

        e.addEventListener("click", async () => {

            currfolder = e.querySelector(".name").innerHTML.trim();

            songs = await getsongs("songs/" + e.querySelector(".name").innerHTML)


            let list = document.querySelector(".songlist").getElementsByTagName("ul")[0]

            list.innerHTML = "";


            for (const song of songs) {

                list.innerHTML = list.innerHTML + `<li> 
        <img src="music.svg" alt="">
        <div class="songinfo">
        <div class="songname"> ${song.replaceAll("%20", " ")}</div>
        </div>
        <div class="playnow play">
        
        <img src="play-circle-svgrepo-com.svg" alt=""></div>
        
        </div>
        
      
        
        

        </li>`




            }


            Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(async e => {
                // console.log(e.querySelector(".songinfo").querySelector(".songname").innerText);  OR 
                //  console.log(e.querySelector(".songname").innerText);
                e.addEventListener("click", () => {
                    // console.log(e.querySelector(".songinfo").getElementsByTagName("div")[0].innerHTML);

                    playmusic(e.querySelector(".songinfo").getElementsByTagName("div")[0].innerHTML.trim());

                    console.log(e.querySelector(".songinfo").getElementsByTagName("div")[0].innerHTML.replaceAll("%20", " "))
                    document.querySelector(".info").querySelector(".scrolling-text").innerHTML = `${e.querySelector(".songinfo").getElementsByTagName("div")[0].innerHTML.trim()}`;




                })

            });

            const menu = document.querySelector(".menu");

            if (menu && window.getComputedStyle(menu).opacity === "1") {
                document.querySelector(".left").style.left = "0";
                document.querySelector(".cross").style.opacity = "1";
                document.querySelector(".left").style.width = "60vw";
            }







        })

    })



    play.addEventListener("click", () => {
        if (currenttrack.paused || play.src == "play-circle-svgrepo-com.svg") {

            currenttrack.play();
            document.querySelector(".controls").querySelector(".play").querySelector("img").src = "pause-circle-svgrepo-com.svg";
        }
        else {
            currenttrack.pause();
            document.querySelector(".controls").querySelector(".play").querySelector("img").src = "play-circle-svgrepo-com.svg";

        }
    })






    currenttrack.addEventListener("timeupdate", () => {
        console.log(currenttrack.currentTime, currenttrack.duration);

        document.querySelector(".total-time").innerHTML = `${formatTime(currenttrack.duration)}`;
        document.querySelector(".current-time").innerHTML = `${formatTime(currenttrack.currentTime)}`;
        document.querySelector(".circle").style.left = (currenttrack.currentTime / currenttrack.duration) * 100 + "%";


        if (Math.floor(currenttrack.currentTime) ===  Math.floor(currenttrack.duration)) {
            let index = songs.indexOf(currenttrack.src.split("/").slice(-1)[0]);
            if (index + 1 < songs.length) {
                playmusic(decodeURI(songs[index + 1]));
            }
        }
        //    document.querySelector(".seekbar").style.width=(currenttrack.currentTime/currenttrack.duration)*100+"%";

    })


    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100

        currenttrack.currentTime = currenttrack.duration * percent / 100

    })





    document.querySelector(".menu").addEventListener("click", () => {


        document.querySelector(".left").style.left = "0";
        document.querySelector(".cross").style.opacity = "1";
        document.querySelector(".left").style.width = "60vw";


    })

    document.querySelector(".cross").addEventListener("click", () => {

        document.querySelector(".left").style.left = "-100%";
        document.querySelector(".left").style.width = "25vw";


    })




    next.addEventListener("click", () => {
        let index = songs.indexOf(currenttrack.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
            playmusic(songs[index + 1]);
        }

    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currenttrack.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playmusic(songs[index - 1]);
        }

    })



    document.querySelector(".audio").addEventListener("click", () => {

        if (document.querySelector(".audio").src.endsWith("audio-on.svg")) {
            currenttrack.muted = true;
            document.querySelector(".audio").src = "audio-off.svg";
            volume.value = 0;
        }
        else {
            currenttrack.muted = false;
            document.querySelector(".audio").src = "audio-on.svg";
            volume.value = 30;
        }




    })


    volume.addEventListener("input", () => {
        currenttrack.volume = volume.value / 100; /**as .volume property accepts only value from 0 to 1 and we had given min 0 max 100 in input so.....  */

    })



}

main();





