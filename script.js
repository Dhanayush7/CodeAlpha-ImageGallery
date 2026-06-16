const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("themeToggle");
const imageUpload = document.getElementById("imageUpload");

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");
const downloadBtn = document.getElementById("downloadBtn");
const favoriteBtn = document.getElementById("favoriteBtn");

let images = [];
let currentCategory = "all";
let currentImage = null;

/* =========================
   LOAD JSON DATA
========================= */

async function loadImages() {
    try {
        const response = await fetch("images.json");
        images = await response.json();

        renderImages(images);
    } catch (error) {
        console.error("Error loading images:", error);
    }
}

/* =========================
   RENDER IMAGES
========================= */

function renderImages(imageArray) {

    gallery.innerHTML = "";

    imageArray.forEach(image => {

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${image.url}" alt="${image.title}" class="gallery-image">

            <div class="card-content">

                <div class="card-title">
                    ${image.title}
                </div>

                <div class="card-category">
                    ${image.category}
                </div>

                <div class="card-actions">

                    <button class="like-btn" onclick="toggleFavorite('${image.id}')">
                        ❤️
                    </button>

                    <button class="download-btn" onclick="downloadImage('${image.url}')">
                        ⬇ Download
                    </button>

                </div>

            </div>
        `;

        card.querySelector("img").addEventListener("click", () => {
            openModal(image.url);
        });

        gallery.appendChild(card);
    });
}

/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase();

    const filtered = images.filter(image =>
        image.title.toLowerCase().includes(value)
    );

    renderImages(filtered);
});

/* =========================
   FILTERS
========================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelector(".filter-btn.active")
            .classList.remove("active");

        button.classList.add("active");

        currentCategory = button.dataset.category;

        if (currentCategory === "all") {
            renderImages(images);
            return;
        }

        const filtered = images.filter(
            image => image.category === currentCategory
        );

        renderImages(filtered);
    });
});

/* =========================
   DARK MODE
========================= */

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggle.innerHTML = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.innerHTML = "🌙";
        localStorage.setItem("theme", "light");
    }
});

window.addEventListener("load", () => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeToggle.innerHTML = "☀️";
    }
});

/* =========================
   IMAGE UPLOAD
========================= */

imageUpload.addEventListener("change", event => {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        const uploadedImage = {
            id: Date.now().toString(),
            title: "Uploaded Image",
            category: "custom",
            url: e.target.result
        };

        images.unshift(uploadedImage);

        renderImages(images);
    };

    reader.readAsDataURL(file);
});

/* =========================
   MODAL
========================= */

function openModal(imageSrc) {

    currentImage = imageSrc;

    modal.style.display = "block";

    modalImage.src = imageSrc;
}

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", e => {

    if (e.target === modal) {
        modal.style.display = "none";
    }
});

/* =========================
   DOWNLOAD IMAGE
========================= */

function downloadImage(url) {

    const a = document.createElement("a");

    a.href = url;

    a.download = "image";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
}

downloadBtn.addEventListener("click", () => {

    if (currentImage) {
        downloadImage(currentImage);
    }
});

/* =========================
   FAVORITES
========================= */

function toggleFavorite(id) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(id)) {

        favorites = favorites.filter(
            item => item !== id
        );

    } else {

        favorites.push(id);
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
}

/* =========================
   MODAL FAVORITE BUTTON
========================= */

favoriteBtn.addEventListener("click", () => {

    alert(
        "Use heart buttons on cards to save favorites."
    );
});

/* =========================
   INFINITE SCROLL
========================= */

window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;

    const windowHeight = window.innerHeight;

    const documentHeight =
        document.documentElement.scrollHeight;

    if (
        scrollTop + windowHeight >=
        documentHeight - 50
    ) {

        console.log("Reached bottom");
    }
});

/* =========================
   START APP
========================= */

loadImages();