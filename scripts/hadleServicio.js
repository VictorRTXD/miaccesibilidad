let entidadR = document.getElementById("entidadR"),
    receptor = document.getElementById("receptor"),
    programa = document.getElementById("programa"),
    fechaI = document.getElementById("fechaI"),
    fechaF = document.getElementById("fechaF"),
    horaI = document.getElementById("horaI"),
    horaF = document.getElementById("horaF"),
    objetivos = document.getElementById("objetivos"),
    crearServicioBtn = document.getElementById("crear-servicio-btn"),
    actualizarServicioBtn = document.getElementById("actualizar-servicio-btn");

let token = sessionStorage.getItem("token");
const serverBaseUrl = "http://192.168.1.245:9000";


(async function () {


    var bienvenida = document.getElementById("welcome");
    var formRegister = document.getElementById("register");

    let fetchParams = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
    }


    let resultServicio = await fetch(serverBaseUrl + "/public/servicio", fetchParams);


    if (resultServicio.status == 404) {
        Swal.fire({
            title: "Crear servicio",
            text: "Parece que no has llenado los datos de tu servicio",
            icon: "info",
            didClose: () => {
                bienvenida.classList.add("oculto");
                formRegister.classList.remove("oculto");
            }
        })
        return;
    }

    if(resultServicio.status == 401){
        Swal.fire({
            title: "La sesión a expirado",
            text: "Vuelve a iniciar sesión de nuevo para continuar",
            icon: "warning",
            didClose: () => {
                document.location.assign("index.html");
            }
        })
        return;
    }

    let resultServicioJson = await resultServicio.json();
    // console.log(resultServicioJson);
    sessionStorage.setItem("servicio", JSON.stringify(resultServicioJson));
    crearServicioBtn.classList.add("oculto");
    actualizarServicioBtn.classList.remove("oculto");

    entidadR.value = resultServicioJson.entidadReceptora;
    receptor.value = resultServicioJson.receptor;
    programa.value = resultServicioJson.programa;
    fechaI.value = resultServicioJson.fechaInicio.split("T")[0];
    fechaF.value = resultServicioJson.fechaFin.split("T")[0];
    horaI.value = resultServicioJson.horarioHoraInicio;
    horaF.value = resultServicioJson.horarioHoraFin;
    objetivos.value = resultServicioJson.objetivosDelPrograma;



})();

async function crearServicio() {

    let bodyContent = JSON.stringify({
        "entidadReceptora": entidadR.value,
        "receptor": receptor.value,
        "programa": programa.value,
        "objetivosDelPrograma": objetivos.value,
        "fechaInicio": fechaI.value,
        "fechaFin": fechaF.value,
        "horarioHoraInicio": horaI.value,
        "horarioHoraFin": horaF.value
    });

    let fetchParams = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: bodyContent
    }

    let crearResult = await fetch(serverBaseUrl + "/public/servicio", fetchParams);
    if (crearResult.status == 400) {
        Swal.fire({
            title: "Servicio Existente",
            text: "Los datos para tu usuario ya están creados",
            icon: "error",
        })

        return;

    }
    if (await validarTrimestres()) {
        Swal.fire({
            title: "Servicio creado",
            text: "Es necesario que vuelvas a iniciar sesión para continuar",
            icon: "success",
            didClose: () => {
                sessionStorage.clear();
                window.location.assign("index.html");
            }
        });
    }


}

async function actualizarServicio() {
    let bodyContent = JSON.stringify({
        "entidadReceptora": entidadR.value,
        "receptor": receptor.value,
        "programa": programa.value,
        "objetivosDelPrograma": objetivos.value,
        "fechaInicio": fechaI.value,
        "fechaFin": fechaF.value,
        "horarioHoraInicio": horaI.value,
        "horarioHoraFin": horaF.value
    });

    let fetchParams = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: bodyContent
    }

    let actualizarResult = await fetch(serverBaseUrl + "/public/servicio", fetchParams);
    console.log(await actualizarResult.json());
    if (await validarTrimestres(true)) {
        if (actualizarResult.status == 201) {
            Swal.fire({
                title: "Datos actualizados",
                icon: "success",
                didClose: () => {
                    document.location.reload();
                }
            });
        }
    }

}

async function validarTrimestres(actualizar) {
    let mensaje;
    let fetchParams = {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    }
    
    actualizar ? mensaje = "Verifica que las fechas ingresadas sean correctas" : mensaje = "El servicio ha sido creado, pero las fechas son incorrectas, inicia sesión de nuevo para continuar";

    let trimestreResult = await fetch(serverBaseUrl + "/public/servicio/trimestres", fetchParams);
    if (trimestreResult.status == 200) {
        let trimestresValidos = await trimestreResult.json();

        if (trimestresValidos.length < 4) {
            Swal.fire({
                title: "Error en las fechas",
                text: mensaje,
                icon: "warning",
                didClose: () => {
                    if(!actualizar){
                    sessionStorage.clear();
                    window.location.assign("index.html");
                    }
                }
            });
            return false;
        }
        else {
            return true;
        }

    }







}
