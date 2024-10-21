const apiKey = '667144';
const apiUrl = 'https://api.unsplash.com/photos';
const searchUrl = 'https://api.unsplash.com/search/photos';

document.getElementById('searchBtn').addEventListener('click', searchPhotos);

function searchPhotos() {
    const query = document.getElementById('search').value;
    fetch(`${searchUrl}?query=${query}&client_id=${apiKey}`)
        .then(response => response.json())
        .then(data => displayPhotos(data.results))
        .catch(error => console.error(error));
}

function displayPhotos(photos) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    photos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.urls.small;
        gallery.appendChild(img);
    });
}

const authUrl = 'https://unsplash.com/oauth/authorize';
const clientId = 'TU_CLIENT_ID_DE_UNSPLASH';
const redirectUri = 'http://localhost:3000';  // Asegúrate de configurar correctamente

document.getElementById('loginBtn').addEventListener('click', () => {
    window.location.href = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=public+write_likes`;
});

function addToFavorites(photoId) {
    const token = localStorage.getItem('access_token');
    fetch(`https://api.unsplash.com/photos/${photoId}/like`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
      .then(data => console.log('Photo added to favorites:', data))
      .catch(error => console.error(error));
}
