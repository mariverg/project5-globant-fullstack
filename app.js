const apiKey = 'Wl5Q58j-nnw2EdgAsWBYfQt8imhnoe1HHBmFM4RADMo';
const apiUrl = 'https://api.unsplash.com/photos?per_page=30'; // Aquí pedimos 30 imágenes por página
const searchUrl = 'https://api.unsplash.com/search/photos?per_page=30'
const gallery = document.getElementById('gallery');

// Cargar imágenes al cargar la página
window.onload = () => {
    fetchPhotos();
};

// Función para obtener imágenes de Unsplash
function fetchPhotos(query = '') {
    const url = query ? `${searchUrl}?query=${query}&client_id=${apiKey}` : `${apiUrl}?client_id=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const photos = query ? data.results : data;
            displayPhotos(photos);
        })
        .catch(error => console.error(error));
}

// Función para mostrar las imágenes
function displayPhotos(photos) {
    gallery.innerHTML = ''; // Limpiar el contenido anterior
    photos.forEach(photo => {
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('gallery-item');

        const img = document.createElement('img');
        img.src = photo.urls.small;
        img.alt = photo.alt_description || 'Unsplash Image';
        
        const title = document.createElement('h3');
        title.textContent = photo.description || 'Untitled';

        // Botón para marcar como favorito
        const favBtn = document.createElement('button');
        favBtn.textContent = isFavorite(photo.id) ? 'Remove from Favorites' : 'Add to Favorites';
        favBtn.addEventListener('click', () => toggleFavorite(photo.id, favBtn));

        // Añadir todo al contenedor
        photoContainer.appendChild(img);
        photoContainer.appendChild(title);
        photoContainer.appendChild(favBtn);

        // Añadir el contenedor a la galería
        gallery.appendChild(photoContainer);
    });
}

// Función para buscar imágenes
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('search').value;
    fetchPhotos(query);
});
// Función para hacer la búsqueda
function fetchPhotos(query) {
    const url = query ? `${searchUrl}&query=${query}&client_id=${apiKey}` : `${apiUrl}&client_id=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => displayPhotos(query ? data.results : data)) // Si es búsqueda, usa "results", si no, usa el array directamente.
        .catch(error => console.error(error));
}

const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');

// Ejecutar búsqueda al hacer clic en el botón
searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    fetchPhotos(query);
});

// Ejecutar búsqueda al presionar "Enter"
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value;
        fetchPhotos(query);
    }
});


// Funciones de favoritos usando localStorage
function toggleFavorite(photoId, button) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.includes(photoId)) {
        favorites = favorites.filter(id => id !== photoId);
        button.textContent = 'Add to Favorites';
        removeFavoriteFromGallery(photoId);
    } else {
        favorites.push(photoId);
        button.textContent = 'Remove from Favorites';
        addFavoriteToGallery(photoId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorite(photoId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(photoId);
}

function addFavoriteToGallery(photoId) {
    const favoritesGallery = document.getElementById('favoritesGallery');
    const photo = photos.find(p => p.id === photoId); // Asumiendo que tienes acceso a las fotos

    if (photo) {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        const img = document.createElement('img');
        img.src = photo.urls.small; // O la URL que prefieras
        img.alt = '';

        galleryItem.appendChild(img);
        favoritesGallery.appendChild(galleryItem);
    }
}

function removeFavoriteFromGallery(photoId) {
    const favoritesGallery = document.getElementById('favoritesGallery');
    const items = favoritesGallery.querySelectorAll('.gallery-item');

    items.forEach(item => {
        const img = item.querySelector('img');
        if (img && img.src.includes(photoId)) { // Verifica que la imagen coincide
            favoritesGallery.removeChild(item);
        }
    });
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(photoId => {
        addFavoriteToGallery(photoId);
    });
}

document.getElementById('viewFavoritesBtn').addEventListener('click', () => {
    document.getElementById('gallery').style.display = 'none'; // Oculta la galería principal
    document.getElementById('favorites').style.display = 'block'; // Muestra la sección de favoritos
});

document.getElementById('backToGalleryBtn').addEventListener('click', () => {
    document.getElementById('favorites').style.display = 'none'; // Oculta la sección de favoritos
    document.getElementById('gallery').style.display = 'block'; // Muestra la galería principal
});


// Llama a esta función al final de tu script o cuando cargues la página
displayFavorites();
