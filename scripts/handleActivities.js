const btnAgregarActividad = document.getElementById("btn-agregar-actividad");
const btnCrearActividad = document.getElementById("btn-crear-actividad");
const actividadesContainer = document.getElementById("activades-agregadas-container");
const btnCrearReporte = document.getElementById("btn-crear-reporte");
const btnAtualizarReporte = document.getElementById("btn-actualizar-reporte");
const btnPDF = document.getElementById("btn-mostrar-pdf");
const actividadesMap = new Map();
const activiadesMapLogic = new Map();

let actividadesAgregadasArray = [];

// let token = sessionStorage.getItem("token");
btnCrearReporte.addEventListener("click", crearReporteParcial);
btnAtualizarReporte.addEventListener("click", actualizarReporteParcial);
btnPDF.addEventListener("click", mostrarReporte);

function habilitarReportes(reporteActual) {
    const reportes = JSON.parse(sessionStorage.getItem("servicio")).reportesParciales;
    reportes.sort(function (a, b) {
        return a.id - b.id;
    })
    console.log("reporte habilitado " + reporteActual);

    if (reporteActual <= reportes.length) {
        btnCrearReporte.classList.add("oculto");
        btnAtualizarReporte.classList.remove("oculto");
        btnPDF.classList.remove("oculto");

    }
    else {
        btnCrearReporte.classList.remove("oculto");
        btnAtualizarReporte.classList.add("oculto");
        btnPDF.classList.add("oculto");
    }


    sessionStorage.setItem("reporteActual", reporteActual);

    limpiarActividades();
    cargarActividades();
    cargarAtenciones();
    calcularTotal();

    btnAgregarActividad.onclick = async () => {

        const { value: actividad } = await Swal.fire({
            title: "Selecciona actividad",
            input: "select",
            inputOptions: actividadesMap,
            inputPlaceholder: "actividades",
            showCancelButton: true,
            inputValidator: (value) => {
                const found = actividadesAgregadasArray.find((element) => element == value);

                if (found) {
                    return "La actividad ya está agregada!";
                }
            }
        });

        if (actividad) {

            let actividadAgregada = crearActividad(actividad, activiadesMapLogic.get(actividad), 0);
            actividadesAgregadasArray.push(actividad);
            actividadesContainer.appendChild(actividadAgregada);
        }
    }

    btnCrearActividad.onclick = async () => {

        const { value: actividad } = await Swal.fire({
            title: "Crear actividad",
            input: "text",
            inputLabel: "Descripción",
            showCancelButton: true,
            inputValidator: (value) => {
                const found = actividadesAgregadasArray.find((element) => element == value);

                if (found) {
                    return "La actividad ya está agregada!";
                }
                const actividadesExistentes = JSON.parse(sessionStorage.getItem("servicio")).actividadesDeUsuario;
                const foundActividad = actividadesExistentes.find((element) => element.descripcion == value);

                if (foundActividad) {
                    return "La actividad ya existe!";
                }

                if (actividadesMap.has(value)) {
                    return "La actividad ya está creada!";
                }

            }
        });

        if (actividad) {

            let actividadAgregada = crearActividad(actividad, 0, 0);
            actividadesAgregadasArray.push(actividad);
            actividadesContainer.appendChild(actividadAgregada);
            actividadesMap.set(actividad, actividad);
            activiadesMapLogic.set(actividad, 0);
        }
    }

    function prueba() {

        let content = this.parentElement.firstChild.textContent;
        let index = actividadesAgregadasArray.findIndex((element) => element == content);

        actividadesAgregadasArray.splice(index, 1);
        console.log(actividadesAgregadasArray);

        this.parentElement.remove();
    }

    function crearActividad(actividad, id, cantidad) {

        let actividadAgregada = document.createElement("div");
        actividadAgregada.classList.add("actividad-agregada");
        actividadAgregada.setAttribute("idActividad", id);

        let actividadDescripcion = document.createElement("div");
        actividadDescripcion.classList.add("actividad-descripcion");

        let descripcion = document.createTextNode(actividad);
        actividadDescripcion.appendChild(descripcion);

        let actividadInput = document.createElement("input");
        actividadInput.classList.add("actividad-cantidad");
        actividadInput.setAttribute("type", "number");
        actividadInput.setAttribute("value", Number(cantidad));

        let actividadBtnBorrar = document.createElement("p");
        actividadBtnBorrar.classList.add("btn-eliminar-actividad");
        actividadBtnBorrar.addEventListener("click", prueba);
        actividadBtnBorrar.innerHTML = "x";

        actividadAgregada.appendChild(actividadDescripcion);
        actividadAgregada.appendChild(actividadInput);
        actividadAgregada.appendChild(actividadBtnBorrar);

        return actividadAgregada;
    }

    function cargarActividades() {

        const actividadesExistentes = JSON.parse(sessionStorage.getItem("servicio")).actividadesDeUsuario;
        actividadesExistentes.forEach(actividad => {
            actividadesMap.set(actividad.descripcion, actividad.descripcion);
            activiadesMapLogic.set(actividad.descripcion, actividad.id);
        });

        // const reportes = JSON.parse(sessionStorage.getItem("servicio")).reportesParciales;


        if (reporteActual <= reportes.length) {
            const actividadesRealizadas = reportes[reporteActual - 1].actividadesRealizadas;


            actividadesRealizadas.forEach(actividadRealizada => {
                const found = actividadesExistentes.find((element) => element.id == actividadRealizada.idActividad);
                let actividadAgregada = crearActividad(found.descripcion, found.id, actividadRealizada.cantidad);
                actividadesAgregadasArray.push(found.descripcion);
                actividadesContainer.appendChild(actividadAgregada);

            })
        }

    }

    function cargarAtenciones() {


        if (reporteActual <= reportes.length) {
            const atencionesRealizadas = reportes[reporteActual - 1].atencionesRealizadas;

            atencionesRealizadas.sort(function (a, b) {
                return a.tipo - b.tipo;
            })

            document.getElementById("prenatales").value = atencionesRealizadas[0].cantidad;
            document.getElementById("niños").value = atencionesRealizadas[1].cantidad;
            document.getElementById("hombres").value = atencionesRealizadas[2].cantidad;
            document.getElementById("mujeres").value = atencionesRealizadas[3].cantidad;
            document.getElementById("geriatrico").value = atencionesRealizadas[4].cantidad;
            document.getElementById("hours").value = reportes[reporteActual - 1].horasRealizadas;

        }

    }

    function limpiarActividades() {
        actividadesContainer.innerHTML = "";
        actividadesAgregadasArray = [];
        actividadesMap.clear();
        activiadesMapLogic.clear();
        document.getElementById("prenatales").value = 0;
        document.getElementById("niños").value = 0;
        document.getElementById("hombres").value = 0;
        document.getElementById("mujeres").value = 0;
        document.getElementById("geriatrico").value = 0;
        document.getElementById("hours").value = 0;

    }
}

