//despues de socket.io/socket.io.js

//conexión socket
var sktclt= io.connect();


//====entra al chat
function entrar_a_chat(){
 sktclt.emit("user va a chat",sktclt.id);
}//click tab chat



//llena tabla users chat
sktclt.on("usernames",function(userscnntf){
  //userscnnt{sktcltid:user}
  //user{_id,email,firstnm,lastnm,chats[]}
 var conusr="";

for(var usrnme in userscnntf){
  
 conusr+="<tr id=\'"+userscnntf[usrnme].sktid+
  "\' data-usrid='"+usrnme+
  "' onclick='informar_profile(this)' >"+
  "<td><img class='igprftbl' src='"+
   (userscnntf[usrnme].user.avatar||dar_imgprovisional() )+"'></td>"+
  "<td>"+userscnntf[usrnme].user.firstnm+
  " "+userscnntf[usrnme].user.lastnm+"</td>"+
  "<td>"+(userscnntf[usrnme].user.gender||"-")+"</td>"+
  "<td>"+(userscnntf[usrnme].user.age||"-")+"</td>"+
  "<td>"+(userscnntf[usrnme].user.country||"-")+"</td>"+
  "<td>"+(userscnntf[usrnme].user.learning||"-")+"</td>"+
  "<td>"+(userscnntf[usrnme].user.speaks||"-")+"</td>"+
 "</tr>";
}//for

tblusrsbd.innerHTML=conusr;

});//skon usernames table


//---------

var rooms={
"gnrl":"General",

"abk":"Abkhazian","aar":"Afar",
"afr":"Afrikaans","aka":"Akan",
"sqi":"Albanian","amh":"Amharic",
"ara":"Arabic","arg":"Aragonese",
"hye":"Armenian","asm":"Assamese",
"ava":"Avaric","ave":"Avestan",
"aym":"Aymara","aze":"Azerbaijani",
"bam":"Bambara","bak":"Bashkir",
"eus":"Basque","bel":"Belarusian",
"ben":"Bengali","bih":"Bihari languages",
"bis":"Bislama","bos":"Bosnian",
"bre":"Breton","bul":"Bulgarian",
"mya":"Burmese","cat":"Catalan, Valencian",
"khm":"Central Khmer","cha":"Chamorro",
"che":"Chechen","nya":"Chichewa, Chewa, Nyanja",
"zho":"Chinese","chu":"Church Slavic, Church Slavonic, Old Church Slavonic, Old Slavonic, Old Bulgarian",
"chv":"Chuvash","cor":"Cornish",
"cos":"Corsican","cre":"Cree",
"hrv":"Croatian","ces":"Czech",
"dan":"Danish","div":"Divehi, Dhivehi, Maldivian",
"nld":"Dutch, Flemish","dzo":"Dzongkha",
"eng":"English","epo":"Esperanto",
"est":"Estonian","ewe":"Ewe",
"fao":"Faroese","fij":"Fijian",
"fin":"Finnish","fra":"French",
"ful":"Fulah","gla":"Gaelic, Scottish Gaelic",
"glg":"Galician","lug":"Ganda",
"kat":"Georgian","deu":"German",
"ell":"Greek (modern)","grn":"Guaraní",
"guj":"Gujarati","hat":"Haitian, Haitian Creole",
"hau":"Hausa","heb":"Hebrew (modern)",
"her":"Herero","hin":"Hindi",
"hmo":"Hiri Motu","hun":"Hungarian",
"isl":"Icelandic","ido":"Ido",
"ibo":"Igbo","ind":"Indonesian",
"ina":"Interlingua","ile":"Interlingue",
"iku":"Inuktitut","ipk":"Inupiaq",
"gle":"Irish","ita":"Italian",
"jpn":"Japanese","jav":"Javanese",
"kal":"Kalaallisut, Greenlandic","kan":"Kannada",
"kau":"Kanuri","kas":"Kashmiri",
"kaz":"Kazakh","kik":"Kikuyu, Gikuyu",
"kin":"Kinyarwanda","kir":"Kirghiz, Kyrgyz",
"kom":"Komi","kon":"Kongo",
"kor":"Korean","kua":"Kuanyama, Kwanyama",
"kur":"Kurdish","lao":"Lao",
"lat":"Latin","lav":"Latvian",
"lim":"Limburgan, Limburger, Limburgish","lin":"Lingala",
"lit":"Lithuanian","lub":"Luba-Katanga",
"ltz":"Luxembourgish, Letzeburgesch","mkd":"Macedonian",
"mlg":"Malagasy","msa":"Malay",
"mal":"Malayalam","mlt":"Maltese",
"glv":"Manx","mri":"Maori",
"mar":"Marathi","mah":"Marshallese",
"mon":"Mongolian","nau":"Nauru",
"nav":"Navajo, Navaho","ndo":"Ndonga",
"nep":"Nepali","nde":"North Ndebele",
"sme":"Northern Sami","nor":"Norwegian",
"nob":"Norwegian Bokmål","nno":"Norwegian Nynorsk",
"oci":"Occitan","oji":"Ojibwa",
"ori":"Oriya","orm":"Oromo",
"oss":"Ossetian, Ossetic","pli":"Pali",
"pan":"Panjabi, Punjabi","pus":"Pashto, Pushto",
"fas":"Persian","pol":"Polish",
"por":"Portuguese","que":"Quechua",
"ron":"Romanian, Moldavian, Moldovan","roh":"Romansh",
"run":"Rundi","rus":"Russian",
"smo":"Samoan","sag":"Sango",
"san":"Sanskrit","srd":"Sardinian",
"srp":"Serbian","sna":"Shona",
"iii":"Sichuan Yi, Nuosu","snd":"Sindhi",
"sin":"Sinhala, Sinhalese","slk":"Slovak",
"slv":"Slovenian","som":"Somali",
"nbl":"South Ndebele","sot":"Southern Sotho",
"spa":"Spanish, Castilian","sun":"Sundanese",
"swa":"Swahili","ssw":"Swati",
"swe":"Swedish","tgl":"Tagalog",
"tah":"Tahitian","tgk":"Tajik",
"tam":"Tamil","tat":"Tatar",
"tel":"Telugu","tha":"Thai",
"bod":"Tibetan","tir":"Tigrinya",
"ton":"Tonga (Tonga Islands)","tso":"Tsonga",
"tsn":"Tswana","tur":"Turkish",
"tuk":"Turkmen","twi":"Twi",
"uig":"Uighur, Uyghur","ukr":"Ukrainian",
"urd":"Urdu","uzb":"Uzbek",
"ven":"Venda","vie":"Vietnamese",
"vol":"Volapük","wln":"Walloon",
"cym":"Welsh","fry":"Western Frisian",
"wol":"Wolof","xho":"Xhosa",
"yid":"Yiddish","yor":"Yoruba",
"zha":"Zhuang, Chuang","zul":"Zulu",

"mul":"MULTILINGUAL",
"Musics":"Musics","TV":"TV",
"Travel":"Travel","News":"News",
"Politics":"Politics","Religion":"Religion",
"Others":"Others",
           "bstlk":"BesTalk"
          };//rooms

