//fecha 20-09-18, 


//y0
var y0= 215;
var y1= 230;
var y2= 245;
var x0=25;
var x1=50;

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


var mfundibujo= [
 dibujar_base, dibujar_poste, dibujar_poste_arriba, dibujar_poste_abajo,
 dibujar_cabeza, dibujar_columna,
  dibujar_pata_izq, dibujar_pata_der, dibujar_brazo_izq, dibujar_brazo_der
];//mfundibujo

var word= "COOLING"
var mword= word.split("")

var nfallo=0;


var concanv= canv.getContext("2d");
concanv.textBaseline= "bottom";
concanv.font= "12px sans-serif"



function jugar_hangman(){

 if(typeof(dvjuegohangman)=="undefined"){
  var dvhangman= document.createElement("div");
  dvhangman.id="dvjuegohangman";
  dvhangman.style="display:inline-block;background:white";

  dvhangman.innerHTML=`
<div id="dvjuegohangman_tit"
     style="display:flex;
            flex-direction:row;
            justify-content:center;
            border:1px solid;">
<div id="dvjuegohangman_titulo"
     style="width:70%;
            text-align:center;">Hangman</div>
<div id="dvjuegohangman_cerrar"
     style="width:30%;
            text-align:center;
            border:1px solid;"
     onclick="cerrar_hangman()">X</div>
</div><!-- dv juego hangman tit -->

<div id="dvjuegohangman_cont">

<canvas id="canv"
        style="border:1px solid;
        width:300px;height:300px"
        width="300" height="300"></canvas>

<div id="dvdefinicionjuego"></div>

</div><!-- dv juego hangman cont-->

  `;


 dvcongame.appendChild(dvhangman);

 concanv= canv.getContext("2d");
 concanv.textBaseline= "bottom";
 concanv.font= "12px sans-serif"

 //setTimeout(function(){
   dibujar_new_game();//},2000);

 }//if no dvjuegohangman
}//jugar_hangman


function cerrar_hangman(){
  dvcongame.removeChild(dvjuegohangman);
}//cerrar_hangman






function nuevo_juego(ev){
  var x= ev.clientX-canv.offsetLeft, y= ev.clientY-canv.offsetTop-98;
  console.log(x+" - "+y)
  if(dentro_de_rango(x,90,90+100)&&dentro_de_rango(y,130,130+20)){
    console.log("nuevo juego")
    cargando_juego();
    aleatoria_wordnik();    
    //arrancar_nuevo_juego();
  }//if
}//nuevo_juego


function cargando_juego(){
   concanv.clearRect(0,0,canv.width,canv.height)
 concanv.fillText("LOADING . . .",100,150);
 concanv.strokeRect(90,130,100,20)
}//cargando_juego


function arrancar_nuevo_juego(){
  dvdefinicionjuego.innerHTML= "";
  concanv.clearRect(0,0,canv.width,canv.height)
  //word= "happening".toUpperCase().split("");//!!! da nueva palabra
  dibujar_wordlin(mword)
  dibujar_abc();
  canv.onclick= tocar_letra_en_canvas;
  mfundibujo[0]();
  mfundibujo[1]();
  mfundibujo[2]();
  mfundibujo[3]();
  nfallo=4;
}//arrancar_nuevo_juego


function dentro_de_rango(vx,x1,x2){
  if(x1<=vx&&vx<=x2)  return true;
  else  return false;
}//dentro_de_rango

//dibujar_new_game();

function dibujar_new_game(){
 concanv.clearRect(0,0,canv.width,canv.height)
 concanv.fillText("NEW GAME",100,150);
 concanv.strokeRect(90,130,100,20)
 canv.onclick= nuevo_juego;
}//dibujar_new_game


function dibujar_definicion(){
  concanv.fillText("DEFINITION",25,70);
  concanv.strokeRect(20,50,100,20);
}//dibujar_definicion


function dibujar_new_game2(){
  dibujar_definicion();
  concanv.clearRect(0,190,canv.width,canv.height)

 concanv.fillText("NEW GAME",100,150+100);
 concanv.strokeRect(90,130+100,100,20)
 canv.onclick= nuevo_juego2;
}//dibujar_new_game2


