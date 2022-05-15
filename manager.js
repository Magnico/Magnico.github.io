var SOS = 60;
var MARCO = 10;
var N_MARCO = 2;
var PROG = 40;
var DISCO = [];
var SO = [[],[]]
var PROCESO = [[],[]];
var ACCIONES = [[],[]]
function sortV(vec){
    return vec.sort(function() {return Math.random()-0.5})
}

//__ INICIO __//
function validarData(){
    var so = document.getElementById('tam_SO').value
    var marco = document.getElementById('tam_MAR').value
    var prog = document.getElementById('tam_PROG').value
    if (so > 0 & marco > 0 &  prog > 0) {
        SOS = so
        MARCO = marco
        PROG = prog
        alert('Data buena valecita')
        iniciarDisco()
        return true
    }
    alert('Que dices loco pon eso bien')
    return false
}
function crearProceso(){
    for (let i = 0; i < parseInt(PROG/MARCO); i++) {
        PROCESO[0].push(i)
        PROCESO[1].push(i)
    }

    inHtml = "<thead><tr><th scope=\"col\">PAGINA</th><th scope=\"col\">MARCO</th></tr></thead><tbody>"
    PROCESO[1] = sortV(PROCESO[1])
    for (let i = 0; i < PROCESO[0].length; i++) {
        inHtml += '<tr><td>'+PROCESO[0][i]+'</td><td>'+PROCESO[1][i]+'</td></tr>'
    }
    inHtml += "</tbody>"
    document.getElementById('pro_T').innerHTML = inHtml
}
function crearSO(){
    for (let i = 0; i < parseInt(SOS/MARCO); i++) {
        SO[0].push(i)
        SO[1].push(i+2+parseInt(PROG/MARCO))
    }
    SO[1] = sortV(SO[1])
}
function iniciarDisco(){
    crearProceso()
    crearSO()
    for (let index = 0; index < PROCESO[0].length; index++) {
        DISCO.push('P'+PROCESO[0][PROCESO[1].indexOf(index)])
    }
    for (let index = 0; index < N_MARCO; index++) {
        DISCO.push('M'+index)
    }
    for (let index = 2+parseInt(PROG/MARCO); index < SO[0].length+2+parseInt(PROG/MARCO); index++) {
        DISCO.push('SO'+SO[0][SO[1].indexOf(index)])
    }
    inHtml = ''
    DISCO.forEach(D => {
        inHtml += '<div class="proceso box">'+D+'</div>\n'
    });
    document.getElementById('disco_T').innerHTML =  inHtml
}

//__ INPUT SEÑALES __//
function ingresarSeñal(){
    dir = document.getElementById('dirLog').value
    acc = document.getElementById('acTion').value
    ACCIONES[0].push(dir)
    ACCIONES[1].push(acc)
    inHtml = ""
    for (let i = 0; i < ACCIONES[0].length; i++) {
        inHtml += ""
    }
    document.getElementById('input_T').innerHTML = inHtml
}

function testing(){
    return {'P': PROCESO, 'S':SO,'D':DISCO}
}