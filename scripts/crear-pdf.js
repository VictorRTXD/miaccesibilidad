let apiURLBase = "http://localhost:9000"
var openFinal = document.getElementById("ReportFinal");
var openFinalMenu = document.getElementById("ReportFinalMenu");
var guardarBtn = document.getElementById("guardar-btn");

openFinal.addEventListener("click", obtenerServicio);
openFinalMenu.addEventListener("click", obtenerServicio);
guardarBtn.addEventListener("click", crearFinal);

async function obtenerServicio() {
    let servicioURL = apiURLBase + "/public/servicio";
    let fetchParams = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token"),
        }
    }
    let request = await fetch(servicioURL, fetchParams);
    if(request.status == 401){
        window.alert("La sesión a caducado, inicia sesión de nuevo!");
        location.assign("index.html");
    }
    let datosServicio = await request.json();
    let contenedorPDF = document.getElementById("main");

    sessionStorage.setItem("servicio", JSON.stringify(datosServicio));

    if (Object.keys(datosServicio.reporteFinalDos) == 0) {
        window.alert("No has creado el reporte final!");
    }
    else {
        let getPdfURL = "http://localhost/pdf_prueba/prueba.php";
        let bodyData = {
            servicio: datosServicio,
            usuario: JSON.parse(sessionStorage.getItem("usuario"))
        }
        let pdfparam = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        }

        

        fetch(getPdfURL, pdfparam)  
            .then(data => data.blob())
            .then((pdf) => {
                let pdfEmbed = document.createElement("embed");

                pdfEmbed.src = URL.createObjectURL(pdf);

                contenedorPDF.innerHTML = "";
                contenedorPDF.append(pdfEmbed);
            });
    }


}

async function crearFinal() {
    let metas = document.getElementById("metas").value,
        metodologia = document.getElementById("metodologia").value,
        inovacion = document.getElementById("inovacion").value,
        conclusiones = document.getElementById("conclusiones").value,
        propuestas = document.getElementById("propuestas").value;

    let bodyReporte = {
        metasAlcanzadas: metas,
        metodologiaUtilizada: metodologia,
        innovacionAportada: inovacion,
        conclusiones: conclusiones,
        propuestas: propuestas
    };

    console.log(bodyReporte);

    let reporteFinalURL = apiURLBase + "/public/reporte-final-2";
    let fetchParams = {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyReporte)
    }

    await fetch(reporteFinalURL, fetchParams)
    .then(response => response.json())
    .then((json) => {
        window.alert("reporte creado con éxito!\nSelecciona reporte final para descargarlo");
        location.reload();
    })
    .catch(() => {
        window.alert("Datos erroneos!");
        location.reload();
    });

}










