console.log("Masjid An-Nadhin");

// ==========================================
// DEFAULT LOKASI
// ==========================================

let city = "Depok";
let country = "Indonesia";

let prayerTimes = {};
let nextPrayer = "";

// ==========================================
// AMBIL JADWAL SHOLAT
// ==========================================

async function getPrayerTimes() {

    try {

        const response = await fetch(
            `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=11`
        );

        const result = await response.json();

        const data = result.data;

        prayerTimes = {
            Subuh: timingsToMinutes(data.timings.Fajr),
            Dzuhur: timingsToMinutes(data.timings.Dhuhr),
            Ashar: timingsToMinutes(data.timings.Asr),
            Maghrib: timingsToMinutes(data.timings.Maghrib),
            Isya: timingsToMinutes(data.timings.Isha)
        };

        // ======================
        // LOKASI
        // ======================

        document.getElementById("location-name").textContent =
            `${city}, ${country}`;

        // ======================
        // TANGGAL
        // ======================

        document.getElementById("today-date").innerHTML =

            `${data.date.gregorian.weekday.en},
            ${data.date.gregorian.date}
            •
            ${data.date.hijri.day}
            ${data.date.hijri.month.en}
            ${data.date.hijri.year} H`;

        // ======================
        // JAM SHOLAT
        // ======================

        document.getElementById("fajr-time").textContent = data.timings.Fajr;
        document.getElementById("dhuhr-time").textContent = data.timings.Dhuhr;
        document.getElementById("asr-time").textContent = data.timings.Asr;
        document.getElementById("maghrib-time").textContent = data.timings.Maghrib;
        document.getElementById("isha-time").textContent = data.timings.Isha;

        updateCountdown();

        setInterval(updateCountdown,1000);

    }

    catch(error){

        console.log(error);

    }

}

// ==========================================
// JAM -> MENIT
// ==========================================

function timingsToMinutes(time){

    let split = time.split(":");

    return parseInt(split[0])*60 + parseInt(split[1]);

}

// ==========================================
// COUNTDOWN
// ==========================================

function updateCountdown(){

    const now = new Date();

    const currentMinutes =
        now.getHours()*60 +
        now.getMinutes();

    const prayerList = [

        {
            name:"Subuh",
            time:prayerTimes.Subuh,
            id:"subuh"
        },

        {
            name:"Dzuhur",
            time:prayerTimes.Dzuhur,
            id:"dzuhur"
        },

        {
            name:"Ashar",
            time:prayerTimes.Ashar,
            id:"ashar"
        },

        {
            name:"Maghrib",
            time:prayerTimes.Maghrib,
            id:"maghrib"
        },

        {
            name:"Isya",
            time:prayerTimes.Isya,
            id:"isya"
        }

    ];

    prayerList.forEach(item=>{

        document.getElementById(item.id).classList.remove("active");

    });

    let selected = prayerList.find(p=> currentMinutes < p.time);

    if(!selected){

        selected = prayerList[0];

        selected.time += 1440;

    }

    document.getElementById(selected.id).classList.add("active");

    const diff = selected.time-currentMinutes;

    const hour = Math.floor(diff/60);

    const minute = diff%60;

    document.getElementById("next-prayer-text").innerHTML =

        `Menuju <b>${selected.name}</b> • ${hour} Jam ${minute} Menit Lagi`;

}

// ==========================================
// GEOLOCATION
// ==========================================

if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition(

        ()=>{

            getPrayerTimes();

        },

        ()=>{

            getPrayerTimes();

        }

    );

}else{

    getPrayerTimes();

}
// ==========================================
// NAVBAR SCROLL
// ==========================================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll",()=>{

    if(window.scrollY > 80){

        navbar.classList.add("scrolled");

    }

    else{

        navbar.classList.remove("scrolled");

    }

});
// ==========================================
// SCROLL REVEAL
// ==========================================

const reveals = document.querySelectorAll(".reveal");

function revealSection(){

    const trigger = window.innerHeight * 0.85;

    reveals.forEach(section=>{

        const top = section.getBoundingClientRect().top;

        if(top < trigger){

            section.classList.add("active");

        }

    });

}

window.addEventListener("scroll",revealSection);

revealSection();

// ==========================================
// GALLERY CAROUSEL
// ==========================================

const galleryCards =
document.querySelectorAll(".gallery-card");

const dots =
document.querySelectorAll(".gallery-dots span");

const nextBtn =
document.getElementById("next-gallery");

const prevBtn =
document.getElementById("prev-gallery");

let current = 1;

// =======================

function showGallery(index){

    galleryCards.forEach(card=>{

        card.classList.remove("active");

    });

    dots.forEach(dot=>{

        dot.classList.remove("active");

    });

    galleryCards[index].classList.add("active");

    dots[index].classList.add("active");

}

// =======================

nextBtn.onclick=()=>{

    current++;

    if(current>=galleryCards.length){

        current=0;

    }

    showGallery(current);

}

// =======================

prevBtn.onclick=()=>{

    current--;

    if(current<0){

        current=galleryCards.length-1;

    }

    showGallery(current);

}

// =======================

dots.forEach((dot,index)=>{

    dot.onclick=()=>{

        current=index;

        showGallery(current);

    }

});

// =======================
// AUTO SLIDE
// =======================

let autoSlide = setInterval(()=>{

    nextBtn.click();

},5000);

// =======================
// STOP SAAT HOVER
// =======================

const gallery =
document.querySelector(".gallery");

gallery.addEventListener("mouseenter",()=>{

    clearInterval(autoSlide);

});

gallery.addEventListener("mouseleave",()=>{

    autoSlide = setInterval(()=>{

        nextBtn.click();

    },5000);

});
