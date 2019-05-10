

//y0
var y0= 215;
var y1= 230;
var y2= 245;
var x0= 25;
var x1= 50;

var L= {
"a":{"v":"A","x":1,"y":0},
"b":{"v":"B","x":2,"y":0},
"c":{"v":"C","x":3,"y":0},
"d":{"v":"D","x":4,"y":0},
"e":{"v":"E","x":5,"y":0},
"f":{"v":"F","x":6,"y":0},

"g":{"v":"G","x":1,"y":1},
"h":{"v":"H","x":2,"y":1},
"i":{"v":"I","x":3,"y":1},
"j":{"v":"J","x":4,"y":1},
"k":{"v":"K","x":5,"y":1},
"l":{"v":"L","x":6,"y":1},
"m":{"v":"M","x":7,"y":1},
"n":{"v":"N","x": 8,"y":1},
"o":{"v":"O","x": 9,"y":1},
"p":{"v":"P","x": 10,"y":1},

"q":{"v":"Q","x": 1,"y":2},
"r":{"v":"R","x": 2,"y":2},
"s":{"v":"S","x": 3,"y":2},
"t":{"v":"T","x": 4,"y":2},
"u":{"v":"U","x": 5,"y":2},
"v":{"v":"V","x": 6,"y":2},
"w":{"v":"W","x": 7,"y":2},
"x":{"v":"X","x": 8,"y":2},
"y":{"v":"Y","x": 9,"y":2},
"z":{"v":"Z","x": 10,"y":2}
};//letras


var m_fun_dibujo= [
dibujar_base, dibujar_poste, dibujar_poste_arriba, dibujar_poste_abajo,
dibujar_cabeza, dibujar_columna,
dibujar_pata_izq, dibujar_pata_der, dibujar_brazo_izq, dibujar_brazo_der
];//m_fun_dibujo

var word= "COOLING"
var mword= word.split("")

var nfallo= 0;


var con_canv= canv.getContext("2d");
con_canv.textBaseline= "bottom";
con_canv.font= "12px sans-serif"



function jugar_hangman()
{
console.log("juega hangman")
if(typeof(dv_juego_hangman) == "undefined")
{
var dv_hangman= document.createElement("div");
dv_hangman.id= "dv_juego_hangman";
dv_hangman.style= "display:inline-block;background:white";
dv_hangman.innerHTML=`
<div
id="dv_juego_hangman_tit"
style="display:flex;
flex-direction:row;
justify-content:center;
border:1px solid;">
<div
id="dv_juego_hangman_titulo"
style="width:70%;
text-align:center;">Hangman</div>
<div
id="dv_juego_hangman_cerrar"
style="width:30%;
text-align:center;
border:1px solid;"
onclick="cerrar_hangman()">X</div>
</div><!-- dv juego hangman tit -->
<div id="dv_juego_hangman_cont">
<canvas
id="canv"
style="border:1px solid;
width:300px;height:300px"
width="300" height="300"></canvas>
<div id="dv_definicion_juego"></div>
</div><!-- dv juego hangman cont-->
`;
dv_con_play.appendChild(dv_hangman);
con_canv= canv.getContext("2d");
con_canv.textBaseline= "bottom";
con_canv.font= "12px sans-serif"
//setTimeout(function(){
dibujar_new_game();//},2000);
}//if no dv_juego_hangman
}//jugar_hangman


function cerrar_hangman()
{
console.log("cierra hangman")
dv_con_play.removeChild(dv_juego_hangman);
}//cerrar_hangman






function nuevo_juego(ev)
{
console.log("nuevo juego")
var x= ev.clientX-canv.offsetLeft, y= ev.clientY-canv.offsetTop-98;
console.log(x+" - "+y)
if(dentro_de_rango(x, 90, 90+100) && dentro_de_rango(y, 130, 130+20))
{
console.log("nuevo juego")
cargando_juego();
aleatoria_wordnik();    
//arrancar_nuevo_juego();
}//if
}//nuevo_juego