function calcularTotal() {
    document.getElementById("atencionesTotal").value =
        + Number(document.getElementById("prenatales").value)
        + Number(document.getElementById("niños").value)
        + Number(document.getElementById("hombres").value)
        + Number(document.getElementById("mujeres").value)
        + Number(document.getElementById("geriatrico").value);
}

async function crearReporteParcial() {
    let actividades = [];

    actividadesContainer.childNodes.forEach(actividad => {
        actividades.push({
            "id": Number(actividad.getAttribute("idActividad")),
            "descripcion": actividad.childNodes[0].innerHTML,
            "cantidad": Number(actividad.childNodes[1].value)
        });

    })
    let atenciones =
        [
            {
                "cantidad": Number(document.getElementById("prenatales").value)
            },
            {
                "cantidad": Number(document.getElementById("niños").value)
            },
            {
                "cantidad": Number(document.getElementById("hombres").value)
            },
            {
                "cantidad": Number(document.getElementById("mujeres").value)
            },
            {
                "cantidad": Number(document.getElementById("geriatrico").value)
            }];

    let bodyContent = JSON.stringify({
        "horasRealizadas": Number(document.getElementById("hours").value),
        "actividadesUsuario": actividades,
        "atencionesRealizadas": atenciones
    });

    let fetchParams = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: bodyContent
    }

    console.log(bodyContent);

    let resultCrear = await fetch(serverBaseUrl + "/public/reporte-parcial/" + sessionStorage.getItem("reporteActual"), fetchParams);

    if (resultCrear.status == 201) {
        Swal.fire({
            title: "Reporte creado",
            icon: "success",
            didClose: () => {
                sessionStorage.removeItem("servicio");
                document.location.reload();
            }
        });
    }
    else {
        let response = await resultCrear.json();
        Swal.fire({
            title: "Error",
            text: response.code,
            icon: "error",
        })
    }

}


