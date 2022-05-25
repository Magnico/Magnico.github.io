const fr = new FileReader();
var N_MARCO = 2;
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
var VELOCITY = 20;
var MarcoAlg = "FIFO";
setTimeout(timer, VELOCITY);

function sortV(vec) {
  return vec.sort(function () {
    return Math.random() - 0.5;
  });
}

function timer() {
  if ((ITER < ACCIONES[0].length) & EJEC) {
    COUNTER++;
    document.getElementById("avancemosColombia").style =
      "width: " +
      (COUNTER % 100) +
      "%; background-color: rgba(" +
      (220 + (-92 / 100) * (COUNTER % 100)) +
      "," +
      (20 + (235 / 100) * (COUNTER % 100)) +
      "," +
      (60 + (-60 / 100) * (COUNTER % 100)) +
      ",0.6)";
    document.getElementById("numeroIteracion").innerText =
      "Iteración " + (ITER + 1);
    if ((COUNTER % 100) + 1 == 100) {
      solicitudAcc(ITER);
      ejecutar();
    }
  }
  setTimeout(timer, VELOCITY);
}

function setVel(v, vel) {
  VELOCITY = v;
  document.getElementById("velocidadIteracion").innerText = "Velocidad: " + vel;
}

function pauseStart() {
  EJEC = !EJEC;
  let a = document.getElementById("pausado").innerText;
  document.getElementById("pausado").innerText = a == "▶" ? "⏸" : "▶";
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
  VELOCITY = 20;
  document.getElementById("ejecucion").style = "display: none;";
  document.getElementById("marco_disco").style = "display: flex;";
  document.getElementById("accBtn").disabled = false;
  document.getElementById("ejecBtn").disabled = true;
  document.getElementById("iteracionContainer").style = "display: none;";
  li = document.createElement('li')
  li.classList.add('list-group-item', 'active','bold')
  li.appendChild(document.createTextNode('BITÁCORA'))
  document.getElementById("Comments").replaceChildren(li)
  document.getElementById("falloPagina").innerHTML = 'Fallos de Página: 0'
  document.getElementById("reemplazos").innerHTML = 'Reemplazos: 0'
}

function validarData() {
  let so = document.getElementById("tam_SO").value;
  let marco = document.getElementById("tam_MAR").value;
  let prog = document.getElementById("tam_PROG").value;
  let marconum = document.getElementById("num_MAR").value;
  let alg = document.querySelector('input[name="ALG"]:checked').value;
  if ((so > 0) & (marco > 0) & (prog > 0) & (marconum > 0)) {
    iniciar();
    SOS = parseInt(so);
    MARCO = parseInt(marco);
    PROG = parseInt(prog);
    N_MARCO = parseInt(marconum);
    MarcoAlg = alg;
    iniciarDisco();
    return true;
  }
  alert("Ingrese los datos validos");
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
    '<thead><tr><th scope="col">PÁGINA</th><th scope="col">MARCO</th></tr></thead><tbody>';
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
    let clase = "";
    switch (D.charAt(0)) {
      case "M":
        clase = "disc_marco";
        break;
      case "P":
        clase = "disc_proceso";
        break;
      case "S":
        clase = "disc_SO";
        break;
      default:
        break;
    }
    inHtml += '<div class="proceso box ' + clase + '">' + D + "</div>\n";
  });
  document.getElementById("ejecucion").style = "display: initial;";
  document.getElementById("disco_T").innerHTML = inHtml;
}

//__ INPUT SEÑALES __//
function ingresarSeñales() {
  document.getElementById("ejecBtn").disabled = false;
  var file = document.getElementById("direcciones").files[0];

  if (file != undefined) {
    fr.onload = function () {
      FILE = prepararData(fr.result);
      ACCIONES[0] = FILE[0];
      ACCIONES[1] = FILE[1];
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
    };
    fr.readAsText(file);
    return true;
  }
  return false;
}