function nuevo_juego2(ev){
  var x= ev.clientX-canv.offsetLeft, y= ev.clientY-canv.offsetTop-98;
  if(dentro_de_rango(x,90,190)&&dentro_de_rango(y,130+100,150+100)){
    console.log("nuevo juego")
    cargando_juego();
    aleatoria_wordnik();    
    //arrancar_nuevo_juego();
  }//if
  else if(dentro_de_rango(x,20,20+100)&&dentro_de_rango(y,50,50+20)){
    console.log("dar definicion")
    dar_definicion();
  }//else definicion
}//nuevo_juego2


function dar_definicion(){
  definicion_wordnik(word,dvdefinicionjuego);
  /*dvdefinicionjuego.innerHTML= word
     +"<br>"+"definicion...";*/
}//dar_definicion


function dibujar_base(){
  dibujar_linea(125,120+50,275,120+50)//base
}//dibujar_base
function dibujar_poste(){
  dibujar_linea(225,120+50,225,25+50)//poste
}//dibujar_poste
function dibujar_poste_arriba(){
  dibujar_linea(225,25+50,175,25+50)//poste arriba
}//dibujar_poste_arriba
function dibujar_poste_abajo(){
  dibujar_linea(175,25+50,175,50+50)//poste abajo
}//dibujar_poste_abajo
function dibujar_cabeza(){
  concanv.beginPath();
  concanv.arc(175,60+50,10,0,2*Math.PI);
  concanv.stroke();
  concanv.closePath()
}//dibujar_cabeza
function dibujar_sonrisa(){
    concanv.beginPath();
    concanv.strokeStyle="green";
  concanv.arc(175,60+50,6,0,1*Math.PI);
  concanv.stroke();
      concanv.strokeStyle="black";
  concanv.closePath()
}//dibujar_sonrisa
function dibujar_tristeza(){
    concanv.beginPath();
    concanv.strokeStyle="red";
  concanv.arc(175,60+50+6,6,1*Math.PI,2*Math.PI);
  concanv.stroke();
      concanv.strokeStyle="black";
  concanv.closePath()
}//dibujar_tristeza
function dibujar_columna(){
  dibujar_linea(175,70+50,175,100+50)//columna
}//dibujar_columna
function dibujar_pata_izq(){
  dibujar_linea(175,100+50,165,110+50)//pata izq
}//dibujar_pata_izq
function dibujar_pata_der(){
  dibujar_linea(175,100+50,185,110+50)//pata der
}//dibujar_pata_der
function dibujar_brazo_izq(){
  dibujar_linea(175,80+50,155,70+50)//brazo izq
}//dibujar_brazo_izq
function dibujar_brazo_der(){
  dibujar_linea(175,80+50,195,70+50)//brazo der
  alert("HANGED!\n\n"+word)
  dibujar_tristeza();

  word.toUpperCase().split("").forEach(function(v,i){
    dibujar_letra_en_word([v,i],"red");
  });//foreach recolor word

  //dar definicion!!!
  dibujar_new_game2();
}//dibujar_brazo_der





//dibujar_wordlin(word)

function dibujar_wordlin(mwordf){
  mwordf.forEach(function(v,i){

  dibujar_linea(i*25+25,30,i*25+25+20,30);
  });
}//dibujar_word


function dibujar_letra_en_word(letpos,color){
  concanv.fillStyle= color||concanv.fillStyle;
 concanv.fillText(letpos[0],letpos[1]*25+25+5,30)
 concanv.fillStyle="black";
}//dibujar_letra_en_word


//dibujar_abc();

function dibujar_abc(){
  for(var l in L){
    dibujar_letra(L[l]);
  }//for L
}//dibujar_abc



function toco_letra(x,y,l){

  if(dentro_de_rango(x,l.x*25-5,l.x*25+20)){

    if(dentro_de_rango(y,l.y*15+215-15,l.y*15+215) ){

      var menc=[];

      for(var i=0;i<mword.length;i++){
          if(mword[i]==l.v){
            menc.push([mword[i],i])
            mword[i]=1;
          }//if
          
      }//for mword

      menc.forEach(function(letpos){
         dibujar_letra_en_word(letpos);
         dibujar_linea_en_letra(l,"green")
      })

      if(menc.length==0){
         dibujar_linea_en_letra(l,"red")
         mfundibujo[nfallo]();
         nfallo++;
         //dibujar ahorcadero
      }//if

      if(mword.reduce(function(a,b){return a+b})==word.length){
         dibujar_sonrisa();

          word.toUpperCase().split("").forEach(function(v,i){
            dibujar_letra_en_word([v,i],"green");
          });//foreach recolor word

         //alert("Guessed!\n\n"+word)
         dibujar_new_game2();
         
      }//if word completada

      console.log("toco letra")
   }//if y dentro
  }//if x dentro
}//toco_letra


