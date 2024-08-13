let codigoInput = document.querySelector("#codigo");
let nipInput = document.querySelector("#password");
let iniciarSesionBtn = document.querySelector("#iniciar-sesion-btn");
const serverBaseUrl = "http://192.168.1.245:9000";

iniciarSesionBtn.addEventListener("click", IniciarSesion)

async function IniciarSesion() {

    if(codigoInput.value == "" || nipInput.value == ""){
        Swal.fire({
            title:"Advertencia",
            text:"Completa todos los campos antes de continuar.",
            icon:"warning"
        })
        return;
    }


    let bodyData = {
        codigo: codigoInput.value,
        nip: nipInput.value
    }

    let fetchParams = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
    }

    await fetch(serverBaseUrl+"/public/usuarios/iniciar-sesion", fetchParams)
        .then(response => response.json())
        .then((data) => {
            if (data.token == undefined) {
                Swal.fire({
                    title:"Error",
                    text:data.code,
                    icon:"error"
                })
                

            }
            else {
                sessionStorage.setItem("token", data.token);
                DatosUsuario(bodyData);
            }


        });

}

async function DatosUsuario(Body) {
    let getUsuarioURL = serverBaseUrl + "/public/usuarios?codigo=" + Body.codigo + "&nip=" + Body.nip;

    await fetch(getUsuarioURL)
        .then(response => response.json())
        .then((data) => {
            sessionStorage.setItem("usuario", JSON.stringify(data));
            document.location.assign("menu.html");
        });
}