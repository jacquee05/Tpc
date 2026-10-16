document.addEventListener("DOMContentLoaded", () => {
    // Estado de la sesión (cambia a true cuando el usuario inicie sesión)
    const sesionActiva = false; 

    const btnConfiguracion = document.getElementById("btnConfiguracion");
    const modalConfiguracion = document.getElementById("modalConfiguracion");

    if (btnConfiguracion) {
        btnConfiguracion.addEventListener("click", (e) => {
            // Previene el comportamiento predeterminado del formulario
            e.preventDefault();

            if (!sesionActiva) {
                // 1. SI LA SESIÓN NO ESTÁ ACTIVA:
                // Muestra el aviso y se detiene aquí al presionar Aceptar.
                alert("Debes iniciar sesión / registrarte para acceder a la configuración.");
                
                // Opcional: Descomenta la siguiente línea si deseas redirigirlo al login
                // window.location.href = "../login.html";
            } else {
                // 2. SI LA SESIÓN ESTÁ ACTIVA:
                // Solo se ejecuta esta sección cuando sesionActiva sea true.
                modalConfiguracion.showModal();
            }
        });
    }
});

//============================================================================
//============================================================================

// Diccionario de traducciones para la página
const traducciones = {
    es: {
        permisos1: "Permisos de datos",
        permisos2: "Permisos de datos",
        elige_idioma: "Selecciona un idioma"
    },
    en: {
        permisos1: "Data Permissions",
        permisos2: "Data Permissions",
        elige_idioma: "Choose One"
    },
    fr: {
        permisos1: "Autorisations de données",
        permisos2: "Autorisations de données",
        elige_idioma: "Choisissez une langue"
    }
};

/**
 * Actualiza todos los elementos HTML con el atributo [data-key]
 * al idioma seleccionado.
 * @param {string} codigoIdioma - Código del idioma ('es', 'en', 'fr')
 */
function cambiarIdioma(codigoIdioma) {
    const elementos = document.querySelectorAll("[data-key]");
    
    elementos.forEach(elemento => {
        const clave = elemento.getAttribute("data-key");
        
        // Verifica que exista la traducción para ese idioma y clave
        if (traducciones[codigoIdioma] && traducciones[codigoIdioma][clave]) {
            elemento.textContent = traducciones[codigoIdioma][clave];
        }
    });
}

// Escuchar eventos al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    // Escuchar el evento de cambio en los radio buttons de idioma
    const radiosIdioma = document.querySelectorAll('input[name="idioma"]');
    
    radiosIdioma.forEach(radio => {
        radio.addEventListener("change", (e) => {
            cambiarIdioma(e.target.value);
        });
    });
});