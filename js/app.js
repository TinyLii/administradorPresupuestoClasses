//Variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");


//Events
eventListeners()
function eventListeners(){
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
    formulario.addEventListener("submit", agregarGasto)
}


//Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        // console.log(this.gastos)
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto)=> total + gasto.cantidad, 0);

        this.restante = this.presupuesto - gastado;
        // console.log(this.restante)
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();

    }

}

class UI{
    insertarPresupuesto(cantidad){
        const { presupuesto, restante } = cantidad;
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement("div");
        divMensaje.textContent = mensaje;
        divMensaje.classList.add("text-center", "alert");

        if(tipo === "error"){
            divMensaje.classList.add("alert-danger");
        }else{
            divMensaje.classList.add("alert-success");
        }

        document.querySelector(".primario").insertBefore(divMensaje, formulario);

        setTimeout(()=>{
            divMensaje.remove()
        }, 2000)
    }

    mostrarGasto(gastos){

        this.limpiarHTML()
        gastos.forEach(gasto=>{  
        const {cantidad, nombre, id} = gasto;

        const nuevoGasto = document.createElement("li");
        nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center";
        // nuevoGasto.setAttribute("data-id", id);       este y dataset.id hacen lo mismo
        nuevoGasto.dataset.id = id

        // console.log(nuevoGasto)
        //Agregar el HTML del gasto
            nuevoGasto.innerHTML = ` ${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span> `
        //Boton para eliminarlo
            const btnBorrar = document.createElement("button");
            btnBorrar.innerHTML = "Borrar &times"
            btnBorrar.onclick = ()=>{
                eliminarGasto(id);
            }
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            nuevoGasto.appendChild(btnBorrar)
        //Agregar al HTML
            gastoListado.appendChild(nuevoGasto)
        })
    }
    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }

    actualizarRestante(restante){
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;

        const restanteDiv = document.querySelector(".restante");
        //Comprobar 25%
        if ( (presupuesto / 4 ) > restante){
            restanteDiv.classList.remove("alert-success", "alert-warning");
            restanteDiv.classList.add("alert-danger");
        } else if ( (presupuesto /  2) > restante){
            restanteDiv.classList.remove("alert-success");
            restanteDiv.classList.add("alert-warning");
        }else{
            restanteDiv.classList.remove("alert-danger", "alert-warning");
            restanteDiv.classList.add("alert-success");
        }

        if(restante <= 0){
            ui.imprimirAlerta("No queda plata", "error");
            formulario.querySelector("button[type='submit']").disabled = true;
        }
    }
}

//Instanciar
const ui = new UI();
let presupuesto;

//Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("Cuál es tu presupuesto?");
    // console.log(  presupuestoUsuario)
    if(presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload()
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto)

    ui.insertarPresupuesto(presupuesto);
    
}

function agregarGasto(e){
    e.preventDefault();
    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);


    if(nombre === "" || cantidad === ""){
        ui.imprimirAlerta("Ambos campos son obligatorios", "error");
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta("Cantidad no válida", "error");
        return;
    }
    
    const gasto = { nombre, cantidad, id: Date.now() }
    presupuesto.nuevoGasto(gasto)

    ui.imprimirAlerta("Correcto")

    //Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGasto(gastos)

    ui.actualizarRestante(restante)

    ui.comprobarPresupuesto(presupuesto);

    formulario.reset()
}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id);
    const {gastos, restante} = presupuesto;
    ui.mostrarGasto(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}