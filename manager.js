const N_MARCO = 2;
var SOS, MARCO, PROG;
var DISCO = [];
var SO = [[], []];
var PROCESO = [[], [], [], [], []]; // Pag - DirFisc - v/i - sucio - Tiempo
var ACCIONES = [[], [], [], [], [], [], []]; //DirLog - Acc - DirFis - Pag - Marco - SwIn - SwOut
var MARCOS_STATUS = [[], []]; // Marco - Pag
var NextMarco = 0;
var PageFallos = 0;
var Reemplazos = 0;
var ITER = 0;
var COUNTER = 0;
var EJEC = false;
var timer = setInterval(()=>{
  if (ITER < ACCIONES[0].length & EJEC) {
  COUNTER+=0.5;
  document.getElementById("avancemosColombia").style = "width: "+(COUNTER%100)+"%";
  document.getElementById("numeroIteracion").value = "Iteración "+(ITER+1);
  if(COUNTER%100+1 == 100){
    solicitudAcc(ITER);
    ejecutar();
  }
  }
},20)
function sortV(vec) {
  return vec.sort(function () {
    return Math.random() - 0.5;
  });
}

//__ INICIO __//

function iniciar() {
  ACCIONES = [[], [], [], [], [], [], []];
  DISCO = [];
  SO = [[], []];
  PROCESO = [[], [], [], [], []];
  MARCOS_STATUS = [[], []];
  NextMarco = 0;
  PageFallos = 0;
  Reemplazos = 0;
  ITER = 0;
  COUNTER = 0;
  EJEC = false;
  document.getElementById("ejecucion").style = "display: none;";
  document.getElementById("marco_disco").style = "display: flex;";
  document.getElementById("accBtn").disabled = false;
  document.getElementById("ejecBtn").disabled = true;
  document.getElementById("iteracionContainer").style = "display: none;";
}

function validarData() {
  iniciar();
  var so = document.getElementById("tam_SO").value;
  var marco = document.getElementById("tam_MAR").value;
  var prog = document.getElementById("tam_PROG").value;
  if ((so > 0) & (marco > 0) & (prog > 0)) {
    SOS = parseInt(so);
    MARCO = parseInt(marco);
    PROG = parseInt(prog);
    iniciarDisco();
    return true;
  }
  return false;
}
function crearProceso() {
  for (let i = 0; i < PROG / MARCO; i++) {
    PROCESO[0].push(i);
    PROCESO[1].push(i);
    PROCESO[2].push(0);
    PROCESO[3].push(0);
    PROCESO[4].push(0);
  }

  inHtml =
    '<thead><tr><th scope="col">PAGINA</th><th scope="col">MARCO</th></tr></thead><tbody>';
  PROCESO[1] = sortV(PROCESO[1]);
  for (let i = 0; i < PROCESO[0].length; i++) {
    inHtml +=
      "<tr><td>" + PROCESO[0][i] + "</td><td>" + PROCESO[1][i] + "</td></tr>";
  }
  inHtml += "</tbody>";
  document.getElementById("pro_T").innerHTML = inHtml;
}
function crearSO() {
  for (let i = 0; i < SOS / MARCO; i++) {
    SO[0].push(i);
    SO[1].push(i + 2 + parseInt(PROG / MARCO));
  }
  SO[1] = sortV(SO[1]);
}
function iniciarDisco() {
  crearProceso();
  crearSO();
  for (let index = 0; index < PROCESO[0].length; index++) {
    DISCO.push("P" + PROCESO[0][PROCESO[1].indexOf(index)]);
  }
  for (let index = 0; index < N_MARCO; index++) {
    DISCO.push("M" + index);
    MARCOS_STATUS[0].push("M" + index);
    MARCOS_STATUS[1].push("");
  }
  for (
    let index = 2 + parseInt(PROG / MARCO);
    index < SO[0].length + 2 + parseInt(PROG / MARCO);
    index++
  ) {
    DISCO.push("SO" + SO[0][SO[1].indexOf(index)]);
  }
  inHtml = "";
  DISCO.forEach((D) => {
    inHtml += '<div class="proceso box">' + D + "</div>\n";
  });
  document.getElementById("ejecucion").style = "display: initial;";
  document.getElementById("disco_T").innerHTML = inHtml;
}

