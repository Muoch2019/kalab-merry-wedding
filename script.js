
// ===================================
// KALAB & MERRY WEDDING WEBSITE
// CHANGE THESE DETAILS FOR THE EVENT
// ===================================

const wedding = {
    date: "2026-12-25",
    startTime: "10:00",
    endTime: "18:00",
    venue: "Add your exact wedding venue and address here, Addis Ababa, Ethiopia",
    mapQuery: "Addis Ababa, Ethiopia"
};

// OPEN INVITATION

function openInvitation() {
    document.getElementById("opening").classList.add("hide");
}

// MUSIC PLAYER

const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");
const musicLabel = document.getElementById("musicLabel");
const volumeButton = document.getElementById("volumeButton");

musicButton.addEventListener("click", async () => {
    if (music.paused) {
        try {
            await music.play();
            musicButton.textContent = "Ⅱ";
            musicLabel.textContent = "Now playing";
        } catch (error) {
            musicLabel.textContent = "Add your music file";
        }
    } else {
        music.pause();
        musicButton.textContent = "▶";
        musicLabel.textContent = "Play our song";
    }
});

volumeButton.addEventListener("click", () => {
    music.muted = !music.muted;
    volumeButton.textContent = music.muted ? "🔇" : "🔊";
});

// PHOTO SLIDERS

const sliders = {
    outdoor: 0,
    indoor: 0
};

function updateSlider(type) {
    const track = document.getElementById(type + "Track");
    const images = track.querySelectorAll("img");
    const dotsContainer = document.getElementById(type + "Dots");

    track.style.transform = `translateX(-${sliders[type] * 100}%)`;

    dotsContainer.innerHTML = "";

    images.forEach((image, index) => {
        const dot = document.createElement("span");
        dot.className = "dot" + (index === sliders[type] ? " active" : "");
        dot.addEventListener("click", () => {
            sliders[type] = index;
            updateSlider(type);
        });
        dotsContainer.appendChild(dot);
    });
}

function moveSlide(type, direction) {
    const images = document.querySelectorAll("#" + type + "Track img");

    sliders[type] += direction;

    if (sliders[type] >= images.length) {
        sliders[type] = 0;
    }

    if (sliders[type] < 0) {
        sliders[type] = images.length - 1;
    }

    updateSlider(type);
}

updateSlider("outdoor");
updateSlider("indoor");

// LIGHTBOX

let lightboxType = "outdoor";
let lightboxIndex = 0;

document.querySelectorAll(".slider-track img").forEach(image => {
    image.addEventListener("click", () => {
        const track = image.parentElement;
        lightboxType = track.id.replace("Track", "");
        lightboxIndex = Array.from(track.children).indexOf(image);
        showLightbox();
    });
});

function showLightbox() {
    const images = document.querySelectorAll("#" + lightboxType + "Track img");

    document.getElementById("lightboxImage").src = images[lightboxIndex].src;
    document.getElementById("lightbox").classList.add("show");
}

function changeLightbox(direction) {
    const images = document.querySelectorAll("#" + lightboxType + "Track img");

    lightboxIndex = (lightboxIndex + direction + images.length) % images.length;

    showLightbox();
}

function closeLightbox() {
    document.getElementById("lightbox").classList.remove("show");
}

document.getElementById("lightbox").addEventListener("click", event => {
    if (event.target.id === "lightbox") {
        closeLightbox();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeLightbox();
});

// LOCATION

function getDirections() {
    const url = "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(wedding.mapQuery);

    window.open(url, "_blank");
}

async function copyAddress() {
    try {
        await navigator.clipboard.writeText(wedding.venue);
        alert("Wedding address copied!");
    } catch (error) {
        alert("Please copy the address manually: " + wedding.venue);
    }
}

// GOOGLE CALENDAR

function addGoogleCalendar() {
    const start = wedding.date.replaceAll("-", "") +
        "T" + wedding.startTime.replace(":", "") + "00";

    const end = wedding.date.replaceAll("-", "") +
        "T" + wedding.endTime.replace(":", "") + "00";

    const url = new URL("https://calendar.google.com/calendar/render");

    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", "Kalab & Merry Wedding");
    url.searchParams.set("dates", start + "/" + end);
    url.searchParams.set("location", wedding.venue);
    url.searchParams.set("details", "Join us to celebrate Kalab & Merry!");

    window.open(url.toString(), "_blank");
}

// APPLE / OTHER CALENDAR DOWNLOAD

function downloadCalendar() {
    const date = wedding.date.replaceAll("-", "");

    const start = date + "T" + wedding.startTime.replace(":", "") + "00";
    const end = date + "T" + wedding.endTime.replace(":", "") + "00";

    const calendar = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Kalab and Merry//Wedding//EN",
        "BEGIN:VEVENT",
        "UID:kalab-merry-wedding@example.com",
        "DTSTAMP:20261105T000000Z",
        "DTSTART:" + start,
        "DTEND:" + end,
        "SUMMARY:Kalab & Merry Wedding",
        "LOCATION:" + wedding.venue.replaceAll(",", "\\,"),
        "DESCRIPTION:Join us to celebrate Kalab and Merry!",
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([calendar], {
        type: "text/calendar;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Kalab-Merry-Wedding.ics";
    link.click();

    URL.revokeObjectURL(url);
}

// RSVP FORM

document.getElementById("rsvpForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("guestName").value.trim();
    const attendance = document.getElementById("attendance").value;

    if (!name || !attendance) return;

    const confirmation = document.getElementById("rsvpConfirmation");

    confirmation.textContent =
        "Thank you, " + name + "! Your response is ready. " +
        "Please contact the couple to confirm your RSVP.";

    event.target.reset();
});

// FAVORITES

function toggleFavorite() {
    const button = document.getElementById("favoriteButton");
    const saved = localStorage.getItem("kalabMerryFavorite") === "true";

    localStorage.setItem("kalabMerryFavorite", String(!saved));

    button.textContent = saved
        ? "♡ ADD TO FAVORITES"
        : "♥ ADDED TO FAVORITES";
}

if (localStorage.getItem("kalabMerryFavorite") === "true") {
    document.getElementById("favoriteButton").textContent =
        "♥ ADDED TO FAVORITES";
}

// SHARE

async function shareEvent() {
    const shareData = {
        title: "Kalab & Merry Wedding",
        text: "You are invited to celebrate Kalab & Merry's wedding!",
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            // Sharing was cancelled or unavailable.
        }
    } else {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("Invitation link copied!");
        } catch (error) {
            alert("Copy the website address from your browser.");
        }
    }
}


// Wedding countdown
const weddingDate = new Date("2026-12-25T10:00:00+03:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
        document.querySelector(".countdown-section").innerHTML =
            "<h2>Today is our special day! ❤️</h2>";
        clearInterval(countdownTimer);
        return;
    }

    document.getElementById("days").textContent =
        Math.floor(distance / (1000 * 60 * 60 * 24));

    document.getElementById("hours").textContent =
        Math.floor((distance / (1000 * 60 * 60)) % 24);

    document.getElementById("minutes").textContent =
        Math.floor((distance / (1000 * 60)) % 60);

    document.getElementById("seconds").textContent =
        Math.floor((distance / 1000) % 60);
}

updateCountdown();
const countdownTimer = setInterval(updateCountdown, 1000);