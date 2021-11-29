const container = document.querySelector('.container')
const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')

window.addEventListener('load', () => {
    formulario.addEventListener('submit', consultarClima)
})

function consultarClima (e) {
    e.preventDefault()

    //Validar el formulario
    const ciudad = document.querySelector('#ciudad').value
    const pais = document.querySelector('#pais').value

    if(ciudad == '' || pais == ''){
        mostrarError('Todos los campos son obligatorios')

        return;
    }

    llamarApi(ciudad,pais)
}

function mostrarError(mensaje){
    
    const alerta = document.querySelector('.bg-red-100')

    if(!alerta){
        const alerta = document.createElement('div')

        alerta.classList.add('bg-red-100' , 'border-red-400' ,'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md',
        'mx-auto', 'mt-6', 'text-center')
    
        alerta.innerHTML = `
            <strong class = "font-bold">Error!</strong>
            <span class = "block">${mensaje}</span>
        `;
    
        container.appendChild(alerta)

        setTimeout(() => {
            alerta.remove()
        },5000)
    }
}

function llamarApi (ciudad,pais){

    const appId = '0c5089e189f02b32d5f6ac73385c787f';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    spinner()

    fetch(url)
    .then( respuesta => respuesta.json())
    .then(datos => {

        limpiarHTML()

        if(datos.cod === "404"){
            mostrarError('Ciudad no encontrada')
            return;
        }

        mostrarClima(datos)
    })
}

function mostrarClima(datos){
    const {name, main: {temp, temp_max, temp_min}} = datos

    const centrigrados = kelvinACentigrados(temp)
    const max = kelvinACentigrados(temp_max)
    const min = kelvinACentigrados(temp_min)

    const nombreCiudad = document.createElement('p')
    nombreCiudad.textContent = `Clima en ${name}`
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p')
    actual.innerHTML = `${centrigrados} &#8451`
    actual.classList.add('font-bold', 'text-6xl')

    const temperaturaMaxima = document.createElement('p')
    temperaturaMaxima.innerHTML= `Max: ${max} &#8451`
    temperaturaMaxima.classList.add('text-xl')

    const temperaturaMinima = document.createElement('p')
    temperaturaMinima.innerHTML= `Min: ${min} &#8451`
    temperaturaMinima.classList.add('text-xl')

    const resultadoDiv = document.createElement('div')

    resultadoDiv.classList.add('text-center', 'black')
    resultadoDiv.appendChild(nombreCiudad)
    resultadoDiv.appendChild(actual)
    resultadoDiv.appendChild(temperaturaMaxima)
    resultadoDiv.appendChild(temperaturaMinima)

    resultado.appendChild(resultadoDiv)
}

const kelvinACentigrados = (grados) => parseInt(grados - 273.15)


function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function spinner(){

    limpiarHTML()

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner')

    divSpinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    `

    resultado.appendChild(divSpinner)
}