function cargando_juego()
{
console.log("carga juego")
con_canv.clearRect(0, 0, canv.width, canv.height)
con_canv.fillText("LOADING . . .", 100, 150);
con_canv.strokeRect(90, 130, 100, 20)
}//cargando_juego


function arrancar_nuevo_juego()
{
console.log("arranca nuevo juego")
dv_definicion_juego.innerHTML= "";
con_canv.clearRect(0, 0, canv.width, canv.height)
//word= "happening".toUpperCase().split("");//!!! da nueva palabra
dibujar_wordlin(mword)
dibujar_letra_en_word([mword[0], 0]);
mword[0]= 1;
dibujar_letra_en_word([mword[mword.length-1], mword.length-1]);
mword[mword.length-1]= 1;
dibujar_abc();
canv.onclick= tocar_letra_en_canvas;
m_fun_dibujo[0]();
m_fun_dibujo[1]();
m_fun_dibujo[2]();
m_fun_dibujo[3]();
nfallo= 4;
}//arrancar_nuevo_juego


function dentro_de_rango(vx, x1, x2)
{
console.log("dentro de rango")
if(x1 <= vx && vx <= x2)  return true;
else  return false;
}//dentro_de_rango

//dibujar_new_game();

function dibujar_new_game()
{
console.log("dibuja new game")
con_canv.clearRect(0,0,canv.width,canv.height)
con_canv.fillText("NEW GAME",100,150);
con_canv.strokeRect(90,130,100,20)
canv.onclick= nuevo_juego;
}//dibujar_new_game


function dibujar_definicion()
{
console.log("dibuja definicion")
con_canv.fillText("DEFINITION", 25, 70);
con_canv.strokeRect(20, 50, 100, 20);
}//dibujar_definicion


function dibujar_new_game2()
{
console.log("dibuja new game2")
dibujar_definicion();
con_canv.clearRect(0, 190, canv.width, canv.height)
con_canv.fillText("NEW GAME", 100, 150+100);
con_canv.strokeRect(90, 130+100, 100, 20)
canv.onclick= nuevo_juego2;
}//dibujar_new_game2


function nuevo_juego2(ev)
{
console.log("nuevo juego2: "+ev)
var x= ev.clientX-canv.offsetLeft, y= ev.clientY-canv.offsetTop-98;
if(dentro_de_rango(x, 90, 190) && dentro_de_rango(y, 130+100, 150+100))
{
console.log("nuevo juego")
cargando_juego();
aleatoria_wordnik();    
//arrancar_nuevo_juego();
}//if
else if(dentro_de_rango(x, 20, 20+100) && dentro_de_rango(y, 50, 50+20))
{
console.log("dar definicion")
dar_definicion();
}//else definicion
}//nuevo_juego2


function dar_definicion()
{
console.log("da definicion")
definicion_wordnik(word, dv_definicion_juego);
/*dvdefinicionjuego.innerHTML= word
+"<br>"+"definicion...";*/
}//dar_definicion


