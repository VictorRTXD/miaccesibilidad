document.addEventListener("DOMContentLoaded", function () {
    // Obtener elementos del DOM
    var modal = document.getElementById("sidebarmenu");
    var btnOpenMenu = document.getElementById("menu");
    var btnclose = document.getElementById("cerrarmenu")


    // Función para abrir el modal
    btnOpenMenu.onclick = function () {
        modal.classList.remove("oculto");
        modal.classList.add("sidebarmenu")
    }

    // Función para cerrar el modal
    btnclose.onclick = function () {
        modal.classList.add("oculto");
        modal.classList.remove("sidebarmenu")
    }

});