var roomsxcls={lng:{
"abk":"Abkhazian","aar":"Afar",
"afr":"Afrikaans","aka":"Akan",
"sqi":"Albanian","amh":"Amharic",
"ara":"Arabic","arg":"Aragonese",
"hye":"Armenian","asm":"Assamese",
"ava":"Avaric","ave":"Avestan",
"aym":"Aymara","aze":"Azerbaijani",
"bam":"Bambara","bak":"Bashkir",
"eus":"Basque","bel":"Belarusian",
"ben":"Bengali","bih":"Bihari languages",
"bis":"Bislama","bos":"Bosnian",
"bre":"Breton","bul":"Bulgarian",
"mya":"Burmese","cat":"Catalan, Valencian",
"khm":"Central Khmer","cha":"Chamorro",
"che":"Chechen","nya":"Chichewa, Chewa, Nyanja",
"zho":"Chinese","chu":"Church Slavic, Church Slavonic, Old Church Slavonic, Old Slavonic, Old Bulgarian",
"chv":"Chuvash","cor":"Cornish",
"cos":"Corsican","cre":"Cree",
"hrv":"Croatian","ces":"Czech",
"dan":"Danish","div":"Divehi, Dhivehi, Maldivian",
"nld":"Dutch, Flemish","dzo":"Dzongkha",
"eng":"English","epo":"Esperanto",
"est":"Estonian","ewe":"Ewe",
"fao":"Faroese","fij":"Fijian",
"fin":"Finnish","fra":"French",
"ful":"Fulah","gla":"Gaelic, Scottish Gaelic",
"glg":"Galician","lug":"Ganda",
"kat":"Georgian","deu":"German",
"ell":"Greek (modern)","grn":"Guaraní",
"guj":"Gujarati","hat":"Haitian, Haitian Creole",
"hau":"Hausa","heb":"Hebrew (modern)",
"her":"Herero","hin":"Hindi",
"hmo":"Hiri Motu","hun":"Hungarian",
"isl":"Icelandic","ido":"Ido",
"ibo":"Igbo","ind":"Indonesian",
"ina":"Interlingua","ile":"Interlingue",
"iku":"Inuktitut","ipk":"Inupiaq",
"gle":"Irish","ita":"Italian",
"jpn":"Japanese","jav":"Javanese",
"kal":"Kalaallisut, Greenlandic","kan":"Kannada",
"kau":"Kanuri","kas":"Kashmiri",
"kaz":"Kazakh","kik":"Kikuyu, Gikuyu",
"kin":"Kinyarwanda","kir":"Kirghiz, Kyrgyz",
"kom":"Komi","kon":"Kongo",
"kor":"Korean","kua":"Kuanyama, Kwanyama",
"kur":"Kurdish","lao":"Lao",
"lat":"Latin","lav":"Latvian",
"lim":"Limburgan, Limburger, Limburgish","lin":"Lingala",
"lit":"Lithuanian","lub":"Luba-Katanga",
"ltz":"Luxembourgish, Letzeburgesch","mkd":"Macedonian",
"mlg":"Malagasy","msa":"Malay",
"mal":"Malayalam","mlt":"Maltese",
"glv":"Manx","mri":"Maori",
"mar":"Marathi","mah":"Marshallese",
"mon":"Mongolian","nau":"Nauru",
"nav":"Navajo, Navaho","ndo":"Ndonga",
"nep":"Nepali","nde":"North Ndebele",
"sme":"Northern Sami","nor":"Norwegian",
"nob":"Norwegian Bokmål","nno":"Norwegian Nynorsk",
"oci":"Occitan","oji":"Ojibwa",
"ori":"Oriya","orm":"Oromo",
"oss":"Ossetian, Ossetic","pli":"Pali",
"pan":"Panjabi, Punjabi","pus":"Pashto, Pushto",
"fas":"Persian","pol":"Polish",
"por":"Portuguese","que":"Quechua",
"ron":"Romanian, Moldavian, Moldovan","roh":"Romansh",
"run":"Rundi","rus":"Russian",
"smo":"Samoan","sag":"Sango",
"san":"Sanskrit","srd":"Sardinian",
"srp":"Serbian","sna":"Shona",
"iii":"Sichuan Yi, Nuosu","snd":"Sindhi",
"sin":"Sinhala, Sinhalese","slk":"Slovak",
"slv":"Slovenian","som":"Somali",
"nbl":"South Ndebele","sot":"Southern Sotho",
"spa":"Spanish, Castilian","sun":"Sundanese",
"swa":"Swahili","ssw":"Swati",
"swe":"Swedish","tgl":"Tagalog",
"tah":"Tahitian","tgk":"Tajik",
"tam":"Tamil","tat":"Tatar",
"tel":"Telugu","tha":"Thai",
"bod":"Tibetan","tir":"Tigrinya",
"ton":"Tonga (Tonga Islands)","tso":"Tsonga",
"tsn":"Tswana","tur":"Turkish",
"tuk":"Turkmen","twi":"Twi",
"uig":"Uighur, Uyghur","ukr":"Ukrainian",
"urd":"Urdu","uzb":"Uzbek",
"ven":"Venda","vie":"Vietnamese",
"vol":"Volapük","wln":"Walloon",
"cym":"Welsh","fry":"Western Frisian",
"wol":"Wolof","xho":"Xhosa",
"yid":"Yiddish","yor":"Yoruba",
"zha":"Zhuang, Chuang","zul":"Zulu",
  
"mul":"MULTILINGUAL"},
               
thm:{
"gnrl":"General",   
"Musics":"Musics","TV":"TV",
"Travel":"Travel","News":"News",
"Politics":"Politics","Religion":"Religion",
"Others":"Others",
           "bstlk":"BesTalk"}
          };//rooms x clase



//entrar language room, from datalist
function goiN(){
  
  for(var opt in dtlstroom.options){
    
  if(dtlstroom.options[opt].value== inlstroom.value){
    
    var roomf= dtlstroom.options[opt].id.slice(3,6);
    break;
  }//if
}//for

  entrar_a_room(roomf);
 
spanear_room(roomf,dvlngrmscon);
   inlstroom.value="";  
}//goiN room


function gothmrM(roomf){
 entrar_a_room(roomf);
 spanear_room(roomf,dvthmrmscon);
}//gothmrM



function spanear_room(roomf,dvametf){
 if(!document.getElementById("sprm_"+roomf) ){
 var sprm= document.createElement("span");
sprm.id="sprm_"+roomf;
sprm.setAttribute("class","spchtrm");
sprm.setAttribute("onclick","entrar_a_room(\'"+roomf+"\')");  


sprm.innerHTML= rooms[roomf]+' <span id="spchtcnt_'+roomf+
  '" class="spchtcnt"></span><svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M704 384q-153 0-286 52t-211.5 141-78.5 191q0 82 53 158t149 132l97 56-35 84q34-20 62-39l44-31 53 10q78 14 153 14 153 0 286-52t211.5-141 78.5-191-78.5-191-211.5-141-286-52zm0-128q191 0 353.5 68.5t256.5 186.5 94 257-94 257-256.5 186.5-353.5 68.5q-86 0-176-16-124 88-278 128-36 9-86 16h-3q-11 0-20.5-8t-11.5-21q-1-3-1-6.5t.5-6.5 2-6l2.5-5 3.5-5.5 4-5 4.5-5 4-4.5q5-6 23-25t26-29.5 22.5-29 25-38.5 20.5-44q-124-72-195-177t-71-224q0-139 94-257t256.5-186.5 353.5-68.5zm822 1169q10 24 20.5 44t25 38.5 22.5 29 26 29.5 23 25q1 1 4 4.5t4.5 5 4 5 3.5 5.5l2.5 5 2 6 .5 6.5-1 6.5q-3 14-13 22t-22 7q-50-7-86-16-154-40-278-128-90 16-176 16-271 0-472-132 58 4 88 4 161 0 309-45t264-129q125-92 192-212t67-254q0-77-23-152 129 71 204 178t75 230q0 120-71 224.5t-195 176.5z" fill="#fff"/>';//comments-o

dvametf.appendChild(sprm);
}//if no esta 

}//spanear_room span room



//entrar language room, click on name
function entrar_a_room(rmx){
  crear_room(rmx);
//juntarlo al room: gnrl !!!
sktclt.emit("open room",rmx);
   
}//entrar_a_room



sktclt.on("manda users al room",function(objroomf){
  //objroomf{usersroom,chtroom,sktid,room} 
  console.log("mandó users al room")
  console.log(objroomf)
  
  var usrsg="";
  
  for(var nombr in objroomf.usersroom){
    usrsg+=objroomf.usersroom[nombr]+"<br>";
  }//for
 
  var dvchtrm_usrnm_= document.getElementById("dvchtrm_usrnm_"+objroomf.room);
  
  
 dvchtrm_usrnm_.innerHTML="";
 dvchtrm_usrnm_.innerHTML=usrsg;
    
  if(objroomf.sktid==sktclt.id){
    
   var dvchtrm_con_= document.getElementById("dvchtrm_con_"+objroomf.room); 
    
  var licht=dvchtrm_con_.innerHTML;
//15 lines of chat
  for(var msgcht in objroomf.chtroom){
    licht+=objroomf.chtroom[msgcht]+"<br>";
  }//for
 dvchtrm_con_.innerHTML=licht;
    
 dvchtrm_con_.scrollTo(0, dvchtrm_con_.scrollHeight);
    
  }//if es el que llega
  
});//skcl manda users al room



sktclt.on("actualizar rooms",function(objroomf){
  //objroomf{usersroom,room}
  
  console.log("actualizó rooms");
  
  if(rooms[objroomf.room]){
    
 if(roomsxcls.lng[objroomf.room]){
 spanear_room(objroomf.room,dvlngrmscon);
}else if(roomsxcls.thm[objroomf.room]){
 spanear_room(objroomf.room,dvthmrmscon);
}//else if thm room
   
  //objroomf{usersroom,chtroom,sktid,room} 
  var cntusrs=Object.keys(objroomf.usersroom).length;
  var spchtcnt_= document.getElementById("spchtcnt_"+objroomf.room);
  spchtcnt_.innerHTML= cntusrs!=0? cntusrs: "";
  }//if no secret
    
});//skcl actualizar rooms