function calcNextMarcoAlg() {
  switch (MarcoAlg) {
    case "FIFO":
      console.log("Usamos el FIFO");
      NextMarco = (NextMarco + 1) % N_MARCO;
      break;
    case "LRU":
      let min = ACCIONES[0].length + 1;
      LRU = -1;
      for (let i = 0; i < PROCESO[0].length; i++) {
        if ((PROCESO[4][i] < min) & (PROCESO[2][i] == 1)) {
          min = PROCESO[4][i];
          LRU = i;
        }
      }
      console.log("Usamos el LRU");
      NextMarco = MARCOS_STATUS[1].indexOf("P" + LRU);
      break;
    case "OPT":
      let temp = [];
      let temp2 = [];
      alert('Numero de pags = ',PROCESO[0])
      console.log('Numero de pags = ',PROCESO[0])
      for (let i = 0; i < PROCESO[0].length; i++) {
        if (PROCESO[2][i] == 1) temp.push(PROCESO[0][i]);
      }
      alert(temp)
      console.log(temp)
      for (let i = 0; i < temp.length; i++) {
        step = ITER;
        while (
          (parseInt(ACCIONES[0][step] / MARCO) != temp[i]) &
          (step < ACCIONES[0].length-1)
        ) {
          step++;
        }
        temp2.push(step);
      }
      alert(temp2)
      console.log(temp2)
      console.log(Math.max(...temp2))
      OPT = temp[temp2.indexOf(Math.max(...temp2))];
      console.log("Usamos el OPT");
      NextMarco = MARCOS_STATUS[1].indexOf("P" + OPT);
      break;
    default:
      break;
  }
}

