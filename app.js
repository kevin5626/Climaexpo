const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const html = document.querySelector('html');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e) {
    e.preventDefault();

    // Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === '') {
        // Hubo un error
        mostrarError('Ambos campos son obligatorios');

        return;
    }

    // Consultariamos la API
    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta) {
        // Crear una alerta
        const alerta = document.createElement('div');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded',
        'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block">${mensaje}</span>
        `

        container.appendChild(alerta);

        setTimeout( () => {
            alerta.remove();
        }, 5000)
    }

    console.log(html)
}

function consultarAPI(ciudad, pais) {

    const appId = '80d8f4dbf76e8fb2683b319c11341b70';
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    spinner() // Muestra un spinner de carga

    console.log(url);
    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( datos => {
            limpiarHTML() // Limpiar el HTML previo

            if(datos.cod === "404") {
                mostrarError('Ciudad no encontrada');
                return;
            }
            
            // Imprime la respuesta en el HTML
            mostrarClima(datos);
        })
        
    }
    
function mostrarClima(datos) {
    if(html.classList) {
        html.classList.remove('soleado','pocoNublado', 'nublado', 'lluvia', 'tormenta', 'niebla');
    }

    const { name, main: { temp, temp_max, temp_min, humidity}, wind: { speed } } = datos;

    const centigrados = kelvinACentrigados(temp);
    const max = kelvinACentrigados(temp_max);
    const min = kelvinACentrigados(temp_min);

    const icono = datos.weather[0].icon;

    const imagen = document.createElement('img');
    imagen.width = 170;
    imagen.height = 70;
    imagen.classList.add('center');

    imagen.src = `assets/${icono}.png`;

    console.log(icono);
    
    let descripcion = datos.weather[0].description;

    switch(descripcion) {
        // Soleado
        case 'clear sky':
            descripcion = 'Cielo Despejado';
            html.classList.add('soleado');
            break;
        // Poco Nublado
        case 'few clouds':
            descripcion = 'Pocas Nubes';
            html.classList.add('pocoNublado');
            break;
        case 'scattered clouds':
            descripcion = 'Nubes Dispersas';
            html.classList.add('pocoNublado');
            break;
        // Nublado    
        case 'broken clouds':
        case 'overcast clouds':    
            descripcion = 'Nubes Cubiertas';
            html.classList.add('nublado');
            break;
        // LLuvia
        case 'light rain':
            descripcion = 'Lluvia Ligera';
            html.classList.add('lluvia');
            break;
        case 'moderate rain':
            descripcion = 'Lluvia Moderada';
            html.classList.add('lluvia');
            break;
        case 'heavy intensity rain':
            descripcion = 'Lluvia Intensa';
            html.classList.add('lluvia');
            break;
        case 'very heavy rain':
            descripcion = 'Lluvia muy Intensa';
            html.classList.add('lluvia');
            break;
        case 'extreme rain':
            descripcion = 'Lluvia Extrema';
            html.classList.add('lluvia');
            break;
        case 'light intensity shower rain':
            descripcion = 'Llovizna Intensa';
            html.classList.add('lluvia');
            break;
        case 'heavy intensity shower rain':
            descripcion = 'Llovizna muy Intensa';
            html.classList.add('lluvia');
        case 'shower rain':
            descripcion = 'Lluvia Torrencial';
            html.classList.add('lluvia');
            break;
        case 'ragged shower rain':
            descripcion = 'Lluvia Descontinua';
            html.classList.add('lluvia');
            break;        
        // Tormenta    
        case 'thunderstorm':
            descripcion = 'Tormenta';
            html.classList.add('lluvia');
            break;
        // Nieve    
        case 'light snow':
            descripcion = 'Nieve Ligera';
            html.classList.add('nieve');
            break;
        case 'snow':
            descripcion = 'Nieve';
            html.classList.add('nieve');
            break;
        case 'heavy snow':
            descripcion = 'Nieve Intensa';
            html.classList.add('nieve');
            break;
        case 'sleet':
            descripcion = 'Aguanieve';
            html.classList.add('nieve');
            break;
        case 'light shower sleet':
            descripcion = 'Lluvia Ligera Aguanieve';
            html.classList.add('nieve');
            break;
        case 'shower sleet':
            descripcion = 'Llovizna Aguanieve';
            html.classList.add('nieve');
            break;
        case 'light rain and snow':
            descripcion = 'Lluvia Ligera y Nieve';
            html.classList.add('nieve');
            break;
        case 'rain and snow':
            descripcion = 'Lluvia y Nieve';
            html.classList.add('nieve');
            break;
        case 'light shower snow':
            descripcion = 'LLovizna y Nieve';
            html.classList.add('nieve');
            break;
        case 'heavy shower snow':
            descripcion = 'LLuvia Intensa y Nieve';
            html.classList.add('nieve');
            break;
        // Neblina    
        case 'mist':
            descripcion = 'Neblina';
            html.classList.add('niebla');
            break;
        default:
            break;
    }
    
    const vientoKm = parseInt((speed/1000)*3600);

    const textoDescripcion = document.createElement('p');
    textoDescripcion.innerHTML = `${descripcion}`;
    textoDescripcion.classList.add('font-bold', 'text-3xl');
    
    const nombreCiudad = document.createElement('p');
    nombreCiudad.innerHTML = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');
    
    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');
    
    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`;
    tempMaxima.style.marginLeft = '57px';
    tempMaxima.style.marginRight = '13px';
    tempMaxima.classList.add('text-2xl');
    
    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451;`;
    tempMinima.classList.add('text-2xl');

    const humedad = document.createElement('p');
    humedad.innerHTML = `Humedad: ${humidity}%`;
    humedad.style.marginLeft = '13px';
    humedad.style.marginRight = '13px';
    humedad.classList.add('text-2xl');

    const viento = document.createElement('p');
    viento.innerHTML = `Viento: ${vientoKm} km/h`;
    viento.classList.add('text-2xl');
    
    const datosDiv = document.createElement('div');
    datosDiv.classList.add('datosDivOrden', 'center');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    
    datosDiv.appendChild(tempMaxima);
    datosDiv.appendChild(tempMinima);
    datosDiv.appendChild(humedad);
    datosDiv.appendChild(viento);
    
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(imagen);
    resultadoDiv.appendChild(textoDescripcion);
    resultadoDiv.appendChild(datosDiv);

    resultado.appendChild(resultadoDiv);
}

const kelvinACentrigados = grados => parseInt(grados - 273.15);

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner() {
    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `

    resultado.appendChild(divSpinner);
}