function minimizar_dvchat(rmx){//roomx
jQuery(function($){

var dvchtrm_titmin_= "#dvchtrm_titmin_"+rmx;
var dvchtrm_= "#dvchtrm_"+rmx;
var dvchtrm_conusr_= "#dvchtrm_conusr_"+rmx;
var dvchtrm_msg_= "#dvchtrm_msg_"+rmx;
  
    if($(dvchtrm_titmin_).html()=="-"){
      $(dvchtrm_).height(30);
      $(dvchtrm_titmin_).html("+");
      $(dvchtrm_conusr_).hide();
      $(dvchtrm_msg_).hide();
      $(dvchtrm_).resizable("disable");
      $(dvchtrm_).css('z-index', 9999);
      
    }//if -
    else{
      $(dvchtrm_).height(200);
      $(dvchtrm_titmin_).html("-");
      $(dvchtrm_conusr_).show();
      $(dvchtrm_msg_).show();
      $(dvchtrm_).resizable("enable");
    }//else +
    
});//jQuery
}//minimizar_dvchat



function restaurar_tamchat(rmx){//roomx
  var dvchtrm_= document.querySelector("#dvchtrm_"+rmx);
  
if(dvchtrm_.offsetWidth<dvconcht.offsetWidth){
  dvchtrm_.style.height= dvconcht.offsetHeight+"px";
  dvchtrm_.style.width= dvconcht.offsetWidth+"px";
  dvchtrm_.style.left=0;
  dvchtrm_.style.top=0;
}//if pequeño
  else{
    dvchtrm_.removeAttribute("style");
  }//else retorna
}//restaurar_tamchat



function cerrar_dvchat(rmx){//roomx
  var dvchtrm_= document.querySelector("#dvchtrm_"+rmx);
 dvconcht.removeChild(dvchtrm_);
 sktclt.emit("cerrar room",rmx);  
}//cerrar_dvchat



//botones chat, como zumbido, bell, volume-up

function es_botonvacio(){
  alert("Empty Button :)");
}//es_botonvacio



//........


function enviar_msg(ev,rmx){//event,roomx
  ev.preventDefault();
var inchtrm_msg_= document.querySelector("#inchtrm_msg_"+rmx);

var typerm;
if(rooms[rmx]){
  typerm="public";
}else{
  typerm="secret";
}//else


if(inchtrm_msg_.value!=""){
 sktclt.emit("send message room",
             {msg:inchtrm_msg_.value,
             room:rmx,
             typerm:typerm});
  //inchtrm_msg_.getAttribute("data-room")
}//if no vacio

inchtrm_msg_.value="";
}//enviar_msg



//recibe mensaje en chat
sktclt.on('new message room', function(objmsgf) {
//objmsgf{msg,nick,room}
  
  if(!document.hasFocus()){
    favicon.href="data:image/x-icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////////////////////////8AAAAAAAAAAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP///8AAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJMAAAAAAAAAAADbcJPbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAAAAAAAAAADbcJPbcJMAAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP/////bcJPbcJMAAADbcJPbcJMAAADbcJMAAP////8AAP8AAP8AAP8AAP////8AAP/////bcJPbcJMAAADbcJPbcJMAAADbcJMAAP////8AAP8AAP8AAP////////8AAP/////bcJMAAAAAAAAAAAAAAADbcJPbcJMAAP////8AAP8AAP////8AAP////8AAP/////bcJPbcJPbcJPbcJPbcJPbcJPbcJMAAP////8AAP////8AAP8AAP////8AAP/////bcJPbcJPbcJPbcJPbcJPbcJPbcJMAAP////////8AAP8AAP8AAP////8AAP8AAAD////bcJPbcJPbcJPbcJPbcJPbcJMAAP////8AAP8AAP8AAP8AAP////8AAP8AAAAAAAD///////////////////////8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP/AAwAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAADAAAAA";
  }//if not focus
  
  
 var dvchtrm_con_= "#dvchtrm_con_"+objmsgf.room;
  
jQuery(function($){
  
  $(dvchtrm_con_).append('<b>'+objmsgf.nick+":</b> "+
                       objmsgf.msg+"<br/>");
  $(dvchtrm_con_).stop().animate(
    {scrollTop: $(dvchtrm_con_)[0].scrollHeight}, 200);
});//jQuery
});//skcl new message room



//cambia icono de nuevo mensaje
window.onfocus= function(){
  if(favicon.href!="data:image/x-icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////////////////////////8AAAAAAAAAAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP///8AAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJMAAAAAAAAAAADbcJPbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAAAAAAAAAADbcJPbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJMAAAAAAAAAAAAAAADbcJPbcJMAAAAAAAAAAAAAAAAAAADbcJPbcJP////////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP///8AAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP///8AAAAAAAAAAAD///////////////////////////////////////////////8AAAAAAADAAwAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAADAAwAA")
  favicon.href="data:image/x-icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////////////////////////8AAAAAAAAAAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP///8AAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJMAAAAAAAAAAADbcJPbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAAAAAAAAAADbcJPbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJMAAAAAAAAAAAAAAADbcJPbcJMAAAAAAAAAAAAAAAAAAADbcJPbcJP////////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP///8AAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP///8AAAAAAAAAAAD///////////////////////////////////////////////8AAAAAAADAAwAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAADAAwAA";
}//tornar el favicon a la normalidad



//quien escribe, en evento attached
function esta_tipeando(inchtmsgf){
  sktclt.emit("typing",
             {room: inchtmsgf.getAttribute("data-room")});
  inchtmsgf.removeEventListener("keydown",esta_tipeando);
  setTimeout(function(){
    inchtmsgf.addEventListener("keydown",esta_tipeando);
  },1000);
  
}//esta_tipeando typing



sktclt.on("who type",function(objroomf){
  //objroomf{fistnm,room}
  //console.log(objroomf+" is typing");
  
  var nudiv= document.createElement("div");
  nudiv.id="dvtyp_"+objroomf.room;
  nudiv.setAttribute("class","dvtyp"); 
  
  nudiv.innerHTML="<b>"+objroomf.firstnm+"</b>"+"<span  class='sptyp'> is typing...</span>"+
    '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z"/></svg>';//pencil

  var dvchtrm_conusr_= document.getElementById("dvchtrm_conusr_"+objroomf.room);
  
dvchtrm_conusr_.appendChild(nudiv);

setTimeout(function(){
 dvchtrm_conusr_.removeChild(nudiv);
},1000);
  
});//skcl who type


//======secret rooms

//slide in secret room
function goscT(){

  var sctroom= insctrm.value.replace(/\s/g,"_");
  crear_room(sctroom);
  insctrm.value="";
  sktclt.emit("slide in sct", sctroom);
}//goscT



