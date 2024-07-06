const currentYear = new Date().getFullYear();
const seasons = ["winter", "spring", "summer", "fall"];
const currentMonth = new Date().getMonth();
const currentSeason = seasons[Math.floor(currentMonth / 3) % 4];

// Define the API endpoint
const apiUrl = `https://api.jikan.moe/v4/seasons/${currentYear}/${currentSeason}`;
console.log(apiUrl)




const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const d = new Date();
let day = weekday[d.getDay()].toLowerCase(); // Convert day to lowercase for API filter
const api = `https://api.jikan.moe/v4/schedules?filter=${day}`;

console.log(api);

async function logAnimes() {
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const animes = await response.json();
        const animeList = document.querySelector('.owl-carousel.custom-carousel.owl-theme'); // Use querySelector to select the class
        console.log(animes.data);

        function removeDuplicates(arr) {
            let a = [];
            a.push(arr[0]);
            arr.forEach(element => {
                let c = 0;
                a.forEach(e => {
                    if (e.mal_id === element.mal_id) {
                        c++;
                    }
                });
                if (c === 0) {
                    a.push(element);
                }
            });
            return a;
        }
        const arr = removeDuplicates(animes.data);

        console.log(arr);  

        arr.sort(function (a, b) {
            function minu(time) {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            }
            var keyA = minu(a.broadcast.time),
                keyB = minu(b.broadcast.time);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });

        arr.forEach(element => {
            const animeItemn = document.createElement('div');
            animeItemn.classList.add('item');

            function convertJSTToLocal(timeJST) {
                // Extract hours and minutes from the time string
                const [hours, minutes] = timeJST.split(':').map(Number);

                // Create a Date object for the JST time
                const jstDate = new Date();
                jstDate.setHours(hours);
                jstDate.setMinutes(minutes);
                jstDate.setSeconds(0);
                jstDate.setMilliseconds(0);

                // JST is 9 hours ahead of UTC
                const JST_OFFSET = 9 * 60; // 9 hours in minutes
                const jstMinutesSinceMidnight = (hours * 60) + minutes;
                const utcMinutesSinceMidnight = jstMinutesSinceMidnight - JST_OFFSET;

                // Create a new Date object for the UTC time
                const utcDate = new Date(jstDate);
                utcDate.setMinutes(utcDate.getMinutes() - JST_OFFSET);

                // Convert the UTC time to local time
                const localDate = new Date(utcDate.getTime() + (utcDate.getTimezoneOffset() * 60000));

                // Format the local time as a string
                const options = { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
                const localTimeString = new Intl.DateTimeFormat(undefined, options).format(localDate);

                return localTimeString;
            }
            animeItemn.style.backgroundImage=`url("${element.images.jpg.large_image_url}")`
            animeItemn.innerHTML =`<div class="item-desc"><h3>${element.title}</h3><p>${convertJSTToLocal(element.broadcast.time)}(JST)</p></div>`;
            if (animeList) {
                animeList.appendChild(animeItemn);
            } else {
                console.error('Anime list element not found');
            }
        });
    } catch (error) {
        console.error('Failed to fetch anime data:', error);
    }
}

document.addEventListener('DOMContentLoaded', logAnimes); // Ensure DOM is loaded before running the function

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const clockDisplay = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').innerText = clockDisplay;
}

function updateClockEverySecond() {
    updateClock();
    setInterval(updateClock, 1000);
}

updateClockEverySecond();

function formatDate() {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const date = new Date();
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();

    // Determine the suffix for the day
    let daySuffix;
    if (day % 10 === 1 && day !== 11) {
        daySuffix = "st";
    } else if (day % 10 === 2 && day !== 12) {
        daySuffix = "nd";
    } else if (day % 10 === 3 && day !== 13) {
        daySuffix = "rd";
    } else {
        daySuffix = "th";
    }

    return `${month} ${day}${daySuffix}, ${dayOfWeek}`;
}

console.log(formatDate());
const list = document.querySelector('.list');
if (list) {
    list.innerHTML = formatDate();
} else {
    console.error('List element not found');
}

// $(".custom-carousel").owlCarousel({
//     autoWidth: true,
//     loop: true
//   });
//   $(document).ready(function () {
//     $(".custom-carousel .item").click(function () {
//       $(".custom-carousel .item").not($(this)).removeClass("active");
//       $(this).toggleClass("active");
//     });
//   });
