document.addEventListener("DOMContentLoaded", function () {
    // Obtener elementos del DOM
    var modal = document.getElementById("sidebarmenu");
    var bienvenida = document.getElementById("welcome");
    var openFinal = document.getElementById("ReportFinal");
    var formFinal = document.getElementById("finalReport");
    var openFinalMenu = document.getElementById("ReportFinalMenu");
    var formRegister = document.getElementById("register");
    var openRegister = document.getElementById("Datos");
    var openRegisterMenu = document.getElementById("DatosMenu");
    var reportForm = document.getElementById("form-reporte-parcial");

    var reportesBtn = document.querySelectorAll(".btn-report");
    var reportesMovilBtn = document.querySelectorAll(".btn-report-movil");
    var tituloReporte = document.getElementById("title");

    reportesBtn.forEach(btn => {
        // Función que maneja la lógica del botón
        function handleAction() {
            const numero = this.getAttribute("reportNumber");
            tituloReporte.innerHTML = "Reporte parcial " + numero;
            tituloReporte.setAttribute('aria-label', `Estas en reporte parcial ${numero}`);
    
            ocultarTodos();
            reportForm.classList.remove("oculto");
            habilitarReportes(numero);
        }
    
        // Manejar el evento de clic
        btn.addEventListener("click", handleAction);
    
        // Manejar el evento de teclado (Enter)
        btn.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                handleAction.call(this);
            }
        });
    
        // Asegúrate de que el botón sea accesible para el teclado
        btn.setAttribute("tabindex", "0");
    }); 

    reportesMovilBtn.forEach(btn => {
        // Función que maneja la lógica del botón
        function handleAction() {
            const numero = this.getAttribute("reportNumber");
            tituloReporte.innerHTML = "Reporte parcial " + numero;
    
            ocultarTodos();
            reportForm.classList.remove("oculto");
            habilitarReportes(numero);
        }
    
        // Manejar el evento de clic
        btn.addEventListener("click", handleAction);
    
        // Manejar el evento de teclado (Enter)
        btn.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                handleAction.call(this);
            }
        });
    
        // Asegúrate de que el botón sea accesible para el teclado
        btn.setAttribute("tabindex", "0");
    });    

    // Función para ocultar todos los elementos visibles
    function ocultarTodos() {
        bienvenida.classList.add("oculto");
        modal.classList.add("oculto");
        modal.classList.remove("sidebarmenu");
        formFinal.classList.add("oculto");
        formRegister.classList.add("oculto");
        reportForm.classList.add("oculto");
    }

    // Función para abrir el formulario final
    // Tu función para el botón openFinal
    function mostrarFinal() {
        ocultarTodos();
        formFinal.classList.remove("oculto");
    }

    // Asignar la función al clic del botón
    openFinal.onclick = mostrarFinal;

    // Manejar el evento de teclado (Enter) en openFinal
    openFinal.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            mostrarFinal();
        }
    });

    // Función para abrir el formulario de registro
    function mostrarRegistro() {
        ocultarTodos();
        formRegister.classList.remove("oculto");
    }

    // Asignar la función al clic del botón
    openRegister.onclick = mostrarRegistro;

    // Asignar la función a la tecla Enter
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            mostrarRegistro();
        }
    });


    openRegisterMenu.onclick = function () {
        ocultarTodos();
        formRegister.classList.remove("oculto");
    }
});