function crear_room(rmx){

 var dvchtrm_= document.getElementById("dvchtrm_"+rmx);
  
 if(!dvchtrm_){
 
 var dvs= document.querySelectorAll("#dvconcht>div");

for(var i=0;i<dvs.length;i++){
 dvs[i].classList.remove("alfrente");
}//for   
    
 var nudiv=document.createElement("DIV");
 nudiv.id="dvchtrm_"+rmx;
 nudiv.classList.add("dvchtrm","alfrente");
    
 nudiv.innerHTML='<div class="dvchtrm_tit">'+

    '<div class="dvchtrm_titnm gnrl_titnm">'+(rooms[rmx]||rmx)+'</div>'+

  '<div id="dvchtrm_titmin_'+rmx+
  '" class="dvchtrm_titmin"'+
  ' onclick="minimizar_dvchat(\''+rmx+'\')">-</div>'+

  '<div class="dvchtrm_titrsz"'+
  ' onclick="restaurar_tamchat(\''+rmx+'\')">L</div>'+

  '<div class="dvchtrm_titcrr gnrl_titcrr"'+
  ' onclick="cerrar_dvchat(\''+rmx+'\')">x</div>'+

  '</div>'+//dvchtrm_tit

  '<div id="dvchtrm_conusr_'+rmx+
  '" class="dvchtrm_conusr">'+

  '<div id="dvchtrm_con_'+rmx+'" class="dvchtrm_con gnrl_con"></div>'+
  
  '<div id="dvchtrm_usr_'+rmx+'" class="dvchtrm_usr gnrl_usr">'+

    '<div id="dvchtrm_usrnm_'+rmx+
  '" class="dvchtrm_usrnm"></div>'+

    '<div id="dvchtrm_usrbts_'+rmx+
  '" class="dvchtrm_usrbts">'+ 
    '<input type="button" value="_"'+
   ' onclick="es_botonvacio()"></div>'+

  '</div>'+//dvchtrm_usr
  '</div>'+ //dvchtrm_conusr

  '<div id="dvchtrm_msg_'+rmx+
  '" class="dvchtrm_msg">'+
  '<form class="fmchtrm_msg" onsubmit="enviar_msg(event,\''+rmx+'\')">'+

  '<input type="text" id="inchtrm_msg_'+rmx+'" class="inchtrm_msg" autocorrect="off" autocomplete="off"'+
  ' data-room="'+rmx+'" placeholder="write your message">'+

  '<button id="btchtrm_msg_'+rmx+'" class="btchtrm_msg" type="submit" >'+
  '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z"/></svg>'+//paper-plane
  '</button>'+
'</form>'+ 
  '<button class="btchtrm_emj" onclick="seleccionar_emoji(\''+rmx+'\')">'+
  '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1262 1075q-37 121-138 195t-228 74-228-74-138-195q-8-25 4-48.5t38-31.5q25-8 48.5 4t31.5 38q25 80 92.5 129.5t151.5 49.5 151.5-49.5 92.5-129.5q8-26 32-38t49-4 37 31.5 4 48.5zm-494-435q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm512 0q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm256 256q0-130-51-248.5t-136.5-204-204-136.5-248.5-51-248.5 51-204 136.5-136.5 204-51 248.5 51 248.5 136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5zm128 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/></svg>'+//smile-o
    '</button>'+
   
  '</div>';

dvconcht.appendChild(nudiv);

nudiv.addEventListener("click",function(){

var clsact= nudiv.getAttribute("class");
var re= new RegExp("alfrente","i");

if(!re.test(clsact)){
var dvs= document.querySelectorAll("#dvconcht>div");

for(var i=0;i<dvs.length;i++){
 dvs[i].classList.remove("alfrente");
}//for

this.classList.add("alfrente");
//console.log("al frente");
}//if no la tiene

});//click, poner al frente    
    
    jQuery(function($){

var draggableDiv = 

$('#dvchtrm_'+rmx).draggable();
  
$('#dvchtrm_con_'+rmx, draggableDiv)
  .mousedown(function(ev){
  draggableDiv.draggable('disable');
})//mousedown
  .mouseup(function(ev){
  draggableDiv.draggable('enable');
});//mouseup
  
    
$('#dvchtrm_'+rmx).resizable();
  
  var inchtrm_msg_= document.getElementById("inchtrm_msg_"+rmx);
  
  inchtrm_msg_.addEventListener("keydown",
                        function(){
        esta_tipeando(inchtrm_msg_);
  });//addeventlistener keydown tyP

});//jQuery
    
  }//if no dvchtrm
      
}//crear_room


function seleccionar_emoji(rmf){
//hay div, no, crea div
var dvchtrm_usr_= document.getElementById("dvchtrm_usr_"+rmf);
var dvemj_= document.getElementById("dvemj_"+rmf);

if(!dvemj_){
var nudiv= document.createElement("div");
nudiv.id= "dvemj_"+rmf;
nudiv.setAttribute("class","dvemj");

nudiv.innerHTML= '<input type="button" value="😄" onclick="meter_emoji(\''+rmf+'\',\'smile\')">'+
'<input type="button" value="😠" onclick="meter_emoji(\''+rmf+'\',\'angry\')">'+
'<input type="button" value="😆" onclick="meter_emoji(\''+rmf+'\',\'laughing\')">'+
'<input type="button" value="👍" onclick="meter_emoji(\''+rmf+'\',\'thumbsup\')">';
  

dvchtrm_usr_.appendChild(nudiv);

}//if no dvemj_
else{
	dvchtrm_usr_.removeChild(dvemj_);
}//else quitarlo

}//seleccionar_emoji


function meter_emoji(rmf,palemj){
  var inchtrm_msg_= document.getElementById("inchtrm_msg_"+rmf);
  
  inchtrm_msg_.value+=":"+palemj+":";

  var dvemj_= document.getElementById("dvemj_"+rmf);
  var dvchtrm_usr_= document.getElementById("dvchtrm_usr_"+rmf);

  dvchtrm_usr_.removeChild(dvemj_);

}//meter_emoji




sktclt.on("manda users a sctroom",function(objroomsctf){
 //objroomsctf{usersroom,sktid,room}

var usrsg="";
  
  for(var nombr in objroomsctf.usersroom){
    usrsg+=objroomsctf.usersroom[nombr]+"<br>";
  }//for
 
  var dvchtrm_usrnm_= document.getElementById("dvchtrm_usrnm_"+objroomsctf.room);
  
 dvchtrm_usrnm_.innerHTML="";
 dvchtrm_usrnm_.innerHTML=usrsg;

 var dvchtrm_usrbts_= document.getElementById("dvchtrm_usrbts_"+objroomsctf.room);

dvchtrm_usrbts_.innerHTML= '<button id="btcllsct_'+objroomsctf.room+
//  '" data-room="'+objroomsctf.room+
'" onclick="juntarse_llamadasct(this,\''+objroomsctf.room+'\')">'+
'<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-53-3.5t-57.5-12.5-47-14.5-55.5-20.5-49-18q-98-35-175-83-127-79-264-216t-216-264q-48-77-83-175-3-9-18-49t-20.5-55.5-14.5-47-12.5-57.5-3.5-53q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"/></svg>'+//phone
'</button>'+

'<button id="btmtecllsct_'+objroomsctf.room+'" class="btmtecll">'+
'<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M463 945l-101 101q-42-103-42-214v-128q0-26 19-45t45-19 45 19 19 45v128q0 53 15 113zm1114-602l-361 361v128q0 132-94 226t-226 94q-55 0-109-19l-96 96q97 51 205 51 185 0 316.5-131.5t131.5-316.5v-128q0-26 19-45t45-19 45 19 19 45v128q0 221-147.5 384.5t-364.5 187.5v132h256q26 0 45 19t19 45-19 45-45 19h-640q-26 0-45-19t-19-45 19-45 45-19h256v-132q-125-13-235-81l-254 254q-10 10-23 10t-23-10l-82-82q-10-10-10-23t10-23l1234-1234q10-10 23-10t23 10l82 82q10 10 10 23t-10 23zm-380-132l-621 621v-512q0-132 94-226t226-94q102 0 184.5 59t116.5 152z"/></svg>'+//microphhone-slash
'</button>'+
  '<audio id="lclaud" style="display:none" oncontextmenu="return false;" disabled></audio>'+
''; 
  
});//skcl manda users a sctroom
          



//====inf usr

function nooP(){}//no operations, for swap functions

//cuadro, profile, chat request, al clicar user
function mostrar_usrprfchtr(ele,ev){
 
  if(ele.id!=sktclt.id)//if no es el mismo 
 if(typeof(dvinfusr)=="undefined"){
   
var nuedvinfusr=document.createElement("DIV");
nuedvinfusr.id="dvinfusr";
nuedvinfusr.style="position:fixed;"+
"left:"+ev.clientX+"px;"+
"top:"+ev.clientY+"px";
   
nuedvinfusr.innerHTML='<div id="dvinfprfcht">'+
    '<li id="liprf'+ele.id+
	'" data-usrid="'+
	ele.getAttribute("data-usrid")+
  '" onclick="informar_profile(this)">Profile</li>'+
  
    '<li id="lichtrqs'+ele.id+
  '" onclick="mandar_chatrqst(this)" data-usrid="'+
    ele.getAttribute("data-usrid")+
    '">Chat Request</li>'+
    '</div>'+
    '<div id="dvcrrprfcht" onclick="cerrar_infusr()">x</div>';
  
 dvconcht.appendChild(nuedvinfusr);
 }//if no existe: crea
}//mostrar_usrprfchtr


/*
function informar_profile(ele){
  
  //make request of user id in skcl.emit
  alert("in construction, "+ele.id);
  
}//info profile*/

function informar_profile(ele){
  
  if(ele.id!=sktclt.id){//if no es el mismo 
 var usridrcv= ele.getAttribute("data-usrid");
 var sktidrcv= ele.id;
  
 sktclt.emit("ver su prf",
            {usridrcv:usridrcv,
             sktidrcv:sktidrcv,
             sktidmnd:sktclt.id});
  }//if no el mismo
}//informar_profile