//__ INPUT SEÑALES __//
function ingresarSeñal() {
  document.getElementById("ejecBtn").disabled = false;
  var dir = document.getElementById("dirLog").value;
  var acc = document.getElementById("acTion").value;
  if ((dir >= 0) & (dir < PROG)) {
    ACCIONES[0].push(dir);
    ACCIONES[1].push(acc);
    inHtml = "";
    let a = "<tr><th>Dir. Lógica</th>",
      b = "<tr><th>Acciones</th>";
    for (let i = 0; i < ACCIONES[0].length; i++) {
      a += "<td>" + ACCIONES[0][i] + "</td>";
      b += "<td>" + ACCIONES[1][i] + "</td>";
    }
    a += "</tr>";
    b += "</tr>";
    inHtml = a + b;
    document.getElementById("acc_T").innerHTML = inHtml;
    return true;
  }
  return false;
}
function consultarMarco(NumPag, acc) {
  var m = MARCOS_STATUS[1].indexOf("P" + NumPag);
  var SwOut = "";
  var SwIn = "";
  if (m == -1) {
    //LA PAGINA NO ESTÁ EN LOS MARCOS
    SwIn = "X";
    PageFallos++; // COMO NO ESTÁ LA PAGINA HAY FALLO DE PAGINA
    if (MARCOS_STATUS[1][NextMarco] != "") {
      //COMPROBAMOS SI EL PROXIMO MARCO ESTÁ VACIO
      //EL PROXIMO MARCO NO ESTÁ VACIO
      Reemplazos++; // HAY REEMPLAZO
      index = parseInt(MARCOS_STATUS[1][NextMarco].substr(-1));
      //BUSCAMOS EL LA PAGINA QUE ESTABA EN EL MARCO
      if (PROCESO[3][index] == 1) {
        //VERIFICAMOS SI HUBO HAY SWAPOUT
        SwOut = "X";
      }
      PROCESO[2][index] = 0;
      PROCESO[3][index] = 0;
    }
    MARCOS_STATUS[1][NextMarco] = "P" + NumPag;
    PROCESO[2][NumPag] = 1;
    NextMarco = (NextMarco + 1) % 2;
  }

  if (acc == "E") {
    PROCESO[3][NumPag] = 1;
  }
  m = MARCOS_STATUS[1].indexOf("P" + NumPag);
  var marco = MARCOS_STATUS[0][m];
  return { SwOut: SwOut, SwIn: SwIn, Marco: marco };
}

function solicitudAcc(iter) {
  var DirLog = ACCIONES[0][iter];
  var Acc = ACCIONES[1][iter];
  var NumPag = parseInt(DirLog / MARCO);
  var Desp = DirLog % MARCO;
  var DirFisc = PROCESO[1][PROCESO[0].indexOf(NumPag)] * MARCO + Desp;
  var obj = consultarMarco(NumPag, Acc);
  var { SwOut, SwIn, Marco } = obj;
  //DirLog - Acc - DirFis - Pag - Marco - SwIn - SwOut
  ACCIONES[2][iter] = DirFisc; //DirFis
  ACCIONES[3][iter] = NumPag; //Pag
  ACCIONES[4][iter] = Marco; //Mar
  ACCIONES[5][iter] = SwIn; //SwIn
  ACCIONES[6][iter] = SwOut; //SwOut
  console.log('iteracion terminada',iter)
  ITER++;
}

function ejecutar() {
  document.getElementById("iteracionContainer").style = "display: initial;";
  EJEC = true;
  var padre = document.getElementById("tablaprueba");
  var tabla = document.getElementById("pro_T20");
  if (tabla.childNodes[3] != undefined) tabla.removeChild(tabla.childNodes[3]);
  var tbd = document.createElement("tbody");
  for (let i = 0; i < PROCESO[0].length; i++) {
    var hilera = document.createElement("tr");
    for (let j = 0; j < PROCESO.length; j++) {
      var celda = document.createElement("td");
      var text = document.createTextNode(PROCESO[j][i]);
      celda.appendChild(text);
      hilera.appendChild(celda);
    }
    tbd.appendChild(hilera);
  }
  tabla.appendChild(tbd);
  padre.appendChild(tabla);

  v = [
    "ITERACION",
    "DIR LOG",
    "ACCION",
    "DIR FISC",
    "PAGINA",
    "MARCO",
    "SW IN",
    "SW OUT",
  ];
  padre = document.getElementById("padreitr");
  tabla = document.getElementById("itr_T");
  tbd = document.createElement("tbody");
  tabla.removeChild(tabla.childNodes[1]);
  for (let i = 1; i < v.length; i++) {
    var hilera = document.createElement("tr");
    for (let j = 0; j <= ACCIONES[0].length; j++) {
      if (j == 0) {
        var celda = document.createElement("th"); //
        var text = document.createTextNode(v[i]);
      } else {
        let tex = ACCIONES[i - 1][j - 1];
        var celda = document.createElement("td");
        var text = document.createTextNode(tex == undefined ? "" : tex);
      }
      celda.appendChild(text);
      hilera.appendChild(celda);
    }
    tbd.appendChild(hilera);
  }
  tabla.appendChild(tbd) / padre.appendChild(tabla);
  debugger;
}


