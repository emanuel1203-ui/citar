document.addEventListener('DOMContentLoaded', function() {
    // Definimos la URL base de la API
    const API_URL = "https://api.quotable.io";

    // Captura de elementos del DOM
    const formBusqueda = document.getElementById('form-busqueda');
    const inputAutor = document.getElementById('autor');
    const inputCategoria = document.getElementById('categoria');
    const btnAleatorio = document.getElementById('btn-aleatorio');
    const citasContainer = document.getElementById('citas-container');
    const errorMessage = document.getElementById('error-message');

    // Función para limpiar el contenedor de citas
    function limpiarCitas() {
        citasContainer.innerHTML = '';
        errorMessage.style.display = 'none';
    }

    // Clase para representar una cita
    class Cita {
        constructor(texto, autor, categoria) {
            this.texto = texto;
            this.autor = autor;
            this.categoria = categoria;
        }

        mostrarHTML() {
            const citaElement = document.createElement('div');
            citaElement.classList.add('cita');

            const textoElement = document.createElement('p');
            textoElement.innerText = `"${this.texto}"`;

            const autorElement = document.createElement('h3');
            autorElement.innerText = `— ${this.autor}`;

            const categoriaElement = document.createElement('p');
            categoriaElement.innerText = `Categoría: ${this.categoria || 'No especificada'}`;
            categoriaElement.classList.add('categoria');

            citaElement.appendChild(textoElement);
            citaElement.appendChild(autorElement);
            citaElement.appendChild(categoriaElement);

            return citaElement;
        }
    }

    // Función para mostrar citas en el DOM
    function mostrarCitas(citas) {
        limpiarCitas();
        if (citas.length === 0) {
            errorMessage.style.display = 'block';
            return;
        }
        citas.forEach(citaData => {
            const cita = new Cita(citaData.content, citaData.author, citaData.tags?.join(', '));
            citasContainer.appendChild(cita.mostrarHTML());
        });
    }

    // Función para obtener y mostrar una cita aleatoria
    async function obtenerCitaAleatoria() {
        try {
            const response = await fetch(`${API_URL}/random`);
            const data = await response.json();
            mostrarCitas([data]);
        } catch (error) {
            console.error("Error al obtener una cita aleatoria:", error);
            errorMessage.style.display = 'block';
        }
    }

    // Función para buscar citas por autor o categoría
    async function buscarCitas(autor, categoria) {
        let url = `${API_URL}/quotes?`;
        if (autor) url += `author=${encodeURIComponent(autor)}&`;
        if (categoria) url += `tags=${encodeURIComponent(categoria)}&`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            mostrarCitas(data.results);
        } catch (error) {
            console.error("Error al buscar citas:", error);
            errorMessage.style.display = 'block';
        }
    }

    // Event listener para la búsqueda
    formBusqueda.addEventListener('submit', event => {
        event.preventDefault();
        const autor = inputAutor.value.trim();
        const categoria = inputCategoria.value.trim();
        buscarCitas(autor, categoria);
    });

    // Event listener para el botón de cita aleatoria
    btnAleatorio.addEventListener('click', obtenerCitaAleatoria);
});