sktclt.on("perfil a ver",function(objuserf){
 //objuserf{user,usridrcv,sktidrcv}
console.log("perfil a ver");
console.log(objuserf.user);
 
  if(typeof(dvprfusr)=="undefined"){
var nudiv= document.createElement("div");
nudiv.id="dvprfusr";
nudiv.classList.add("alfrente");    

nudiv.innerHTML= '<div id="dvprfusr_tit">'+
'<div id="dvprfusr_titnme">'+
objuserf.user.firstnm+" "+objuserf.user.lastnm+
'</div><div id="dvprfusr_titcrr" onclick="cerrar_prfusr()">X</div>'+
'</div>'+

'<div id="dvprfusr_con">'+
'<img id="imgprfusr" src="'+
objuserf.user.avatar+
'" alt="imgprf"><p>'+
objuserf.user.age+", "+objuserf.user.gender+
'</p><p>'+objuserf.user.country+
'</p><p>'+objuserf.user.speaks+
'</p><p>'+objuserf.user.learning+
'</p><p>'+objuserf.user.aboutme+
'</div>'+
'<div id="dvprfusr_chtrqs">'+
'<input type="button" value="Chat Request" '+
 ' data-usridrcv="'+objuserf.usridrcv+
'" data-sktidrcv="'+objuserf.sktidrcv+ 
'" onclick="mandar_chatrqSprf(this)">'+
'</div>';  

dvconcht.appendChild(nudiv); 
  
jQuery(function($){

var draggableDiv= $("#dvprfusr").draggable();
$("#dvprfusr_con", draggableDiv)
  .mousedown(function(ev){
  draggableDiv.draggable('disable');
}).mouseup(function(ev){
  draggableDiv.draggable('enable');
});
  
$("#dvprfusr").resizable();
  
});//jQuery  
  }//if no dvprfusr
});//skcl perfil a ver


function mandar_chatrqsT(ele){
  console.log("1mando chtrqs");
  var prtid=ele.id.substr(8,ele.id.length);
  
  var usridrcv= ele.getAttribute("data-usrid");
  
  sktclt.emit("manda chatrqs",
              {sktidrcv:prtid,
               usridrcv: usridrcv,
              sktidmnd:sktclt.id});
  
 
  cerrar_infusr();
}//mandar_chatrqsT

function mandar_chatrqsprf(ele){
 console.log("manda chat request");

var sktidrcv=ele.getAttribute("data-sktidrcv");
var usridrcv=ele.getAttribute("data-usridrcv");  
  
  sktclt.emit("manda chatrqs",
              {sktidrcv:sktidrcv,
               usridrcv: usridrcv,
              sktidmnd:sktclt.id});
  cerrar_prfusr();
}//mandar_chatrqsprf


function cerrar_prfusr(){
 dvconcht.removeChild(dvprfusr);
}//cerrar_prfusr


function cerrar_infusr(){
  dvconcht.removeChild(dvinfusr);
}//cerrar inf prf y cht rqst



sktclt.on("recibe chatrqs",function(objroomf){
  //objroomf{nmemnd,idrcv,sktidmnd,sktidrcv,roombth}
  console.log("3me dieron chtrqs");
  console.log(objroomf);
  
var nudiv=document.createElement("div");
nudiv.id="dvchtrqsof_"+objroomf.roombth;
nudiv.classList.add("dvchtrqsof");  

nudiv.innerHTML='<div id="dvchtrqsof_t">Chat request from '+
  objroomf.nmemnd+'</div>'+
    '<div id="dvchtrqsof_m" onclick="abrir_chatrqs(\''+
  objroomf.roombth+'\',\''+
  objroomf.sktidmnd+'\')">+</div>'+
    '<div id="dvchtrqsof_x">X</div>';

dvconcht.appendChild(nudiv);
  
});//skclon recibe chatrqs



sktclt.on("espera chatrqs",function(objroomf){
  //objroomf{idmnd,idrcv,sktidmnd,sktidrcv,nmercv,roombth}
  
  //if(objroomf.sktidmnd==sktclt.id){
    
  console.log("3espera chatrqs");
  console.log(objroomf);
  
  var dvwti_= document.getElementById("dvwti_"+objroomf.roombth);
  
  if(!dvwti_){ 
    
var nudiv=document.createElement("div");
nudiv.id="dvwti_"+objroomf.roombth;
nudiv.classList.add("dvwti");

nudiv.innerHTML='<div id="dvwti_t">Waiting for '+objroomf.nmercv+'...</div>'+
 '<div id="dvwti_x" onclick=\'cerrar_waiting("'+
     objroomf.sktidrcv+'","'+
     objroomf.roombth+
               '")\'>X</div>';

dvconcht.appendChild(nudiv);
  }//if dvwti no creado
  //}//if es el que espera
});//skcl espera chatrqs



function cerrar_waiting(sktidrcvf,roombthf){

  var dvwti= document.getElementById("dvwti_"+roombthf);

  dvconcht.removeChild(dvwti);

  sktclt.emit("cancel chatrqs",
              {sktidrcv:sktidrcvf,
               roombth:roombthf});
}//cerrar_waiting



sktclt.on("eliminar chatrqs",function(objroomf){
 //objroomf{roombth}

 var dvchtrqsof= document.getElementById("dvchtrqsof_"+objroomf.roombth);

dvconcht.removeChild(dvchtrqsof);
});//skcl eliminar chat request



function abrir_chatrqs(roombthx,sktidmndx){
  
 var dvchtrm_= document.getElementById("dvchtrm_"+roombthx); 
  
  if(!dvchtrm_){
    
var dvs= document.querySelectorAll("#dvconcht>div");

for(var i=0;i<dvs.length;i++){
 dvs[i].classList.remove("alfrente");
}//for    
    
var nudiv=document.createElement("DIV");
nudiv.id="dvchtrm_"+roombthx;
nudiv.classList.add("dvchtrm");    

nudiv.innerHTML='<div class="dvchtrm_tit">'+

    '<div class="dvchtrm_titnm prv_titnm">Chat with</div>'+

  '<div id="dvchtrm_titmin_'+roombthx+
  '" class="dvchtrm_titmin"'+
  ' onclick="minimizar_dvchat(\''+roombthx+'\')">-</div>'+

  '<div class="dvchtrm_titrsz"'+
  ' onclick="restaurar_tamchat(\''+roombthx+'\')">L</div>'+

  '<div class="dvchtrm_titcrr prv_titcrr"'+
  ' onclick="cerrar_dvchat(\''+roombthx+'\')">x</div>'+

  '</div>'+//dvchtrm_tit


  '<div id="dvchtrm_conusr_'+roombthx+
  '" class="dvchtrm_conusr">'+
  
  '<div id="dvchtrm_con_'+roombthx+'" class="dvchtrm_con prv_con"></div>'+

'<div id="dvchtrm_usr_'+roombthx+'" class="dvchtrm_usr prv_usr">'+

'<div id="dvchtrm_usrnm_'+roombthx+'" class="dvchtrm_usrnm"></div>'+

    '<div class="dvchtrm_usrbts">'+  

  '<button id="btcll_'+roombthx+
  '" onclick="solicitar_llamada(this,\''+roombthx+'\')">'+

'<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-53-3.5t-57.5-12.5-47-14.5-55.5-20.5-49-18q-98-35-175-83-127-79-264-216t-216-264q-48-77-83-175-3-9-18-49t-20.5-55.5-14.5-47-12.5-57.5-3.5-53q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"/></svg>'+//phone
'</button>'+

  '<button id="btmtecll_'+roombthx+'" class="btmtecll">'+
'<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M463 945l-101 101q-42-103-42-214v-128q0-26 19-45t45-19 45 19 19 45v128q0 53 15 113zm1114-602l-361 361v128q0 132-94 226t-226 94q-55 0-109-19l-96 96q97 51 205 51 185 0 316.5-131.5t131.5-316.5v-128q0-26 19-45t45-19 45 19 19 45v128q0 221-147.5 384.5t-364.5 187.5v132h256q26 0 45 19t19 45-19 45-45 19h-640q-26 0-45-19t-19-45 19-45 45-19h256v-132q-125-13-235-81l-254 254q-10 10-23 10t-23-10l-82-82q-10-10-10-23t10-23l1234-1234q10-10 23-10t23 10l82 82q10 10 10 23t-10 23zm-380-132l-621 621v-512q0-132 94-226t226-94q102 0 184.5 59t116.5 152z"/></svg>'+//microphhone-slash
'</button>'+
  '<audio id="lclaud" style="display:none" oncontextmenu="return false;" disabled></audio>'+  
  '</div>'+//_usrbts
  '</div>'+//_usr
  '</div>'+//_conusr
  
  '<div id="dvchtrm_msg_'+roombthx+'" class="dvchtrm_msg">'+
  '<form class="fmchtrm_msg" onsubmit="enviar_msgprv(event,\''+roombthx+'\')">'+

  '<input type="text" id="inchtrm_msg_'+roombthx+'" class="inchtrm_msg" autocorrect="off" autocomplete="off"'+
  ' data-room="'+roombthx+
  '" placeholder="write your message...">'+

  '<button id="btnchtrm_msg_'+roombthx+'" class="btnchtmsg" type="submit" >'+
  '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z"/></svg>'+//paper-plane
  '</button>'+
'</form>'+
  '<button class="btnchtrm_emj"  onclick="seleccionar_emoji(\''+roombthx+'\')">'+
  '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1262 1075q-37 121-138 195t-228 74-228-74-138-195q-8-25 4-48.5t38-31.5q25-8 48.5 4t31.5 38q25 80 92.5 129.5t151.5 49.5 151.5-49.5 92.5-129.5q8-26 32-38t49-4 37 31.5 4 48.5zm-494-435q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm512 0q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm256 256q0-130-51-248.5t-136.5-204-204-136.5-248.5-51-248.5 51-204 136.5-136.5 204-51 248.5 51 248.5 136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5zm128 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/></svg>'+//smile-o
    '</button>'+
  '</div>';    
    
dvconcht.appendChild(nudiv);

    
nudiv.addEventListener("click",function(){

var clsact= nudiv.getAttribute("class");
var re= new RegExp("alfrente","i");

if(!re.test(clsact)){
var dvs= document.querySelectorAll("#dvconcht>div");

for(var i=0;i<dvs.length;i++){
 dvs[i].classList.remove("alfrente");
}//for

this.classList.add("alfrente");
//console.log("al frente");
}//if no la tiene

});//click, poner al frente     
    
    
jQuery(function($){

var dvchtrm_= "#dvchtrm_"+roombthx;
var dvchtrm_con_= "#dvchtrm_con_"+roombthx;  
  
var draggableDiv= $(dvchtrm_).draggable();
$(dvchtrm_con_, draggableDiv)
  .mousedown(function(ev){
  draggableDiv.draggable('disable');
}).mouseup(function(ev){
  draggableDiv.draggable('enable');
});
  
$(dvchtrm_).resizable();

var inchtrm_msg_= document.getElementById("inchtrm_msg_"+roombthx);
  
  inchtrm_msg_.addEventListener("keydown",
                        function(){
        esta_tipeando(inchtrm_msg_);
  });//addeventlistener keydown tyP  
  
});//jQuery

  if(sktidmndx){
    
  var dvchtrqsof= document.getElementById("dvchtrqsof_"+roombthx);

  dvconcht.removeChild(dvchtrqsof);
    
    sktclt.emit("abrir chatrqs",
                {roombth:roombthx,
                 sktidmnd:sktidmndx});
  }//if objeto sktidmndx existe
  console.log("abrio chat request");
  }//if dvchtrqswth no creado
  
}//abrir_chatrqs



