
// ===========================================
// KALAB & MERRY WEDDING INVITATION
// ===========================================

// WEDDING DETAILS
const wedding = {
    date: "2026-12-25",
    startTime: "10:00",
    endTime: "18:00",
    venue: "Addis Ababa, Ethiopia",
    mapLink: "https://maps.app.goo.gl/63BLgmmkiew6v3W16"
};

// MUSIC ELEMENTS
const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");
const musicLabel = document.getElementById("musicLabel");
const volumeButton = document.getElementById("volumeButton");

// OPEN INVITATION
function openInvitation() {
    document.getElementById("opening").classList.add("hide");

    music.play()
        .then(() => {
            musicButton.textContent = "Ⅱ";
            musicLabel.textContent = "Now playing";
        })
        .catch(() => {
            musicLabel.textContent = "Tap to play our song";
        });
}

// MUSIC PLAYER
musicButton.addEventListener("click", async () => {
    if (music.paused) {
        try {
            await music.play();
        } catch (error) {
            musicLabel.textContent = "Check music file";
            console.error(error);
        }
    } else {
        music.pause();
    }
});

volumeButton.addEventListener("click", () => {
    music.muted = !music.muted;
    volumeButton.textContent = music.muted ? "🔇" : "🔊";
});

music.addEventListener("play", () => {
    musicButton.textContent = "Ⅱ";
    musicLabel.textContent = "Now playing";
});

music.addEventListener("pause", () => {
    musicButton.textContent = "▶";
    musicLabel.textContent = "Play our song";
});

// PHOTO SLIDERS
const sliders = { outdoor: 0, indoor: 0 };

function updateSlider(type) {
    const track = document.getElementById(type + "Track");
    const dotsContainer = document.getElementById(type + "Dots");

    if (!track || !dotsContainer) return;

    const IMAGES = track.querySelectorAll("img");
    if (!IMAGES.length) return;

    sliders[type] = Math.min(sliders[type], IMAGES.length - 1);
    track.style.transform = `translateX(-${sliders[type] * 100}%)`;
    dotsContainer.innerHTML = "";

    IMAGES.forEach((image, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "dot" +
            (index === sliders[type] ? " active" : "");

        dot.setAttribute(
            "aria-label",
            `Show ${type} photo ${index + 1}`
        );

        dot.addEventListener("click", () => {
            sliders[type] = index;
            updateSlider(type);
        });

        dotsContainer.appendChild(dot);
    });
}

function moveSlide(type, direction) {
    const track = document.getElementById(type + "Track");
    if (!track) return;

    const IMAGES = track.querySelectorAll("img");
    if (!IMAGES.length) return;

    sliders[type] =
        (sliders[type] + direction + IMAGES.length) % IMAGES.length;

    updateSlider(type);
}

updateSlider("outdoor");
updateSlider("indoor");

// LIGHTBOX
let lightboxType = "outdoor";
let lightboxIndex = 0;

document.querySelectorAll(".slider-track img").forEach((image) => {
    image.addEventListener("click", () => {
        const track = image.parentElement;

        lightboxType = track.id.replace("Track", "");
        lightboxIndex = Array.from(track.children).indexOf(image);

        showLightbox();
    });
});

function showLightbox() {
    const IMAGES = document.querySelectorAll(
        "#" + lightboxType + "Track img"
    );

    if (!IMAGES.length) return;

    document.getElementById("lightboxImage").src =
        IMAGES[lightboxIndex].src;

    document.getElementById("lightbox").classList.add("show");
    document.body.classList.add("lightbox-open");
}

function changeLightbox(direction) {
    const IMAGES = document.querySelectorAll(
        "#" + lightboxType + "Track img"
    );

    if (!IMAGES.length) return;

    lightboxIndex =
        (lightboxIndex + direction + IMAGES.length) % IMAGES.length;

    showLightbox();
}

function closeLightbox() {
    document.getElementById("lightbox").classList.remove("show");
    document.body.classList.remove("lightbox-open");
}

document.getElementById("lightbox").addEventListener("click", (event) => {
    if (event.target.id === "lightbox") {
        closeLightbox();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeLightbox();
    }
});

// LOCATION
function getDirections() {
    window.open(wedding.mapLink, "_blank", "noopener,noreferrer");
}

async function copyAddress() {
    try {
        await navigator.clipboard.writeText(wedding.venue);
        alert("Wedding address copied!");
    } catch (error) {
        alert("Please copy this address: " + wedding.venue);
    }
}

// CALENDAR
function eventDateTimeUTC(time) {
    const local = new Date(
        `${wedding.date}T${time}:00+03:00`
    );

    return local.toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
}

function addGoogleCalendar() {
    const start = eventDateTimeUTC(wedding.startTime);
    const end = eventDateTimeUTC(wedding.endTime);

    const url = new URL(
        "https://calendar.google.com/calendar/render"
    );

    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", "Kalab & Merry Wedding");
    url.searchParams.set("dates", `${start}/${end}`);
    url.searchParams.set("location", wedding.venue);
    url.searchParams.set(
        "details",
        "Join us to celebrate Kalab & Merry!"
    );

    window.open(url.toString(), "_blank", "noopener,noreferrer");
}

function downloadCalendar() {
    const start = eventDateTimeUTC(wedding.startTime);
    const end = eventDateTimeUTC(wedding.endTime);

    const stamp = new Date().toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");

    const escapeICS = (value) =>
        value.replace(/\\/g, "\\\\")
            .replace(/,/g, "\\,")
            .replace(/;/g, "\\;")
            .replace(/\n/g, "\\n");

    const calendar = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Kalab and Merry//Wedding Invitation//EN",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        "UID:kalab-merry-wedding-20261225@invitation",
        `DTSTAMP:${stamp}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        "SUMMARY:Kalab & Merry Wedding",
        `LOCATION:${escapeICS(wedding.venue)}`,
        "DESCRIPTION:Join us to celebrate Kalab and Merry!",
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob(
        [calendar],
        { type: "text/calendar;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Kalab-Merry-Wedding.ics";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

// FAVORITES
function toggleFavorite() {
    const button = document.getElementById("favoriteButton");

    const saved =
        localStorage.getItem("kalabMerryFavorite") === "true";

    localStorage.setItem(
        "kalabMerryFavorite",
        String(!saved)
    );

    button.textContent = saved
        ? "♡ ADD TO FAVORITES"
        : "♥ ADDED TO FAVORITES";
}

if (
    localStorage.getItem("kalabMerryFavorite") === "true"
) {
    document.getElementById("favoriteButton").textContent =
        "♥ ADDED TO FAVORITES";
}

// SHARE INVITATION
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
            // Sharing was cancelled.
        }
    } else {
        try {
            await navigator.clipboard.writeText(
                window.location.href
            );

            alert("Invitation link copied!");
        } catch (error) {
            alert("Copy the website address from your browser.");
        }
    }
}

// WEDDING COUNTDOWN
const weddingDate =
    new Date("2026-12-25T10:00:00+03:00").getTime();

let countdownTimer;

function updateCountdown() {
    const distance = weddingDate - Date.now();

    if (distance <= 0) {
        document.querySelector(".countdown-section").innerHTML =
            "<h2>Today is our special day! ❤️</h2>";

        if (countdownTimer) {
            clearInterval(countdownTimer);
        }

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
countdownTimer = setInterval(updateCountdown, 1000);
