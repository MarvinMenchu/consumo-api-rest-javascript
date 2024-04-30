const cabeceras = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'X-API-KEY': 'live_LIkBwXa9EkZFOxMrRimFlcmVTJfw7HIjVWVfJMJQEkPqLo8xVrm75wAgTXmahIXN'
}

const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
})
api.defaults.headers.common['x-api-key'] = 'live_LIkBwXa9EkZFOxMrRimFlcmVTJfw7HIjVWVfJMJQEkPqLo8xVrm75wAgTXmahIXN'


const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=3'
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites'
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`  
const API_URL_UPLOAD= 'https://api.thecatapi.com/v1/images/upload'

const spanError = document.getElementById('error')

// fetch(API_URL)
//     .then(response => response.json())
//     .then(data => {
//         const img = document.querySelector('img')
//         img.src = data[0].url
//     })

async function loadRandomMichi(){
    // usar la api con async await con try catch
    try {
        const response = await fetch(API_URL_RANDOM, {
            headers: cabeceras
        })
        const data = await response.json()
        console.log(data)
        if (response.status !== 200) {
            spanError.textContent = 'Hubo un error al cargar las imágenes' + response.status
        } else {
            // console.log('RANDOM MICHI')
            // console.log(data)
            const img1 = document.getElementById('img1')
            const img2 = document.getElementById('img2')
            const img3 = document.getElementById('img3')
            const btn1 = document.getElementById('btn1')
            const btn2 = document.getElementById('btn2')
            const btn3 = document.getElementById('btn3')

            img1.src = data[0].url
            img2.src = data[1].url
            img3.src = data[2].url

            btn1.onclick = () => saveFavouriteMichi(data[0].id)
            btn2.onclick = () => saveFavouriteMichi(data[1].id)
            btn3.onclick = () => saveFavouriteMichi(data[2].id)
        }
    } catch (error) {
        spanError.textContent = 'Hubo un error al cargar las imágenes'
        console.error(error)
    } finally {
        // console.log('Lindos gatitos')
    }
}

async function loadFavouriteMichis(){
    // usar la api con async await con try catch
        const response = await fetch(API_URL_FAVORITES, {
            headers: cabeceras
        })
        const data = await response.json()
        console.log('FAVORITES MICHI', data)

        if (response.status !== 200) {
            console.log('Hubo un error al cargar las imágenes' + response.status + data.message)
            spanError.innerHTML = 'Hubo un error al cargar las imágenes' + response.status + data.message
        } else {
            const section = document.getElementById('favoritesMichis')
            section.innerHTML = ''
            // const h2 = document.createElement('h2')
            // const h2Text = document.createTextNode('Michis favoritos')
            // h2.appendChild(h2Text)
            // section.appendChild(h2)

            data.forEach(michi => {
                //michi.image.url
                
                const article = document.createElement('article')
                const img = document.createElement('img')
                const button = document.createElement('button')
                const btnText = document.createTextNode('Sacar al michi de favoritos')

                img.classList.add('rounded-lg', 'w-40', 'mx-auto', 'mb-2', 'mt-2')
                button.appendChild(btnText)
                button.onclick = () => deleteFavouriteMichi(michi.id)
                button.classList.add('btn', 'btn-red')
                img.src = michi.image.url
                img.width = 300
                article.appendChild(img)
                article.appendChild(button)
                section.appendChild(article)
            })
        }

}

async function saveFavouriteMichi(id) {

    const {data, status} = await api.post('/favourites', {
        image_id: id
    })
    // const res = await fetch(API_URL_FAVORITES, {
    //     method: 'POST',
    //     headers: cabeceras,
    //     body: JSON.stringify({
    //         image_id: id
    //     })
    // })

    // const data = await res.json()

    if (status !== 200) {
        spanError.textContent = 'Hubo un error al guardar la imagen' + status + data.message
    } else {
        console.log('Guardado en favoritos')
        loadFavouriteMichis()
    }


    console.log(data)
}

async function deleteFavouriteMichi(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers: cabeceras
    })
    const data = await res.json()

    if (res.status !== 200) {
        spanError.textContent = 'Hubo un error al eliminar de favoritos la imagen' + res.status + data.message
    } else {
        console.log('Eliminado de favoritos')   
        loadFavouriteMichis()
    }
}

async function uploadMichiPhoto() {
    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form)
    console.log(formData.get('file'))
    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            //'Content-Type': 'multipart/form-data',
            //'Access-Control-Allow-Origin': '*',
            'X-API-KEY': 'live_LIkBwXa9EkZFOxMrRimFlcmVTJfw7HIjVWVfJMJQEkPqLo8xVrm75wAgTXmahIXN'
        },
        body: formData
    })
    console.log(res)
    const data = await res.json()

    if (res.status !== 201) {
        spanError.textContent = 'Hubo un error al subir la imagen' + res.status
    } else {
        console.log('Imagen subida')
        console.log(data)
        console.log(data.url)
        saveFavouriteMichi(data.id)
    }
}

function previsualizarImagen(inputId, containerId, width) {
    const inputFile = document.getElementById(inputId);
    const previewContainer = document.getElementById(containerId);

    inputFile.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.width = width; // Ajusta el ancho de la miniatura según sea necesario
            img.classList.add('rounded-lg', 'mx-auto', 'w-40'); //rounded-lg w-40 mx-auto
            previewContainer.innerHTML = ''; // Limpia cualquier previsualización anterior
            previewContainer.appendChild(img); // Agrega la imagen al contenedor de previsualización
        }
        reader.readAsDataURL(file);
        } else {
        previewContainer.innerHTML = ''; // Limpia el contenedor si no se selecciona ningún archivo
        }
    });
}

  // Llamar a la función con los parámetros necesarios
previsualizarImagen('file', 'previewContainer', 200)

loadRandomMichi()
loadFavouriteMichis()