function dibujar_base()
{
  console.log("dibuja base")
  dibujar_linea(125, 120+50, 275, 120+50)//base
}//dibujar_base
function dibujar_poste()
{
  console.log("dibuja poste")
  dibujar_linea(225, 120+50, 225, 25+50)//poste
}//dibujar_poste
function dibujar_poste_arriba()
{
console.log("dibuja poste arriba")
dibujar_linea(225, 25+50, 175, 25+50)//poste arriba
}//dibujar_poste_arriba
function dibujar_poste_abajo()
{
console.log("dibuja poste abajo")
dibujar_linea(175, 25+50, 175, 50+50)//poste abajo
}//dibujar_poste_abajo
function dibujar_cabeza()
{
console.log("dibuja cabeza")
con_canv.beginPath();
con_canv.arc(175, 60+50, 10, 0, 2*Math.PI);
con_canv.stroke();
con_canv.closePath()
}//dibujar_cabeza
function dibujar_sonrisa()
{
console.log("dibuja sonrisa")
con_canv.beginPath();
con_canv.strokeStyle= "green";
con_canv.arc(175, 60+50, 6, 0, 1*Math.PI);
con_canv.stroke();
con_canv.strokeStyle="black";
con_canv.closePath()
}//dibujar_sonrisa
function dibujar_tristeza()
{
console.log("dibuja sonrisa")
con_canv.beginPath();
con_canv.strokeStyle= "red";
con_canv.arc(175, 60+50+6, 6, 1*Math.PI, 2*Math.PI);
con_canv.stroke();
con_canv.strokeStyle= "black";
con_canv.closePath()
}//dibujar_tristeza
function dibujar_columna()
{
console.log("dibuja columna")
dibujar_linea(175, 70+50, 175, 100+50)//columna
}//dibujar_columna
function dibujar_pata_izq()
{
console.log("dibuja pata izq")
dibujar_linea(175, 100+50, 165, 110+50)//pata izq
}//dibujar_pata_izq
function dibujar_pata_der()
{
console.log("dibuja pata der")
dibujar_linea(175, 100+50, 185, 110+50)//pata der
}//dibujar_pata_der
function dibujar_brazo_izq()
{
console.log("dibuja brazo izq")
dibujar_linea(175, 80+50, 155, 70+50)//brazo izq
}//dibujar_brazo_izq
function dibujar_brazo_der()
{
console.log("dibuja brazo der")
dibujar_linea(175, 80+50, 195, 70+50)//brazo der
alert("HANGED!\n\n"+word)
dibujar_tristeza();
word.toUpperCase().split("").forEach(function(v, i){
dibujar_letra_en_word([v,i], "red");
});//foreach recolor word
//dar definicion!!!
dibujar_new_game2();
}//dibujar_brazo_der





//dibujar_wordlin(word)

function dibujar_wordlin(mwordf)
{
console.log("dibuja wordlin : wordf")
mwordf.forEach(function(v, i)
{
dibujar_linea(i*25+25, 30, i*25+25+20, 30);
});
}//dibujar_word


function dibujar_letra_en_word(letpos, color)
{
console.log("dibuja letra en word:"+letpos+"/-/"+color)
con_canv.fillStyle= color || con_canv.fillStyle;
con_canv.fillText(letpos[0], letpos[1]*25+25+5, 30)
con_canv.fillStyle= "black";
}//dibujar_letra_en_word


//dibujar_abc();

function dibujar_abc()
{
console.log("dibuja abc")
for(var l in L)
{
dibujar_letra(L[l]);
}//for L
}//dibujar_abc



function toco_letra(x, y, l)
{
console.log("toco letra")
if(dentro_de_rango(x, l.x*25-5, l.x*25+20))
{
if(dentro_de_rango(y, l.y*15+215-15, l.y*15+215) )
{
var menc= [];
for(var i=0; i < mword.length; i++)
{
if(mword[i] == l.v)
{
menc.push([mword[i],i])
mword[i]= 1;
}//if
}//for mword
menc.forEach(function(letpos)
{
dibujar_letra_en_word(letpos);
dibujar_linea_en_letra(l,"green")
})
if(menc.length == 0)
{
dibujar_linea_en_letra(l, "red")
m_fun_dibujo[nfallo]();
nfallo++;
//dibujar ahorcadero
}//if
if(mword.reduce(function(a, b){return a+b}) == word.length)
{
dibujar_sonrisa();
word.toUpperCase().split("").forEach(function(v, i)
{
dibujar_letra_en_word([v, i], "green");
});//foreach recolor word
//alert("Guessed!\n\n"+word)
dibujar_new_game2();
}//if word completada
console.log("toco letra")
}//if y dentro
}//if x dentro
}//toco_letra