sktclt.on("acepta chatrqs",function(objroomf){
  //objroomf{nmemnd,nmercv,sktidrcv,sktidmnd,roombth}
  console.log("5aceptada chtrqs");
  console.log(objroomf);
  
  var dvwti= document.getElementById("dvwti_"+objroomf.roombth);

  dvconcht.removeChild(dvwti);
  
  abrir_chatrqs(objroomf.roombth);
  sktclt.emit("users al chatrqs",objroomf);  
});//skcon acepta chat reqquest



sktclt.on("mete users en chatrqs",function(objroomf){
  //objroomf{nmemnd,nmercv,sktidrcv,sktidmnd,roombth,chtprv}
  
    console.log("7mete usrs");
  //console.log(objroomf);
  
  var dvchtrm_usrnm_= document.getElementById("dvchtrm_usrnm_"+objroomf.roombth);
  
    dvchtrm_usrnm_.innerHTML= objroomf.nmercv+"<br id='brrcv' data-sktid='"+
     objroomf.sktidrcv+"'/>"+
     objroomf.nmemnd+"<br id='brmnd' data-sktid='"+objroomf.sktidmnd+"'/>";
  
  var licht="";

for(var msgcht in objroomf.chtprv){
 licht+=objroomf.chtprv[msgcht]+"<br>";
}//for

var dvchtrm_con_= document.getElementById("dvchtrm_con_"+objroomf.roombth);

dvchtrm_con_.innerHTML=licht;
  
  
});//skcl meter usrs chtrqs



function enviar_msgprv(ev,roombthx){
  ev.preventDefault();
  
  var inchtrm_msg_= document.querySelector("#inchtrm_msg_"+roombthx);
  
  if(inchtrm_msg_.value!=""){
 sktclt.emit("send messagecht_r",
             {msg:inchtrm_msg_.value,
      roombth:roombthx});
//inr_msg.getAttribute("data-room")  
}//if no vacio

inchtrm_msg_.value="";
  
}//enviar_msgprv cht prv



sktclt.on("new msgchtrqs",function(objmsgf){
  //objmsgf{msg,nick,room}

jQuery(function($){

  var dvchtrm_con_= "#dvchtrm_con_"+objmsgf.room;
  
  $(dvchtrm_con_).append('<b>'+objmsgf.nick+":</b> "+objmsgf.msg+"<br/>");
  $(dvchtrm_con_).stop().animate(
    {scrollTop:$(dvchtrm_con_)[0].scrollHeight}, 200);
});//jQuery
});//skcl new msgchtrqs msg privado



/*
sktclt.on("dejar prv",function(dt){
  cerrar_dvchat(dt);
});//deja el privado
*/


sktclt.on("se desconecto",function(objmsgf){
 //objmsgf{msg}
  console.log("se desconecto +"+ objmsgf);
 alert("lost connection, for appear on the user table again, click on the chat tab"); 
});//skcl se desconecto o cerro



//=====juego


//opciones de juego para crear etw
function mostrar_etwgmeopt(){
 console.log("1opciones de juego");
  if(typeof(dvcrtgme)=="undefined"){
  
var nudiv=document.createElement("DIV");
 nudiv.id="dvcrtgme";

nudiv.innerHTML='<div id="dvtitoptgme">'+
 '<div id="dvtitoptgmenme">Game Options</div>'+
 '<div id="dvtitoptgme_x" onclick="cerrar_gmeopt()">X</div></div>'+

 '<div style="display:inline-block">'+
 '<span>Select word list:</span><br>'+
 '<select id="sllst">'+
 '<option id="nros">20 numbers</option>'+
  '<option id="essentials">essentials</option>'+
  '<option id="business">business</option>'+
  '<option id="sharedlingo">sharedlingo\'s words</option>'+
'<option id="proposed">proposed words</option>'+
 '<option id="optld">load list, in future</option>'+
 '</select></div>'+

 '<div style="display:inline-block;text-align:center">'+
 '<span>Nro of players:</span><br>'+
 '<select id="slnroply">'+
 '<option id="opt2">2</option>'+
 '<option id="opt3">3</option>'+
 '<option id="opt4">4</option>'+
 '<option id="opt5">5</option>'+
 '<option id="opt6">6</option>'+
 '<option id="opt8">8</option>'+
 '</select></div><br>'+
'<label><input type="checkbox" id="inchvce">By Voice</label><br>'+
 '<div id="dvrdygme">'+
 '<input type="button" id="btrdygme" value="Create" onclick="solicitar_juego()">'+
 '</div></div>';

dvcongme.appendChild(nudiv);
  }//if dvcrtgme no existe
    
}//mostrar_etwgmeopt



function cerrar_gmeopt(){
 dvcongme.removeChild(dvcrtgme);
}//cerrar_gmeopt



//solicitar juego explain the word
function solicitar_juego(){
 //var typegme= sltypgme.options[sltypgme.selectedIndex].value;
 var typegme= inchvce.checked? "Explain The Word (By Voice)": "Explain The Word"; 
 var listwrd= sllst.options[sllst.selectedIndex].id;
 var nroply= slnroply.options[slnroply.selectedIndex].value;
 
 dvcongme.removeChild(dvcrtgme);  
  
 sktclt.emit("solicitar game",
         {typegme: typegme,
          listwrd: listwrd,
          nroply: nroply});
}//solicitar_juego



sktclt.on("crear juego",function(objgmef){
//objgmef{nrogme,typegme,listwrd,nroply}

 console.log("2crear juego");
 console.log(objgmef);
  
 crear_juego(objgmef.nrogme,objgmef.typegme,
       objgmef.listwrd,objgmef.nroply); 
});//skcl crear juego



sktclt.on("los demas barjue",function(objbarjuef){
 //objbarjuef{nrogme,typegme,listwrdnm,nroply}

  console.log("los demas barjue");
  console.log(objbarjuef);
 dar_barjue(objbarjuef.nrogme,objbarjuef.typegme,
        objbarjuef.listwrdnm,objbarjuef.nroply);
});//skcl los demas barjue



function dar_barjue(rmjf,nmejuef,
                lisjuef,nroplyf){

console.log("crear barra de juego");
var dvgmebar_= document.getElementById("dvgmebar_"+rmjf);

if(!dvgmebar_){
var nudiv=document.createElement("DIV");
nudiv.id="dvgmebar_"+rmjf;
  
nudiv.setAttribute("class","dvgmebar");
nudiv.setAttribute("onclick","juntarse_a_juego(\'"+rmjf+"\',\'"+
                   nmejuef+"\',\'"+
                   lisjuef+"\',\'"+
                   nroplyf+"\')");

nudiv.setAttribute("data-idgm",rmjf);

nudiv.innerHTML= '<div id="dvbarjuenm">'+
 nmejuef+'</div>'+
 '<div id="dvbarjuelis">'+lisjuef+
 '</div>'+
 '<div id="dvbarjuenroply>1/'+ //nrojug/totjug
'<span id="spnroply">'+ nroplyf+
  '</span>'+'</div>';

dvcongme.appendChild(nudiv);
}//if no esta la barra
}//dar_barjue



