'use strict';

/* Declaración de variables globales para poder usarlos en diferentes funciones */

// Variable booleana que nos servirá para saber si el dado está tirado o no
// para así evitar más de una tirada hasta que se mueva el carácter
let dadoTirado;

// En esta variable establecemos el núm de tiradas que hizo el jugador durante la partida
let numTiradas;

// Array de posiciones que tiene el sprite del dado (del 1 (posición [0]) al 6 (posición [5]))
let posiciones = [-160, -128, -96, -64, -32, 0];

// Array de cuadros posibles por recorrer en cada tirada del dado
let cuadrosPosibles = [];

/* Esta funcion sirve para crear la tabla del juego, en caso de iniciar el SPA o reiniciar la partida */
function crearTabla() {
    // Antes de crear la tabla, el núm. de tiradas se establece a 0
    numTiradas = 0;

    let tabla = document.createElement("table");
    tabla.id = "tabla";

    for (var i = 0; i < 10; i++) {
        let fila = document.createElement("tr");

        for (var j = 0; j < 10; j++) {
            let columna = document.createElement("td");
            columna.style.border = "1px solid";

            columna.style.height = "28px";
            columna.style.width = "25px";

            fila.appendChild(columna);
        }

        tabla.appendChild(fila);
    }
    
    document.body.appendChild(tabla);
}

/* Esta función determina la posición del dado */
function posicionDado(dado, posicion) {
    dado.style.backgroundPosition = posiciones[posicion]+"px 0px";
    console.log(posiciones[posicion]);

    // Después de la tirada, la variable global de dadoTirado se vuelve true
    dadoTirado = true;
}

/* Esta función crea el dado */
function crearDado() {
    let dado = document.createElement("div");
    dado.id = "dado";

    dado.style.background = "url(https://upload.wikimedia.org/wikipedia/commons/2/2e/Dice-faces_32x32.jpg) no-repeat";
    dado.style.height = "32px";
    dado.style.width = "32px";
    dado.style.margin = "2px";
    //dado.style.backgroundPosition = posiciones[0]+"px 0px";

    document.body.appendChild(dado);
}

/* Esta función ayuda a localizar las celdas posibles por recorrer desde la posición que se encuentre
   el carácter */
function funcionCeldasPosibles(ev, posicion) {
    let fila = document.getElementsByTagName("tr");

    // Declaración de variables de posición del carácter
    let F = 0;
    let C = 0;

    // Se hace bucle para recorrer la tabla y localizar el personaje
    for (var i = 0; i < fila.length; i++) {
        var columnas = fila[i].getElementsByTagName("td");

        for (var j = 0; j < columnas.length; j++) {
            // Si x columna tiene nodos hijos (p. ej: el carácter), se ponen las coordenadas
            // de fila en la variable F y columna en la variable C
            if (columnas[j].hasChildNodes()){
                F = i;
                C = j;
                break;
            }
        }
    }

    // En base a las variables F y C, cogemos las celdas posibles que se puedan recorrer después de la tirada
    // y las guardamos en el array celdasPosibles
    /*Izquierda*/
    var izquierda = fila[F].getElementsByTagName("td")[C-(posicion+1)];
    if (fila[F].getElementsByTagName("td")[C-(posicion+1)] != undefined) {
        izquierda.style.background = "green";
        cuadrosPosibles.push(izquierda);
    }
    /*Arriba*/
    let arriba;
    if (fila[F-(posicion+1)] != undefined) {
        arriba = fila[F-(posicion+1)].getElementsByTagName("td")[C];
        arriba.style.background = "green";
        cuadrosPosibles.push(arriba);
    }
    /*Derecha*/
    var derecha = fila[F].getElementsByTagName("td")[C+(posicion+1)];
    if (fila[F].getElementsByTagName("td")[C+(posicion+1)] != undefined) {
        derecha.style.background = "green";
        cuadrosPosibles.push(derecha);
    }
    /*Abajo*/
    var abajo;
    if (fila[F+(posicion+1)] != undefined) {
        abajo = fila[F+(posicion+1)].getElementsByTagName("td")[C];
        abajo.style.background = "green";
        cuadrosPosibles.push(abajo);
    }

    // Si no hay ninguna celda por recorrer, avisamos al jugador que es imposible mover el carácter.
    // Por lo tanto, le dejamos otra tirada, estableciendo la variable de dadoTirado a false
    if (cuadrosPosibles.length == 0) {
        alert("En esta tirada no hay celdas posibles para moverse en esta posición. Por favor tira de nuevo el dado.");
        dadoTirado = false;
    }

    // Se le hace un evento al hacer click a la tabla
    document.getElementById("tabla").addEventListener("click", (ev) => {
        // Si dicho elemento de la tabla es de color verde (la celda posible)
        if (ev.target.style.background == "green") {
            // Si la celda verde es la última celda, se termina la partida
            if (ev.target.id == "ultimaCelda") {
                alert("FIN DE LA PARTIDA");
    
                let botonReiniciar = document.createElement("button");
                botonReiniciar.appendChild(document.createTextNode("Reiniciar partida"));
                document.body.appendChild(botonReiniciar);
                document.getElementById("dado").remove();
                botonReiniciar.addEventListener("click", (ev) =>  {
                    numTiradas = 0;
                    eliminar();
                    caracter(document.getElementById("primeraCelda"));
                    crearBotonEmpezar();
                    botonReiniciar.remove();
                });
            }

            // Se quitan las demás celdas posibles del array, quitando además el color de fondo de los mismos
            if(cuadrosPosibles.length > 0) {
                while (cuadrosPosibles.length > 0) {
                    //cuadrosPosibles[cuadrosPosibles.length-1].removeAttribute("style");
                    cuadrosPosibles[cuadrosPosibles.length-1].style.background = "";
                    /*cuadrosPosibles[cuadrosPosibles.length-1].removeEventListener("click", (ev) =>{
                        avanzarCelda(ev);
                    });*/
                    cuadrosPosibles.pop();
                }
            }

            document.getElementById("ultimaCelda").style.background = "blue";

            // Finalmente avanzamos el personaje a la celda seleccionada
            avanzarCelda(ev);
            // Establecemos dadoTirado a false para que siga tirando el dado
            dadoTirado = false;
            // Se le añade 1 más al núm. de tiradas
            numTiradas++;

            console.log("Tiradas: "+numTiradas);
        }
    });

    console.log("tienes "+cuadrosPosibles.length+" celdas para recorrer");
    console.log("Estás en la columna "+(C+1)+" de la fila "+(F+1));
}