function consultarMarco(NumPag, acc) {
  let m = MARCOS_STATUS[1].indexOf("P" + NumPag);
  let SwOut = "";
  let SwIn = "";
  let oldpag = "";
  if (m == -1) {
    //LA PAGINA NO ESTÁ EN LOS MARCOS
    if (ITER != 0) {
      if (MARCOS_STATUS[1][(NextMarco + 1) % N_MARCO] == "") {
        NextMarco++;
      } else {
        calcNextMarcoAlg();
      }
    }

    SwIn = "X";
    PageFallos++; // COMO NO ESTÁ LA PAGINA HAY FALLO DE PAGINA
    if (MARCOS_STATUS[1][NextMarco] != "") {
      //COMPROBAMOS SI EL PROXIMO MARCO ESTÁ VACIO
      //EL PROXIMO MARCO NO ESTÁ VACIO
      Reemplazos++; // HAY REEMPLAZO
      index = parseInt(MARCOS_STATUS[1][NextMarco].substr(-1));
      oldpag = index;
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

    //AQUI SE CALCULABA EL PROXIMO MARCO
  }

  if (acc == "E") {
    PROCESO[3][NumPag] = 1;
  }
  m = MARCOS_STATUS[1].indexOf("P" + NumPag);
  let marco = MARCOS_STATUS[0][m];
  return { SwOut: SwOut, SwIn: SwIn, Marco: marco, OldPag: oldpag };
}

function solicitudAcc(iter) {
  let DirLog = ACCIONES[0][iter];
  let Acc = ACCIONES[1][iter];
  let NumPag = parseInt(DirLog / MARCO);
  let Desp = DirLog % MARCO;
  let DirFisc = PROCESO[1][PROCESO[0].indexOf(NumPag)] * MARCO + Desp;
  let valido = !isNaN(DirFisc);

  if (valido) {
    PROCESO[4][PROCESO[0].indexOf(NumPag)] = iter; //Tiempo
    let obj = consultarMarco(NumPag, Acc);
    var { SwOut, SwIn, Marco, OldPag } = obj;
  }
  //DirLog - Acc - DirFis - Pag - Marco - SwIn - SwOut
  ACCIONES[2][iter] = valido ? DirFisc : "N/A"; //DirFis
  ACCIONES[3][iter] = valido ? NumPag : ""; //Pag
  ACCIONES[4][iter] = valido ? Marco : ""; //Mar
  ACCIONES[5][iter] = valido ? SwIn : ""; //SwIn
  ACCIONES[6][iter] = valido ? SwOut : ""; //SwOut

  comentarista(OldPag, valido);
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
    "ITERACIÓN",
    "DIR LOG",
    "ACCIÓN",
    "DIR FISC",
    "PÁGINA",
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

  document.getElementById("falloPagina").innerText = 'Fallos de Página: '+ PageFallos
  document.getElementById("reemplazos").innerText = 'Reemplazos: '+ Reemplazos
  drawMarco();
}

function comentarista(oldpag, valido) {
  //0 DirLog - 1 Acc - 2 DirFis - 3 Pag - 4 Marco - 5 SwIn - 6 SwOut
  let celda = document.createElement("li");
  comment = "Iteración " + (ITER+1) + ": ";
  if (valido) {
    comment += ACCIONES[1][ITER] == "L" ? "Lectura Pag#" : "Escritura Pag#";
    comment += ACCIONES[3][ITER];
    comment +=
      " - " +
      (ACCIONES[5][ITER] == "X" ? "Fallo de Página" : "Página en Marcos");
    comment +=
      ACCIONES[6][ITER] == "X" ? " - Pag#" + oldpag + " Guardada en Disco" : "";
  } else {
    comment += "Dirección Lógica " + ACCIONES[0][ITER] + " Invalida";
  }

  celda.appendChild(document.createTextNode(comment));
  celda.classList.add("list-group-item");
  document.getElementById("Comments").appendChild(celda);
}

function prepararData(text) {
  let data = text.split("\n");

  data[0] = data[0].split(",");
  data[1] = data[1].split(",");
  for (let i = 0; i < data[0].length; i++) {
    data[0][i] = parseInt(data[0][i]);
    data[1][i] = data[1][i].charAt(0);
  }

  return data;
}

function drawMarco() {
  let container = document.getElementById("MarcosContainer");
  container.removeChild(document.getElementById("ToBeDeleted"));

  let table = document.createElement("ul");
  table.id = "ToBeDeleted";
  table.classList.add(
    "list-group",
    "list-group-flush",
    "shadow",
    "p-3",
    "mb-5",
    "bg-white",
    "rounded"
  );

  let header = document.createElement("li");
  let m = document.createElement("span");
  let p = document.createElement("span");
  m.appendChild(document.createTextNode("Marco"));
  p.appendChild(document.createTextNode("Página"));
  header.classList.add("list-group-item", "list-group-item-danger", "bold");
  header.appendChild(m);
  header.appendChild(p);
  header.style.display = "flex";
  header.style.justifyContent = "space-around";

  let title = document.createElement("li");
  title.appendChild(document.createTextNode("Tabla de Marcos Libres"));
  title.classList.add("list-group-item-success", "list-group-item", "bold");
  title.style.display = "flex";
  title.style.justifyContent = "space-evenly";

  table.appendChild(title);
  table.appendChild(header);
  for (let i = 0; i < MARCOS_STATUS[0].length; i++) {
    let row = document.createElement("li");
    row.style.display = "flex";
    row.style.justifyContent = "space-around";
    let c1 = document.createElement("span");
    let c2 = document.createElement("span");
    c1.appendChild(document.createTextNode(MARCOS_STATUS[0][i]));
    c2.appendChild(document.createTextNode(MARCOS_STATUS[1][i]));

    row.appendChild(c1);
    row.appendChild(c2);
    row.classList.add("list-group-item");
    table.appendChild(row);
  }
  container.appendChild(table);
}

function imprimirBitacora() {
  var ficha = document.getElementById("iteracionContainer");
  var ventimp = window.open(" ", "popimpr");
  ventimp.document.write("<html>");
  ventimp.document.write(
    '<head><link  href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"  rel="stylesheet"  integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"  crossorigin="anonymous"/><link rel="stylesheet" href="styles.css" /></head>'
  );
  ventimp.document.write("<body>" + ficha.innerHTML + "</body>");
  ventimp.document.write("</html>");
  ventimp.document.close();
  setTimeout(() => {
    ventimp.print();
    ventimp.close();
  }, 10);
}
