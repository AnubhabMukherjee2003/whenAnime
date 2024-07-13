

const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
// const d = new Date();
// let day = weekday[d.getDay()].toLowerCase(); // Convert day to lowercase for API filter
// const api = `https://api.jikan.moe/v4/schedules?filter=${day}`;

// console.log(api);

async function logAnimes(day) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/schedules?filter=${day}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const animes = await response.json();
        const animeList = document.querySelector(`.${day} .anime`); // Use querySelector to select the class
        console.log(animes.data);

        function removeDuplicates(arr) {
            let a = [];
            a.push(arr[0]);
            arr.forEach(element => {
                
                if(element.broadcast.time==null){
                    element.broadcast.time="00:00"
                }



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
            animeItemn.style.backgroundImage=`url("${element.images.jpg.image_url}")`
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

// document.addEventListener('DOMContentLoaded', logAnimes(day)); // Ensure DOM is loaded before running the function
weekday.forEach((element,index) => {
    setTimeout(() => {
        logAnimes(element);
    }, index* 700);
});