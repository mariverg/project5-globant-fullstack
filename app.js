const apiKey = 'Wl5Q58j-nnw2EdgAsWBYfQt8imhnoe1HHBmFM4RADMo';
const apiUrl = 'https://api.unsplash.com/photos?per_page=30';
const searchUrl = 'https://api.unsplash.com/search/photos?per_page=30';
const gallery = document.getElementById('gallery');
const favoritesGallery = document.getElementById('favoritesGallery');
let photos = []; // Almacenará las fotos actuales

// Cargar imágenes al cargar la página
window.onload = () => {
    fetchPhotos();
    displayFavorites(); // Mostrar las fotos favoritas guardadas al cargar
};

//Función para obtener imágenes de Unsplash
function fetchPhotos(query = '') {
    const url = query ? `${searchUrl}&query=${query}&client_id=${apiKey}` : `${apiUrl}&client_id=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            photos = query ? data.results : data; // Guardar fotos globalmente
            displayPhotos(photos);
        })
        .catch(error => console.error('Error fetching photos:', error));
}
        function fetchPhotos(query = '') {
            const accessToken = localStorage.getItem('access_token'); // Recupera el token de OAuth 2.0 si el usuario ha iniciado sesión
            const url = query ? `${searchUrl}&query=${query}` : apiUrl;
        
            const headers = accessToken ? {
                Authorization: `Bearer ${accessToken}` // Usa el token si el usuario está autenticado
            } : {
                Authorization: `Client-ID ${apiKey}` // Usa la apiKey para peticiones públicas si no está autenticado
            };
        
            fetch(url, { headers })
                .then(response => response.json())
                .then(data => {
                    photos = query ? data.results : data; // Guardar fotos globalmente
                    displayPhotos(photos);
                })
                .catch(error => console.error('Error fetching photos:', error));
        }
        
// Función para mostrar las imágenes en la galería principal
function displayPhotos(photos) {
    gallery.innerHTML = ''; // Limpiar galería

    photos.forEach(photo => {
        const photoContainer = document.createElement('div');
        photoContainer.classList.add('gallery-item');

        const img = document.createElement('img');
        img.src = photo.urls.small;
        img.alt = photo.alt_description || 'Unsplash Image';
        // Crear ícono de corazón
        const favIcon = document.createElement('i');
        favIcon.classList.add('fa-heart', 'fa-2x', isFavorite(photo.id) ? 'fas' : 'far'); // fas es para el corazón lleno, far para vacío
        favIcon.style.color = isFavorite(photo.id) ? 'red' : 'white'; // Color del corazón

        // Añadir el evento de clic al ícono
        favIcon.addEventListener('click', () => toggleFavorite(photo.id, favIcon));

        // Añadir imagen e ícono de corazón al contenedor
        photoContainer.appendChild(img);
        photoContainer.appendChild(favIcon);

        // Añadir el contenedor a la galería
        gallery.appendChild(photoContainer);
    });
}

// Buscar imágenes al hacer clic en el botón de búsqueda
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('search').value;
    fetchPhotos(query);
});

// Buscar imágenes al presionar Enter en el campo de búsqueda
document.getElementById('search').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const query = document.getElementById('search').value;
        fetchPhotos(query);
    }
});

// Función para verificar si una foto es favorita
function isFavorite(photoId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(photoId);
}

    // Función para alternar el estado de favorito (corazón lleno o vacío)
function toggleFavorite(photoId, icon) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.includes(photoId)) {
        favorites = favorites.filter(id => id !== photoId);
        icon.classList.remove('fas');
        icon.classList.add('far'); // Cambiar a corazón vacío
        icon.style.color = 'white';
        removeFavoriteFromGallery(photoId);
    } else {
        favorites.push(photoId);
        icon.classList.remove('far');
        icon.classList.add('fas'); // Cambiar a corazón lleno
        icon.style.color = 'red';
        addFavoriteToGallery(photoId);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
}
// Añadir una foto favorita a la galería de favoritos
function addFavoriteToGallery(photoId) {
    const photo = photos.find(p => p.id === photoId);

    if (photo) {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        const img = document.createElement('img');
        img.src = photo.urls.small;
        img.alt = photo.alt_description || 'Unsplash Image';

        galleryItem.appendChild(img);
        favoritesGallery.appendChild(galleryItem);
    }
}

// Mostrar todas las fotos favoritas guardadas en `localStorage`
function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesGallery.innerHTML = ''; // Limpiar galería de favoritos

    favorites.forEach(photoId => {
        addFavoriteToGallery(photoId);
    });
}

// Remover una foto favorita de la galería de favoritos
function removeFavoriteFromGallery(photoId) {
    const galleryItems = favoritesGallery.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img.src.includes(photoId)) {
            favoritesGallery.removeChild(item);
        }
    });
}

// Mostrar la galería de favoritos
document.getElementById('viewFavoritesBtn').addEventListener('click', () => {
    document.getElementById('gallery').style.display = 'none';
    document.getElementById('favorites').style.display = 'block';
});

// Volver a la galería principal
document.getElementById('backToGalleryBtn').addEventListener('click', () => {
    document.getElementById('favorites').style.display = 'none';
    document.getElementById('gallery').style.display = 'block';
});
