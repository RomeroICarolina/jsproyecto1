//-------------------------------------------- Comprar un Snack ----------------------------------------------------------------------------------------


function comprarSnack() {

let seguirComprando = true 

while (seguirComprando) {


const precioSnack = 200
let dinero = prompt("Ingrese su dinero")

if(dinero >= precioSnack){
    const vuelto = dinero - precioSnack
    alert("Realizaste tu compra, aqui tienes tu snack y tu vuelto de " + vuelto)
}else{
    const dinerofaltante = precioSnack - dinero 
    alert("Dinero insuficiente. Te faltan $" + dinerofaltante)
}
seguirComprando = confirm("¿Queres agregar otro producto?")
}

 }


 //--------------------------------------------------------------- Vender producto en stock  -----------------------------------------------------------------------------

 function Producto(nombre, precio, stock){

 this.nombre = nombre
 this.precio = precio 
 this.stock = stock 
 

 this.vender = function(cantidad){
      let mensaje = "";
    if(cantidad > this.stock){
        mensaje = "No hay suficiente stock";
        }else{
        this.stock -= cantidad 
        mensaje = `Se vendieron ${cantidad} unidades de ${this.nombre}. Stock restante: ${this.stock}`

    }
    alert(mensaje);
    return mensaje; 
 };
 }

let snack = new Producto ("Snack", 200,5); 


/*  console.log(snack.vender(2))*/

//------------------------------------------------------------------ Cargar stock ------------------------------------------------------------------



function CargarProductos(){
 
    let nombre = prompt("Ingresa el nombre del nuevo producto:")
    let precio = parseFloat (prompt("Ingresa el precio del producto:"))
    let stock = parseInt (prompt ("Ingresa el stock del producto:"))

    let miProducto = new Producto (nombre,precio,stock)

    let cantidadVender = parseInt (prompt ("Ingrese la cantidad a vender:"))

    miProducto.vender(cantidadVender);
    return miProducto; 
}