//mostrar cuadro, join, spectate
function juntarse_a_juego(rmj,nmejuef,lisjuef,nroplyf){
  
  console.log("juntarse juego");
  crear_juego(rmj,nmejuef,lisjuef,nroplyf);
}//juntarse o spectate



//crear ventana juego
function crear_juego(rmjf,nmejuef,lisjuef,nroplyf){
  console.log("2creando vent juego");
  
   if(typeof(dvjue)=="undefined"){
     
var nudivj=document.createElement("DIV");
nudivj.id="dvjue";

nudivj.innerHTML='<div id="dvjue_cab">'+
'<div id="dvjue_tit" class="dvchtrm_tit">'+
  '<div id="dvjue_titnm">'+nmejuef+'</div>'+
  '<div id="dvjue_titrsz" onclick="restaurar_tamjue()">L</div>'+
  '<div id="dvjue_titcrr" class="prv_titcrr" onclick="cerrar_juego(\''+rmjf+'\')">X</div>'+
  '</div>'+
  
'<div id="dvjue_exp">Explains: <span id="spwrdtogss">wordX</span'+
'><span id="sptmr">00</span></div>'+
'</div>'+//dvjue_cab
  
'<div id="dvjue_conusr" class="">'+
'<div id="dvjue_con" class=""></div>'+
'<div id="dvjue_usr" class="">'+

  '<div id="dvjue_usrnm_'+rmjf+'" class="dvchtrm_usrnm"></div>'+
  
    '<div id="dvjue_usrbts_'+rmjf+'" class="dvchtrm_usrbts">'+          
    '<input type="button" value="_"'+
   ' onclick="es_botonvacio()"></div>'+
  '</div>'+
'</div>'+//_conusr
  
  '<div id="dvjue_msg">'+
  
'<form id="fmjue_msg" class="fmchtrm_msg" onsubmit="enviar_msgjue(event)">'+
'<input type="text" id="injue_msg" class="inchtrm_msg" placeholder="write your text..." data-room="'+rmjf+'">'+

'<button id="btnjue_sndmsg" class="btchtrm_msg" type="submit" >'+
  '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z"/></svg>'+//paper-plane
  '</button>'+  
'<button class="btchtrm_emj"  onclick="seleccionar_emojijue()">'+
  '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1262 1075q-37 121-138 195t-228 74-228-74-138-195q-8-25 4-48.5t38-31.5q25-8 48.5 4t31.5 38q25 80 92.5 129.5t151.5 49.5 151.5-49.5 92.5-129.5q8-26 32-38t49-4 37 31.5 4 48.5zm-494-435q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm512 0q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm256 256q0-130-51-248.5t-136.5-204-204-136.5-248.5-51-248.5 51-204 136.5-136.5 204-51 248.5 51 248.5 136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5zm128 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/></svg>'+//smile-o
    '</button>'+  
'</form></div>';

  dvcongme.appendChild(nudivj);
    
  sktclt.emit("entrar roomj",
              {nrogme:rmjf, //idjue
               typegme:nmejuef,
               listwrd:lisjuef,
               nroply:nroplyf});
 
  jQuery(function($){

var draggableDiv = $('#dvjue').draggable();
$('#dvjue_con', draggableDiv)
  .mousedown(function(ev) {
  draggableDiv.draggable('disable');
}).mouseup(function(ev) {
  draggableDiv.draggable('enable');
});
  
 var draggableDiv = $('#dvjue').draggable(); 
  $('#dvjue_exp', draggableDiv)
  .mousedown(function(ev) {
  draggableDiv.draggable('disable');
}).mouseup(function(ev) {
  draggableDiv.draggable('enable');
});  

 
$("#dvjue").resizable();

});//jQuery

}//if no esta, crea
};//crear_juego



sktclt.on("manda user al juego",function(objgmef){
  /*objgmef{usersjue{usrid[fn,sktid]}},
  nrogme,typegme,listwrd,nroply}*/
  
  console.log("4recibe user pal juego");
  console.log(objgmef);
  
 var usrj="";

for(var nom in objgmef.usersjue){
 usrj+= '<div id="dvjuepnt_'+nom+'" class="dvjuepnt">0</div>'+ 
          objgmef.usersjue[nom][0]+"<br>";
}//for

var dvjue_usrnm_= document.getElementById("dvjue_usrnm_"+objgmef.nrogme);
  
dvjue_usrnm_.innerHTML="";
dvjue_usrnm_.innerHTML=usrj;

if(objgmef.typegme!="Explain The Word"){
  
  var dvjue_usrbts_= document.getElementById("dvjue_usrbts_"+objgmef.nrogme);

dvjue_usrbts_.innerHTML= '<button id="btcllsct_'+objgmef.nrogme+
//  '" data-room="'+objgmef.room+
'" onclick="juntarse_llamadasct(this,\''+objgmef.nrogme+'\')">'+
'<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-53-3.5t-57.5-12.5-47-14.5-55.5-20.5-49-18q-98-35-175-83-127-79-264-216t-216-264q-48-77-83-175-3-9-18-49t-20.5-55.5-14.5-47-12.5-57.5-3.5-53q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"/></svg>'+//phone
'</button>'+

'<button id="btmtecllsct_'+objgmef.nrogme+'" class="btmtecll">'+
'<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M463 945l-101 101q-42-103-42-214v-128q0-26 19-45t45-19 45 19 19 45v128q0 53 15 113zm1114-602l-361 361v128q0 132-94 226t-226 94q-55 0-109-19l-96 96q97 51 205 51 185 0 316.5-131.5t131.5-316.5v-128q0-26 19-45t45-19 45 19 19 45v128q0 221-147.5 384.5t-364.5 187.5v132h256q26 0 45 19t19 45-19 45-45 19h-640q-26 0-45-19t-19-45 19-45 45-19h256v-132q-125-13-235-81l-254 254q-10 10-23 10t-23-10l-82-82q-10-10-10-23t10-23l1234-1234q10-10 23-10t23 10l82 82q10 10 10 23t-10 23zm-380-132l-621 621v-512q0-132 94-226t226-94q102 0 184.5 59t116.5 152z"/></svg>'+//microphhone-slash
'</button>'+
  '<audio id="lclaud" style="display:none" oncontextmenu="return false;" disabled></audio>'+
''; 
}//if es voice  
});//manda user al juego



sktclt.on("ya comenzo jue",function(objmsgf){
//objmsgf{msg} 

alert(objmsgf.msg);
});//skcl ya comenzo juego, esta completo
     
          

sktclt.on("el del turno",function(objwrdf){
  //objwrdf{wrd}
  console.log("te toca explicar");
  spwrdtogss.innerHTML=objwrdf.wrd;
});//skcl el del turno



sktclt.on("corre reloj",function(objtmpf){
  //objtmpf{tiempo}
  
  sptmr.innerHTML=objtmpf.tiempo;
  
});//skcl empieza a correr el reloj



sktclt.on("los que adivinan",function(objusrexplf){
  //objusrexplf{usrexpl}
  console.log("a adivinar!");
  spwrdtogss.innerHTML=objusrexplf.usrexpl;
  dvjue_con.innerHTML="";
});//skcl los que adivinan



sktclt.on("no se adivino",function(objwrdtogssf){
//objwrdtogssf{wrdtogss}
  console.log("no se adivino");
 dvjue_con.innerHTML+="The word was <b>"+
         objwrdtogssf.wrdtogss+"</b><br>";
  
  jQuery(function($){
  $("#dvjue_con").stop().animate(
    {scrollTop:$("#dvjue_con")[0].scrollHeight}, 100);
});//jquery
});//skcl si no se adivina



sktclt.on("actualiza puntaje",function(objpntf){
 //objpntf{usrid,pntply}

var dvjuepnt= document.getElementById("dvjuepnt_"+objpntf.usrid);

dvjuepnt.innerHTML=objpntf.pntply;
});//skcl actualiza puntaje



sktclt.on("quien gano",function(objwnrf){
//objwnrf{wnrnme}

dvjue_con.innerHTML="The winner is: <b>"+
              objwnrf.wnrnme+"</b>!<br>";

});//skcl quien gano