/* En esta función, con la variable posicion, se le establece un nº aleatorio del 1 al 6
   y gracias a ello, podemos saber el nº de celdas posibles que pueda recorrer */
function funcionDado(ev) {
    let posicion = Math.floor(Math.random() * 6);
    posicionDado(ev.target, posicion);
    funcionCeldasPosibles(ev, posicion);
}

/* En esta funcion se crea el carácter */
function caracter(celda) {
    var caracter = document.createElement("div");
    caracter.id = "caracter";
    caracter.style.background = "url(https://www.spriters-resource.com/resources/sheets/169/172071.png?updated=1650169725)";
    caracter.style.backgroundPosition = "-27px -1px";
    caracter.style.width = "25px";
    caracter.style.height = "28px";

    celda.appendChild(caracter);
}

/* En esta función se avanza el carácter, eliminandolo y volviéndolo a establecer en una celda u otra */
function avanzarCelda(ev) {
    eliminar();
    caracter(ev.target);
}

/* Esta función, hace como su nombre lo indica, eliminar el carácter */
function eliminar() {
    document.getElementById("caracter").remove();
}

function crearBotonEmpezar() {
    var primeraCelda = tabla.getElementsByTagName("td")[0];
    primeraCelda.id = "primeraCelda";
    primeraCelda.style.background = "red";
    var ultimaCelda = tabla.getElementsByTagName("td")[tabla.getElementsByTagName("td").length - 1];
    ultimaCelda.id = "ultimaCelda";
    ultimaCelda.style.background = "blue";

    let botonEmpezar = document.createElement("button");
    botonEmpezar.appendChild(document.createTextNode("Tirar dado"));
    document.body.appendChild(botonEmpezar);

    botonEmpezar.addEventListener("click", (ev) => {
        botonEmpezar.remove();

        // Creamos dado, lo agregamos en la página y establecemos tirada
        crearDado();
        let dado = document.getElementById("dado");
        document.body.appendChild(dado);
        let posicion = Math.floor(Math.random() * 6);
        posicionDado(dado, posicion);
        funcionCeldasPosibles(dado, posicion);

        // Al pulsar sobre el dado, se hace un evento onclick que establece una variable
        // de posición (nº aleatorio del 1 al 6)
        dado.addEventListener("click", (ev) => {
            if (dadoTirado) {
                alert("El dado ya está tirado");
            }
            else {
                funcionDado(ev);
            }
        });
        document.getElementById("primeraCelda").style.background = "";
    });
}

function inicio() {
    // Botón para iniciar juego
    let botonInit = document.createElement("button");
    botonInit.appendChild(document.createTextNode("Iniciar juego"));
    document.body.appendChild(botonInit);

    // Al dar click al botón de iniciar juego, se crea la tabla, personaje y 
    // botón para sacar primera tirada del dado
    botonInit.addEventListener("click", (ev) => {
        botonInit.remove();

        // Creamos tabla
        crearTabla();

        // Caracter
        caracter(document.getElementsByTagName("td")[0]);
        
        // Botón para lanzar la primera tirada del dado y empezar la partida
        crearBotonEmpezar();
    })
}

window.onload = inicio;