const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("themeToggle");
const imageUpload = document.getElementById("imageUpload");

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");
const downloadBtn = document.getElementById("downloadBtn");

const bookmarkGallery =
document.getElementById("bookmarkGallery");

const suggestionContainer =
document.getElementById("suggestionContainer");
const relatedImages =
document.getElementById(
    "relatedImages"
);
let images = [];
let currentImage = null;

/* =========================
   LOAD IMAGES
========================= */

async function loadImages() {

    try {

        const response =
        await fetch("images.json");

        images =
        await response.json();

        renderImages(images);

        renderBookmarks();

    } catch(error){

        console.log(error);

    }
}

/* =========================
   RENDER IMAGES
========================= */

function renderImages(imageArray){

    gallery.innerHTML = "";

    imageArray.forEach(image => {

        const card =
        document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `

        <img
            src="${image.url}"
            alt="${image.title}"
        >

        <div class="card-content">

            <div class="card-title">
                ${image.title}
            </div>

            <div class="card-category">
                ${image.category}
            </div>

            <div class="card-actions">

                <button
                class="like-btn"
                onclick="toggleFavorite('${image.id}')">

                    ❤️

                </button>

                <button
                class="download-btn"
                onclick="downloadImage('${image.url}')">

                    ⬇ Download

                </button>

            </div>

        </div>
        `;

        card.querySelector("img")
        .addEventListener("click", () => {

            openModal(image);

        });

        gallery.appendChild(card);

    });

}

/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", () => {

    const value =
    searchInput.value.toLowerCase();

    const filtered =
    images.filter(image =>

        image.title
        .toLowerCase()
        .includes(value)

    );

    renderImages(filtered);

showRecommendations(
    currentCategory
);

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

        const category =
        button.dataset.category;

        if(category === "all"){

            renderImages(images);

            return;

        }

        const filtered =
        images.filter(image =>

            image.category === category

        );

        renderImages(filtered);

    });

});

/* =========================
   DARK MODE
========================= */

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem(
            "theme",
            "dark"
        );

        themeToggle.innerHTML = "☀️";

    }else{

        localStorage.setItem(
            "theme",
            "light"
        );

        themeToggle.innerHTML = "🌙";

    }

});

window.addEventListener("load", () => {

    const savedTheme =
    localStorage.getItem("theme");

    if(savedTheme === "dark"){

        document.body.classList.add("dark");

        themeToggle.innerHTML = "☀️";

    }

});

/* =========================
   IMAGE UPLOAD
========================= */

imageUpload.addEventListener(
"change",
event => {

    const file =
    event.target.files[0];

    if(!file) return;

    const reader =
    new FileReader();

    reader.onload = e => {

        images.unshift({

            id: Date.now().toString(),

            title: "Uploaded Image",

            category: "custom",

            url: e.target.result

        });

        renderImages(images);

    };

    reader.readAsDataURL(file);

});

/* =========================
   MODAL
========================= */

function openModal(imageObj){

    currentImage =
    imageObj.url;

    modal.style.display =
    "block";

    modalImage.src =
    imageObj.url;

    showRelatedImages(

        imageObj.category,

        imageObj.id

    );
}

function showRelatedImages(
    category,
    currentId
){

}
closeModal.addEventListener(
"click",
() => {

    modal.style.display =
    "none";

});

window.addEventListener(
"click",
e => {

    if(e.target === modal){

        modal.style.display =
        "none";

    }

});

function showRelatedImages(
    category,
    currentId
){

    if(!relatedImages) return;

    relatedImages.innerHTML = "";

    const related =
    images.filter(img =>

        img.category === category &&
        img.id !== currentId

    ).slice(0,8);

    related.forEach(img => {

        const image =
        document.createElement("img");

        image.src = img.url;

        image.alt = img.title;

        image.addEventListener(
            "click",
            () => {

                openModal(img);

            }
        );

        relatedImages.appendChild(
            image
        );

    });

}

/* =========================
   SUGGESTED IMAGES
========================= */

function showSuggestedImages(
category,
currentId
){

    if(!suggestionContainer)
    return;

    suggestionContainer.innerHTML =
    "";

    const suggestions =
    images.filter(img =>

        img.category === category &&
        img.id !== currentId

    ).slice(0,4);

    suggestions.forEach(img => {

        const image =
        document.createElement("img");

        image.src = img.url;

        image.addEventListener(
            "click",
            () => openModal(img)
        );

        suggestionContainer
        .appendChild(image);

    });

}

/* =========================
   DOWNLOAD IMAGE
========================= */

function downloadImage(url){

    const a =
    document.createElement("a");

    a.href = url;

    a.download = "image";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

}

downloadBtn.addEventListener(
"click",
() => {

    if(currentImage){

        downloadImage(
            currentImage
        );

    }

});

/* =========================
   FAVORITES
========================= */

function toggleFavorite(id){

    let favorites =
    JSON.parse(
        localStorage.getItem(
            "favorites"
        )
    ) || [];

    if(favorites.includes(id)){

        favorites =
        favorites.filter(
            item => item !== id
        );

    }else{

        favorites.push(id);

    }

    localStorage.setItem(

        "favorites",

        JSON.stringify(
            favorites
        )

    );

    renderBookmarks();

}

/* =========================
   BOOKMARK GALLERY
========================= */

function renderBookmarks(){

    if(!bookmarkGallery)
    return;

    bookmarkGallery.innerHTML =
    "";

    const favorites =
    JSON.parse(
        localStorage.getItem(
            "favorites"
        )
    ) || [];

    const bookmarkedImages =
    images.filter(img =>

        favorites.includes(img.id)

    );

    bookmarkedImages.forEach(img => {

        const image =
        document.createElement("img");

        image.src = img.url;

        image.alt = img.title;

        bookmarkGallery
        .appendChild(image);

    });

}

/* =========================
   POPULAR CATEGORY CARDS
========================= */

document
.querySelectorAll(".cat-card")
.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            const category =
            card.dataset.category;

            const filtered =
            images.filter(img =>

                img.category ===
                category

            );

            renderImages(filtered);

            window.scrollTo({

                top:300,

                behavior:"smooth"

            });

        }
    );

});

/* =========================
   START APP
========================= */

loadImages();

function showRecommendations(category){

    const container =
    document.getElementById(
        "recommendedGallery"
    );

    if(!container) return;

    const recommendations =
    images.filter(img =>
        img.category === category
    );

    container.innerHTML = "";

    recommendations.forEach(img => {

        const card =
        document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            <img src="${img.url}">
        `;

        container.appendChild(card);

    });
}