function tocar_letra_en_canvas(ev)
{
console.log("toca letra en canvas")
var x= ev.clientX-canv.offsetLeft, y= ev.clientY-canv.offsetTop-98;
for(var l in L)
{
toco_letra(x, y, L[l]);
}//for
}//tocar_letra_en_canvas


function dibujar_letra(l)
{
console.log("dibuja letra:"+l)
con_canv.fillText(l.v, l.x*25+5, l.y*15+215);
con_canv.strokeRect(l.x*25, (l.y*15+215)-15, 20, 15);
}//dibujar_letra


function dibujar_linea_en_letra(l, color)
{
console.log("dibuja linea en letra:"+l+"/-/"+color)
dibujar_linea(l.x*25, l.y*15+215, l.x*25+20, l.y*15+215-15, color)
}//dibujar_linea_en_letra

function dibujar_linea(x1, y1, x2, y2, color)
{
console.log("dibuja linea : x1y1x2y2 color")
var colant= con_canv.strokeStyle;
con_canv.strokeStyle= color || "black";
con_canv.beginPath()
con_canv.moveTo(x1, y1);
con_canv.lineTo(x2, y2);
con_canv.closePath()
con_canv.stroke();
con_canv.strokeStyle= colant;
}//dibujar_linea


function aleatoria_wordnik(wordf)
{
//definicion wordnik wordnet.3.0     
console.log("aleatoria wordnik")
var hk= "https://cors-anywhere.herokuapp.com/";     
//var url1="http://api.wordnik.com:80/v4/word.json/";//definicion
var url1= "https://api.wordnik.com/v4/words.json/";//aleatorio
//var url2="/hyphenation?useCanonical=true&limit=50&api_key="+
//var url2="/definitions?sourceDictionaries=wordnet&useCanonical=true&includeRelated=true"
var url2= "/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=10"
+"&api_key=b986324a786a6d94d00060ded100c020a49a6a49d8f93c9b3";
//"a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";  //de prueba
var xhr= new XMLHttpRequest();  
xhr.open("GET", hk+url1+/*wordf+*/url2, true);
xhr.onload = function()
{
// console.log(this.response)          
var resp= JSON.parse(this.response);//matriz objetos{id,word}
word= resp.word.toUpperCase();
mword= word.split("");
arrancar_nuevo_juego();
};//onload
xhr.onerror= function()
{
console.log("no cargo")
word= "GHOST";
mword= word.split("");
arrancar_nuevo_juego();
}//onerror xhr
xhr.send();
}//aleatoria_wordnik


function definicion_wordnik(wordf,dv_resultf)
{
//definicion wordnik wordnet.3.0     
console.log("define wordnik")
var hk= "https://cors-anywhere.herokuapp.com/";          
var url1= "http://api.wordnik.com:80/v4/word.json/";
//var url2="/hyphenation?useCanonical=true&limit=50&api_key="+
var url2= "/definitions?sourceDictionaries=wordnet&useCanonical=true&includeRelated=true"+"&api_key=b986324a786a6d94d00060ded100c020a49a6a49d8f93c9b3";
//"a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";  //de prueba      
var xhr= new XMLHttpRequest();   
xhr.open("GET", hk+url1+wordf+url2, true);    
dv_resultf.innerHTML = "loading...";    
xhr.onload = function()
{
console.log("found: "+wordf);
var resp= JSON.parse(this.response);//matriz objetos
console.log(resp)    
var list= "";
for(var pr in resp)
{
var rel_words="";    
//console.log(resp[pr].relatedWords[0].words)
if(resp[pr].relatedWords.length !== 0)
{
resp[pr].relatedWords[0].words.forEach(function(v)
{
rel_words+= v+", "
});//for each
}//if related words  
list+= resp[pr].partOfSpeech+". "
+resp[pr].text+"<br>"
+"["+rel_words+"]<br>";
}//for
dv_resultf.innerHTML= list;
};//onload
xhr.onerror= function(){
dv_resultf.innerHTML= "no found";
}//onerror xhr
xhr.send();
}//definicion_wordnik