function restaurar_tamjue(){
  
  if(dvjue.offsetWidth<dvcongme.offsetWidth){
    
  dvjue.style.height=dvcongme.offsetHeight+"px";
  dvjue.style.width=dvcongme.offsetWidth+"px";
  dvjue.style.left=0;
  dvjue.style.top=0;
  }//if pequeño
  else{
    dvjue.removeAttribute("style");
  }//else retorna
}//restaurar tamaño del juego


function cerrar_juego(rmj){
  dvcongme.removeChild(dvjue);
  sktclt.emit("salir del juego",{room:rmj});
}//cerrar juego



sktclt.on("eliminar gmebar",function(objrmgmef){
 //objrmgmef{rmgme}
var dvgmebar= document.getElementById("dvgmebar_"+objrmgmef.rmgme);

dvcongme.removeChild(dvgmebar);

});//skcl eliminar gmebar



function enviar_msgjue(ev){
  ev.preventDefault();

if(injue_msg.value!=""){

 var msg= injue_msg.value;	
 
 var pal= spwrdtogss.innerHTML;
 var palval= pal[0]!=pal[0].toUpperCase();

 if(palval){
 var re= new RegExp("\\b"+pal+"\\b","i");
 if(re.test(msg)){
 alert("can't say the word, explain it!");
}//if esta, alerta
else{
 sktclt.emit("send messagejue",
             {msg:injue_msg.value,
        nrogme:injue_msg.getAttribute("data-room")});
}//else
 }//if pal val true p dif P
else{
	sktclt.emit("send messagejue",
             {msg:injue_msg.value,
        nrogme:injue_msg.getAttribute("data-room")});
}//else enviar normal
		
}//if no vacio

injue_msg.value="";
}//on send msg jue, del form enviar_msgjue(event)



sktclt.on('new messagejue', function(objmsggmef){
  //objmsggmef{msg,nrogme,nick,guess}
  
   if(objmsggmef.guess){
     
     dvjue_con.innerHTML+="<b>"+objmsggmef.nick+":</b> "+
       objmsggmef.msg+"<br/>"+
       "BINGO, you guessed the word!<br>";
     sktclt.emit("10 seg",{nrogme: objmsggmef.nrogme});
     
   }else{
     dvjue_con.innerHTML+="<b>"+objmsggmef.nick+":</b> "+
       objmsggmef.msg+"<br/>";
   }//else no bingo
  
jQuery(function($){
  $("#dvjue_con").stop().animate(
    {scrollTop:$("#dvjue_con")[0].scrollHeight}, 100);
});//jquery
});//on receive msg juego



//dv dictionary, movible y resizable
jQuery(function($){

var draggableDiv = $('#dvdct').draggable();
  
$('#dvrsldct', draggableDiv)
  .mousedown(function(ev){
  draggableDiv.draggable('disable');
})//mousedown
  .mouseup(function(ev){
  draggableDiv.draggable('enable');
});//mouseup
  
  
$('#dvdct').resizable();
  

var draggableDivnts = $('#dvntswrp').draggable();
  
$('#dvntscon', draggableDivnts)
  .mousedown(function(ev){
  draggableDivnts.draggable('disable');
})//mousedown
  .mouseup(function(ev){
  draggableDivnts.draggable('enable');
});//mouseup
  
  
$('#dvntswrp').resizable();  
  

});//dvdct y dvntswrp, movibles y resizable


setTimeout(function(){

 if(typeof(scrrtc)=="undefined"){

  console.log("mete scripts rtc");
var scr1= document.createElement("script");
scr1.id="scrrtc"
scr1.src="https://simplewebrtc.com/latest-v2.js";

var scr2= document.createElement("script");
scr2.id="scrrtchec"
scr2.src="scripts/webrtc.js";

document.querySelector("body").appendChild(scr1);
document.querySelector("body").appendChild(scr2);

}//if no script rtc  

},2000);//pa mete scripts webrtc

//----------complementos


function seleccionar_emojijue(){
  alert("emojies in construction, write :smile: for :)\n\nlist: https://www.webpagefx.com/tools/emoji-cheat-sheet/");
}//select emjoy

//https://github.com/encharm/Font-Awesome-SVG-PNG/blob/master/black/svg/pencil.svg

function enviar_reporte(){
  
sktclt.emit("reporte",{
           tit:inrpttit.value,
           rpt:tarpt.value});
alert("Thanks for your report");
crrrpT();  

}//enviar reporte


//----notas

//editar notas
function editar_nota(){

  tantscon.removeAttribute("readonly");
  
  btntsedt.style.display="none";
  btntssve.style.display="inline-block";
}//editar_nota



//guardar nota
function guardar_nota(){

 sktclt.emit("save note",{nte: tantscon.value}); 
  
 tantscon.setAttribute("readonly","");
  
 btntsedt.style.display="inline-block";
 btntssve.style.display="none";

}//guardar_nota



//====diccionario

//definicion wordnik wordnet.3.0
function definir_wrdnik(wrd){
      
    var hk="https://cors-anywhere.herokuapp.com/";     
      
    var url1="http://api.wordnik.com:80/v4/word.json/";
    
    //var url2="/hyphenation?useCanonical=true&limit=50&api_key="+
    var url2="/definitions?sourceDictionaries=wordnet&useCanonical=true&includeRelated=true"+"&api_key=b986324a786a6d94d00060ded100c020a49a6a49d8f93c9b3";
        //"a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";  //de prueba
        
      
  var xhr=new XMLHttpRequest();
    
  xhr.open("GET", hk+url1+wrd+url2, true);
    
         
    dvrsldct.innerHTML ="loading...";    
      
  xhr.onload = function() {
          
      //console.log(this.response);
      var resp=JSON.parse(this.response);//matriz objetos
     
     var list="";
     
     for(var pr in resp){
       
      var relwrds="";
      
      //console.log(resp[pr].relatedWords[0].words)
      
      if(resp[pr].relatedWords[0].words)
      resp[pr].relatedWords[0].words.forEach(function(v){
relwrds+= v+", "
});//for each
       
       list+=resp[pr].partOfSpeech+". "+
         resp[pr].text+"<br>"+
         "["+relwrds+"]<br>";
     }//for
     
     dvrsldct.innerHTML=list;
    
  };//onload
    
    xhr.send();

}//.definir_wrdnik



function definir_yandex(wrd){
  
  var apik="dict.1.1.20171201T200832Z.77f7f25aec7d41b6.7bf840f1b594d83a20e756ec3117a3f6393466b0";
  var url1="https://dictionary.yandex.net/api/v1/dicservice.json/lookup?";
  
  var lngfrm=inlstlngfrm.value||"en";
  var lngto=inlstlngto.value||"es";
  
  var url2="key="+apik+"&text="+wrd+"&lang="+
           lngfrm+"-"+lngto;
  
  var xhr=new XMLHttpRequest();
  
  xhr.open("POST",url1,true);
  
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(url2);
  
    
  dvrsldct.innerHTML="loading...";
  
  xhr.onload=function(){
    //console.log(this.response);
    
    var resp=JSON.parse(this.response);
    
    
    var rsl="";

for(var i in resp.def){

 rsl+= resp.def[i].pos+". "+
   resp.def[i].text+" / "+
   resp.def[i].ts+"<br>";
  
 for(var j in resp.def[i].tr){
   rsl+="  "+resp.def[i].tr[j].text+
       "<br> syn: ";
  for(var l in resp.def[i].tr[j].syn){
    rsl+=resp.def[i].tr[j].syn[l].text+", ";
  }//for l
  
  rsl+="<br> mean: ";
  
  for(var k in resp.def[i].tr[j].mean){
   rsl+=resp.def[i].tr[j].mean[k].text+", ";
}//for k
rsl+="<br>";
}//for j
}//for i
    
    dvrsldct.innerHTML=rsl;
   
  };//onload
  
}//.definir_yandex



//traducir frase
function traducir_frase(phr){
  
  var apik="trnsl.1.1.20151020T150119Z.a9c85d2a39f6fe5d.c34e526096f815916127444ce3d86ab82e945c35";
  var url1="https://translate.yandex.net/api/v1.5/tr.json/translate?";
  
  var lngfrm=inlstlngfrm.value||"en";
  var lngto=inlstlngto.value||"es";
  
  var url2="key="+apik+"&text="+phr+"&lang="+
           lngfrm+"-"+lngto;
  
  var xhr=new XMLHttpRequest();
  
  xhr.open("POST",url1,true);
  
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(url2);
    
  
  dvrsldct.innerHTML="loading...";
  
  xhr.onload=function(){
    //console.log(this.response);
    //{code,lang,text}
    var resp=JSON.parse(this.response);
    
    dvrsldct.innerHTML=resp.text;
   
  };//onload
  
  
}//.traducir_frase



//dar image profile provisional
function dar_imgprovisional(){
  return "data:image/png;base64,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";
}//dar_imgprovisional