function tocar_letra_en_canvas(ev){

  var x= ev.clientX-canv.offsetLeft, y= ev.clientY-canv.offsetTop-98;

    for(var l in L){
      toco_letra(x,y,L[l]);
    }//for
}//tocar_letra_en_canvas


function dibujar_letra(l){
 
 concanv.fillText(l.v,l.x*25+5,l.y*15+215);
 concanv.strokeRect(l.x*25,(l.y*15+215)-15,20,15);
}//dibujar_letra


function dibujar_linea_en_letra(l,color){

  dibujar_linea(l.x*25,l.y*15+215,l.x*25+20,l.y*15+215-15,color)
}//dibujar_linea_en_letra

function dibujar_linea(x1,y1,x2,y2,color){
 var colant= concanv.strokeStyle;
  concanv.strokeStyle= color||"black";
  concanv.beginPath()
  concanv.moveTo(x1,y1);
  concanv.lineTo(x2,y2);
  concanv.closePath()
  concanv.stroke();

 concanv.strokeStyle= colant;
}//dibujar_linea

function aleatoria_wordnik(wordf){
 //definicion wordnik wordnet.3.0     

 var hk="https://cors-anywhere.herokuapp.com/";     
      
 //var url1="http://api.wordnik.com:80/v4/word.json/";//definicion
 var url1="https://api.wordnik.com/v4/words.json/";//aleatorio
    
 //var url2="/hyphenation?useCanonical=true&limit=50&api_key="+
 //var url2="/definitions?sourceDictionaries=wordnet&useCanonical=true&includeRelated=true"
 var url2= "/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=10"
   +"&api_key=b986324a786a6d94d00060ded100c020a49a6a49d8f93c9b3";
        //"a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";  //de prueba
  
 var xhr=new XMLHttpRequest();  
 xhr.open("GET", hk+url1+/*wordf+*/url2, true);
      
 xhr.onload = function() {
  // console.log(this.response)          
  var resp=JSON.parse(this.response);//matriz objetos{id,word}
   
   word= resp.word.toUpperCase();
   mword= word.split("");
   arrancar_nuevo_juego();
 };//onload

 xhr.onerror= function(){
   console.log("no cargo")
   word= "GHOST";
   mword= word.split("");
   arrancar_nuevo_juego();
 }//onerror xhr

 xhr.send();

}//aleatoria_wordnik


function definicion_wordnik(wordf,dvresultf){
 //definicion wordnik wordnet.3.0     
    var hk="https://cors-anywhere.herokuapp.com/";          
    var url1="http://api.wordnik.com:80/v4/word.json/";
    //var url2="/hyphenation?useCanonical=true&limit=50&api_key="+
    var url2="/definitions?sourceDictionaries=wordnet&useCanonical=true&includeRelated=true"+"&api_key=b986324a786a6d94d00060ded100c020a49a6a49d8f93c9b3";
        //"a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";  //de prueba
              
  var xhr=new XMLHttpRequest();   
  xhr.open("GET", hk+url1+wordf+url2, true);    
  dvresultf.innerHTML ="loading...";    
      
 xhr.onload = function() {
  
  console.log("found: "+wordf);
  var resp=JSON.parse(this.response);//matriz objetos
  console.log(resp)    
  var list="";
     
 for(var pr in resp){
       
      var relwords="";    
      //console.log(resp[pr].relatedWords[0].words)
      
 if(resp[pr].relatedWords.length!==0){

  resp[pr].relatedWords[0].words.forEach(function(v){
  relwords+=v+", "
  });//for each

 }//if related words
       
 list+=resp[pr].partOfSpeech+". "
      +resp[pr].text+"<br>"
      +"["+relwords+"]<br>";
 }//for
     
 dvresultf.innerHTML=list;
 };//onload

 xhr.onerror= function(){
   dvresultf.innerHTML= "no found";
 }//onerror xhr

 xhr.send();
}//definicion_wordnik