async function actualizarReporteParcial() {
    let actividades = [];

    actividadesContainer.childNodes.forEach(actividad => {
        actividades.push({
            "id": Number(actividad.getAttribute("idActividad")),
            "descripcion": actividad.childNodes[0].innerHTML,
            "cantidad": Number(actividad.childNodes[1].value)
        });

    })
    let atenciones =
        [
            {
                "cantidad": Number(document.getElementById("prenatales").value)
            },
            {
                "cantidad": Number(document.getElementById("niños").value)
            },
            {
                "cantidad": Number(document.getElementById("hombres").value)
            },
            {
                "cantidad": Number(document.getElementById("mujeres").value)
            },
            {
                "cantidad": Number(document.getElementById("geriatrico").value)
            }];

    let bodyContent = JSON.stringify({
        "horasRealizadas": Number(document.getElementById("hours").value),
        "actividadesUsuario": actividades,
        "atencionesRealizadas": atenciones
    });

    let fetchParams = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: bodyContent
    }

    console.log(bodyContent);

    let resultCrear = await fetch(serverBaseUrl + "/public/reporte-parcial/" + sessionStorage.getItem("reporteActual"), fetchParams);

    if (resultCrear.status == 201) {
        Swal.fire({
            title: "Reporte actualizado",
            icon: "success",
            didClose: () => {
                sessionStorage.removeItem("servicio");
                document.location.reload();
            }
        });
    }
    else {
        let response = await resultCrear.json();
        Swal.fire({
            title: "Error",
            text: response.code,
            icon: "error",
        })
    }

}

async function mostrarReporte(){
    let getPdfURL = "http://192.168.1.195/pdf_prueba/reporte_parcial.php";
        let bodyData = {
            reporteNum: sessionStorage.getItem("reporteActual"),
            servicio: JSON.parse(sessionStorage.getItem("servicio")),
            usuario: JSON.parse(sessionStorage.getItem("usuario"))
        }
        let pdfparam = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            
            body: JSON.stringify(bodyData)
        }

        let resultPDF = await fetch(getPdfURL, pdfparam);
        console.log(resultPDF);

        let pdf = await resultPDF.blob();

        window.location.assign(URL.createObjectURL(pdf));
        
        // let contenedorPDF = document.getElementById("main");

        // let pdfEmbed = document.createElement("embed");

        // pdfEmbed.src = URL.createObjectURL(pdf);

        // contenedorPDF.innerHTML = "";
        // contenedorPDF.append(pdfEmbed);

        

        // fetch(getPdfURL, pdfparam)  
        //     .then(data => data.blob())
        //     .then((pdf) => {
        //         let pdfEmbed = document.createElement("embed");

        //         pdfEmbed.src = URL.createObjectURL(pdf);

        //         contenedorPDF.innerHTML = "";
        //         contenedorPDF.append(pdfEmbed);
        //     });
}

