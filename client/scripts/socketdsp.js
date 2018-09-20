//fecha: 16-09-18, 19-09, 20-09
//despues de socket.io/socket.io.js

//conexión socket
var socketclient= io.connect();


//====entra al chat
function entrar_a_chat(){
 socketclient.emit("user va a chat",socketclient.id);
}//click tab chat



//llena tabla users chat
socketclient.on("usernames",function(userscnntf){
  //userscnnt{socketclientid:user}
  //user{_id,email,firstnm,lastnm,chats[]}
  console.log("usernames...")
  var conuser="";

  for(var usernme in userscnntf){

   conuser+="<tr id=\'"+userscnntf[usernme].sktid+
    "\' data-userid='"+usernme+
    "' onclick='informar_profile(this)' >"+
    "<td><img class='igprofiletbl' src='"+
     (userscnntf[usernme].user.avatar||dar_imgprovisional() )+"'></td>"+
    "<td>"+userscnntf[usernme].user.firstnm+
    " "+userscnntf[usernme].user.lastnm+"</td>"+
    "<td>"+(userscnntf[usernme].user.gender||"-")+"</td>"+
    "<td>"+(userscnntf[usernme].user.age||"-")+"</td>"+
    "<td>"+(userscnntf[usernme].user.country||"-")+"</td>"+
    "<td>"+(userscnntf[usernme].user.learning||"-")+"</td>"+
    "<td>"+(userscnntf[usernme].user.speaks||"-")+"</td>"+
   "</tr>";
  }//for

  tblusersbd.innerHTML=conuser;

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

var roomsxcls={lang:{
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
  
  for(var opt in dtlistroom.options){
    
    if(dtlistroom.options[opt].value== inlistroom.value){

      var roomf= dtlistroom.options[opt].id.slice(3,6);
      break;
    }//if
  }//for

  entrar_a_room(roomf);
 
  spanear_room(roomf,dvlangroomscon);
  inlistroom.value="";  
}//goiN room


function go_themeroom(roomf){
 entrar_a_room(roomf);
 spanear_room(roomf,dvthemeroomscon);
}//go_themeroom



function spanear_room(roomf,dvametf){
  
  if(!document.getElementById("sproom_"+roomf) ){
    
    var sproom= document.createElement("span");
    sproom.id="sproom_"+roomf;
    sproom.setAttribute("class","spchatroom");
    sproom.setAttribute("onclick","entrar_a_room(\'"+roomf+"\')");  


    sproom.innerHTML= rooms[roomf]+' <span id="spchatcant_'+roomf+
      '" class="spchatcant"></span><svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M704 384q-153 0-286 52t-211.5 141-78.5 191q0 82 53 158t149 132l97 56-35 84q34-20 62-39l44-31 53 10q78 14 153 14 153 0 286-52t211.5-141 78.5-191-78.5-191-211.5-141-286-52zm0-128q191 0 353.5 68.5t256.5 186.5 94 257-94 257-256.5 186.5-353.5 68.5q-86 0-176-16-124 88-278 128-36 9-86 16h-3q-11 0-20.5-8t-11.5-21q-1-3-1-6.5t.5-6.5 2-6l2.5-5 3.5-5.5 4-5 4.5-5 4-4.5q5-6 23-25t26-29.5 22.5-29 25-38.5 20.5-44q-124-72-195-177t-71-224q0-139 94-257t256.5-186.5 353.5-68.5zm822 1169q10 24 20.5 44t25 38.5 22.5 29 26 29.5 23 25q1 1 4 4.5t4.5 5 4 5 3.5 5.5l2.5 5 2 6 .5 6.5-1 6.5q-3 14-13 22t-22 7q-50-7-86-16-154-40-278-128-90 16-176 16-271 0-472-132 58 4 88 4 161 0 309-45t264-129q125-92 192-212t67-254q0-77-23-152 129 71 204 178t75 230q0 120-71 224.5t-195 176.5z" fill="#fff"/>';//comments-o

    dvametf.appendChild(sproom);
  }//if no esta 

}//spanear_room span room



//entrar language room, click on name
function entrar_a_room(roomx){
  crear_room(roomx);
  //juntarlo al room: gnrl !!!
  socketclient.emit("open room",roomx);
   
}//entrar_a_room



socketclient.on("manda users al room",function(objroomf){
  //objroomf{usersroom,chatroom,sktid,room} 
  console.log("mandó users al room")
  console.log(JSON.stringify(objroomf))
  
  var usersg="";
  
  for(var nombr in objroomf.usersroom){
    usersg+=objroomf.usersroom[nombr]+"<br>";
  }//for
 
  var dvchatroom_usernm_= document.getElementById("dvchatroom_usernm_"+objroomf.room);
  
  
  dvchatroom_usernm_.innerHTML="";
  dvchatroom_usernm_.innerHTML=usersg;
    
  if(objroomf.sktid==socketclient.id){
    
    var dvchatroom_con_= document.getElementById("dvchatroom_con_"+objroomf.room); 
    
    var lichat=dvchatroom_con_.innerHTML;
    //15 lines of chat
    for(var msgchat in objroomf.chatroom){
      lichat+=objroomf.chatroom[msgchat]+"<br>";
    }//for
    dvchatroom_con_.innerHTML=lichat;

    dvchatroom_con_.scrollTo(0, dvchatroom_con_.scrollHeight);
    
  }//if es el que llega
  
});//skcl manda users al room



socketclient.on("actualizar rooms",function(objroomf){
  //objroomf{usersroom,room}
  
  console.log("actualizó rooms");
  
  if(rooms[objroomf.room]){
    
    if(roomsxcls.lang[objroomf.room]){
      spanear_room(objroomf.room,dvlangroomscon);
    }else if(roomsxcls.thm[objroomf.room]){
      spanear_room(objroomf.room,dvthemeroomscon);
    }//else if thm room

    //objroomf{usersroom,chatroom,sktid,room} 
    var cntusers=Object.keys(objroomf.usersroom).length;
    var spchatcant_= document.getElementById("spchatcant_"+objroomf.room);
    spchatcant_.innerHTML= cntusers!=0? cntusers: "";
  }//if no secret
    
});//skcl actualizar rooms




function minimizar_dvchat(roomx){//roomx
  
  jQuery(function($){

    var dvchatroom_titmin_= "#dvchatroom_titmin_"+roomx;
    var dvchatroom_= "#dvchatroom_"+roomx;
    var dvchatroom_conuser_= "#dvchatroom_conuser_"+roomx;
    var dvchatroom_msg_= "#dvchatroom_msg_"+roomx;
  
    if($(dvchatroom_titmin_).html()=="-"){
      $(dvchatroom_).height(30);
      $(dvchatroom_titmin_).html("+");
      $(dvchatroom_conuser_).hide();
      $(dvchatroom_msg_).hide();
      $(dvchatroom_).resizable("disable");
      $(dvchatroom_).css('z-index', 9999);
      
    }//if -
    else{
      $(dvchatroom_).height(200);
      $(dvchatroom_titmin_).html("-");
      $(dvchatroom_conuser_).show();
      $(dvchatroom_msg_).show();
      $(dvchatroom_).resizable("enable");
    }//else +
    
  });//jQuery
}//minimizar_dvchat



function restaurar_tamchat(roomx){//roomx
  var dvchatroom_= document.querySelector("#dvchatroom_"+roomx);
  
  if(dvchatroom_.offsetWidth<dvconchat.offsetWidth){
    dvchatroom_.style.height= dvconchat.offsetHeight+"px";
    dvchatroom_.style.width= dvconchat.offsetWidth+"px";
    dvchatroom_.style.left=0;
    dvchatroom_.style.top=0;
  }//if pequeño
  else{
    dvchatroom_.removeAttribute("style");
  }//else retorna
}//restaurar_tamchat



function cerrar_dvchat(roomx){//roomx
  var dvchatroom_= document.querySelector("#dvchatroom_"+roomx);
  dvconchat.removeChild(dvchatroom_);
  socketclient.emit("cerrar room",roomx);  
}//cerrar_dvchat



//botones chat, como zumbido, bell, volume-up

function es_botonvacio(){
  alert("Empty Button :)");
}//es_botonvacio



//........


function enviar_msg(ev,roomx){//event,roomx
  
  ev.preventDefault();
  var inchatroom_msg_= document.querySelector("#inchatroom_msg_"+roomx);

  var typeroom;
  
  if(rooms[roomx]){
    typeroom="public";
  }else{
    typeroom="secret";
  }//else


  if(inchatroom_msg_.value!=""){
    socketclient.emit("send message room",
               {msg:inchatroom_msg_.value,
                room:roomx,
                typeroom:typeroom});
    //inchatroom_msg_.getAttribute("data-room")
  }//if no vacio

  inchatroom_msg_.value="";
}//enviar_msg



//recibe mensaje en chat
socketclient.on('new message room', function(objmsgf) {
  //objmsgf{msg,nick,room}
  
  console.log("nuevo msg en room")
  
  if(!document.hasFocus()){
    favicon.href="data:image/x-icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////////////////////////8AAAAAAAAAAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP///8AAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJMAAAAAAAAAAADbcJPbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAAAAAAAAAADbcJPbcJMAAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP/////bcJPbcJMAAADbcJPbcJMAAADbcJMAAP////8AAP8AAP8AAP8AAP////8AAP/////bcJPbcJMAAADbcJPbcJMAAADbcJMAAP////8AAP8AAP8AAP////////8AAP/////bcJMAAAAAAAAAAAAAAADbcJPbcJMAAP////8AAP8AAP////8AAP////8AAP/////bcJPbcJPbcJPbcJPbcJPbcJPbcJMAAP////8AAP////8AAP8AAP////8AAP/////bcJPbcJPbcJPbcJPbcJPbcJPbcJMAAP////////8AAP8AAP8AAP////8AAP8AAAD////bcJPbcJPbcJPbcJPbcJPbcJMAAP////8AAP8AAP8AAP8AAP////8AAP8AAAAAAAD///////////////////////8AAP8AAP8AAP8AAP8AAP8AAP8AAP8AAP/AAwAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAADAAAAA";
  }//if not focus
  
  
  var dvchatroom_con_= "#dvchatroom_con_"+objmsgf.room;
  
  jQuery(function($){
  
    $(dvchatroom_con_).append('<b>'+objmsgf.nick+":</b> "+
                         objmsgf.msg+"<br/>");
    $(dvchatroom_con_).stop().animate(
      {scrollTop: $(dvchatroom_con_)[0].scrollHeight}, 200);
  });//jQuery
});//skcl new message room



//cambia icono de nuevo mensaje
window.onfocus= function(){
  
  if(favicon.href!="data:image/x-icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////////////////////////8AAAAAAAAAAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP///8AAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJMAAAAAAAAAAADbcJPbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAAAAAAAAAADbcJPbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJMAAAAAAAAAAAAAAADbcJPbcJMAAAAAAAAAAAAAAAAAAADbcJPbcJP////////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP///8AAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP///8AAAAAAAAAAAD///////////////////////////////////////////////8AAAAAAADAAwAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAADAAwAA")
  favicon.href="data:image/x-icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////////////////////////////8AAAAAAAAAAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP///8AAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJMAAAAAAAAAAADbcJPbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAAAAAAAAAADbcJPbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJPbcJMAAADbcJPbcJMAAADbcJPbcJPbcJMAAADbcJPbcJPbcJPbcJP////////bcJMAAAAAAAAAAAAAAADbcJPbcJMAAAAAAAAAAAAAAAAAAADbcJPbcJP////////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP////////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP///8AAAD////bcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJPbcJP///8AAAAAAAAAAAD///////////////////////////////////////////////8AAAAAAADAAwAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAADAAwAA";
}//tornar el favicon a la normalidad



//quien escribe, en evento attached
function esta_tipeando(inchatmsgf){
  socketclient.emit("typing",
             {room: inchatmsgf.getAttribute("data-room")});
  inchatmsgf.removeEventListener("keydown",esta_tipeando);
  setTimeout(function(){
    inchatmsgf.addEventListener("keydown",esta_tipeando);
  },1000);
  
}//esta_tipeando typing



socketclient.on("who type",function(objroomf){
  //objroomf{fistnm,room}
  //console.log(objroomf+" is typing");
  
  var nudiv= document.createElement("div");
  nudiv.id="dvtyp_"+objroomf.room;
  nudiv.setAttribute("class","dvtyp"); 
  
  nudiv.innerHTML="<b>"+objroomf.firstnm+"</b>"+"<span  class='sptyp'> is typing...</span>"+
    '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z"/></svg>';//pencil

  var dvchatroom_conuser_= document.getElementById("dvchatroom_conuser_"+objroomf.room);
  
  dvchatroom_conuser_.appendChild(nudiv);

  setTimeout(function(){
   dvchatroom_conuser_.removeChild(nudiv);
  },1000);
  
});//skcl who type


//======secret rooms

//slide in secret room
function go_secret(){

  var secretroom= insecretroom.value.replace(/\s/g,"_");
  crear_room(secretroom);
  insecretroom.value="";
  socketclient.emit("slide in secret", secretroom);
}//go_secret



function crear_room(roomx){

  var dvchatroom_= document.getElementById("dvchatroom_"+roomx);
  
  if(!dvchatroom_){
 
    var dvs= document.querySelectorAll("#dvconchat>div");

    for(var i=0;i<dvs.length;i++){
     dvs[i].classList.remove("alfrente");
    }//for   
    
     var nudiv=document.createElement("DIV");
     nudiv.id="dvchatroom_"+roomx;
     nudiv.classList.add("dvchatroom","alfrente");

     nudiv.innerHTML='<div class="dvchatroom_tit">'+

        '<div class="dvchatroom_titnm gnrl_titnm">'+(rooms[roomx]||roomx)+'</div>'+

      '<div id="dvchatroom_titmin_'+roomx+
      '" class="dvchatroom_titmin"'+
      ' onclick="minimizar_dvchat(\''+roomx+'\')">-</div>'+

      '<div class="dvchatroom_titrsz"'+
      ' onclick="restaurar_tamchat(\''+roomx+'\')">L</div>'+

      '<div class="dvchatroom_titcerrar gnrl_titcerrar"'+
      ' onclick="cerrar_dvchat(\''+roomx+'\')">x</div>'+

      '</div>'+//dvchatroom_tit

      '<div id="dvchatroom_conuser_'+roomx+
      '" class="dvchatroom_conuser">'+

      '<div id="dvchatroom_con_'+roomx+'" class="dvchatroom_con gnrl_con"></div>'+

      '<div id="dvchatroom_user_'+roomx+'" class="dvchatroom_user gnrl_user">'+

        '<div id="dvchatroom_usernm_'+roomx+
      '" class="dvchatroom_usernm"></div>'+

        '<div id="dvchatroom_userbts_'+roomx+
      '" class="dvchatroom_userbts">'+ 
        '<input type="button" value="_"'+
       ' onclick="es_botonvacio()"></div>'+

      '</div>'+//dvchatroom_user
      '</div>'+ //dvchatroom_conuser

      '<div id="dvchatroom_msg_'+roomx+
      '" class="dvchatroom_msg">'+
      '<form class="fmchatroom_msg" onsubmit="enviar_msg(event,\''+roomx+'\')">'+

      '<input type="text" id="inchatroom_msg_'+roomx+'" class="inchatroom_msg" autocorrect="off" autocomplete="off"'+
      ' data-room="'+roomx+'" placeholder="write your message">'+

      '<button id="btchatroom_msg_'+roomx+'" class="btchatroom_msg" type="submit" >'+
      '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z"/></svg>'+//paper-plane
      '</button>'+
    '</form>'+ 
      '<button class="btchatroom_emj" onclick="seleccionar_emoji(\''+roomx+'\')">'+
      '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1262 1075q-37 121-138 195t-228 74-228-74-138-195q-8-25 4-48.5t38-31.5q25-8 48.5 4t31.5 38q25 80 92.5 129.5t151.5 49.5 151.5-49.5 92.5-129.5q8-26 32-38t49-4 37 31.5 4 48.5zm-494-435q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm512 0q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm256 256q0-130-51-248.5t-136.5-204-204-136.5-248.5-51-248.5 51-204 136.5-136.5 204-51 248.5 51 248.5 136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5zm128 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/></svg>'+//smile-o
        '</button>'+

      '</div>';

    dvconchat.appendChild(nudiv);

    nudiv.addEventListener("click",function(){

      var clsact= nudiv.getAttribute("class");
      var re= new RegExp("alfrente","i");

      if(!re.test(clsact)){
        var dvs= document.querySelectorAll("#dvconchat>div");

        for(var i=0;i<dvs.length;i++){
         dvs[i].classList.remove("alfrente");
        }//for

        this.classList.add("alfrente");
        //console.log("al frente");
      }//if no la tiene

    });//click, poner al frente    
    
    jQuery(function($){

      var draggableDiv = 

      $('#dvchatroom_'+roomx).draggable();

      $('#dvchatroom_con_'+roomx, draggableDiv)
        .mousedown(function(ev){
        draggableDiv.draggable('disable');
      })//mousedown
        .mouseup(function(ev){
        draggableDiv.draggable('enable');
      });//mouseup


      $('#dvchatroom_'+roomx).resizable();

      var inchatroom_msg_= document.getElementById("inchatroom_msg_"+roomx);

      inchatroom_msg_.addEventListener("keydown",
                            function(){
            esta_tipeando(inchatroom_msg_);
      });//addeventlistener keydown tyP

    });//jQuery
    
  }//if no dvchatroom
      
}//crear_room


function seleccionar_emoji(roomf){
  //hay div, no, crea div
  var dvchatroom_user_= document.getElementById("dvchatroom_user_"+roomf);
  var dvemj_= document.getElementById("dvemj_"+roomf);

  if(!dvemj_){
    var nudiv= document.createElement("div");
    nudiv.id= "dvemj_"+roomf;
    nudiv.setAttribute("class","dvemj");

    nudiv.innerHTML= '<input type="button" value="😄" onclick="meter_emoji(\''+roomf+'\',\'smile\')">'+
    '<input type="button" value="😠" onclick="meter_emoji(\''+roomf+'\',\'angry\')">'+
    '<input type="button" value="😆" onclick="meter_emoji(\''+roomf+'\',\'laughing\')">'+
    '<input type="button" value="👍" onclick="meter_emoji(\''+roomf+'\',\'thumbsup\')">';


    dvchatroom_user_.appendChild(nudiv);

  }//if no dvemj_
  else{
    dvchatroom_user_.removeChild(dvemj_);
  }//else quitarlo

}//seleccionar_emoji


function meter_emoji(roomf,palemj){
  var inchatroom_msg_= document.getElementById("inchatroom_msg_"+roomf);
  
  inchatroom_msg_.value+=":"+palemj+":";

  var dvemj_= document.getElementById("dvemj_"+roomf);
  var dvchatroom_user_= document.getElementById("dvchatroom_user_"+roomf);

  dvchatroom_user_.removeChild(dvemj_);

}//meter_emoji




socketclient.on("manda users a secretroom",function(objroomsecretf){
  //objroomsecretf{usersroom,sktid,room}
  console.log("mando users a secretroom")
  var usersg="";
  
  for(var nombr in objroomsecretf.usersroom){
    usersg+=objroomsecretf.usersroom[nombr]+"<br>";
  }//for
 
  var dvchatroom_usernm_= document.getElementById("dvchatroom_usernm_"+objroomsecretf.room);
  
  dvchatroom_usernm_.innerHTML="";
  dvchatroom_usernm_.innerHTML=usersg;

  var dvchatroom_userbts_= document.getElementById("dvchatroom_userbts_"+objroomsecretf.room);

  dvchatroom_userbts_.innerHTML= '<button id="btcallsecret_'+objroomsecretf.room+
  //  '" data-room="'+objroomsecretf.room+
  '" onclick="juntarse_llamadasecret(this,\''+objroomsecretf.room+'\')">'+
  '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-53-3.5t-57.5-12.5-47-14.5-55.5-20.5-49-18q-98-35-175-83-127-79-264-216t-216-264q-48-77-83-175-3-9-18-49t-20.5-55.5-14.5-47-12.5-57.5-3.5-53q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"/></svg>'+//phone
  '</button>'+

  '<button id="btmtecallsecret_'+objroomsecretf.room+'" class="btmtecall">'+
  '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M463 945l-101 101q-42-103-42-214v-128q0-26 19-45t45-19 45 19 19 45v128q0 53 15 113zm1114-602l-361 361v128q0 132-94 226t-226 94q-55 0-109-19l-96 96q97 51 205 51 185 0 316.5-131.5t131.5-316.5v-128q0-26 19-45t45-19 45 19 19 45v128q0 221-147.5 384.5t-364.5 187.5v132h256q26 0 45 19t19 45-19 45-45 19h-640q-26 0-45-19t-19-45 19-45 45-19h256v-132q-125-13-235-81l-254 254q-10 10-23 10t-23-10l-82-82q-10-10-10-23t10-23l1234-1234q10-10 23-10t23 10l82 82q10 10 10 23t-10 23zm-380-132l-621 621v-512q0-132 94-226t226-94q102 0 184.5 59t116.5 152z"/></svg>'+//microphhone-slash
  '</button>'+
    '<audio id="lclaud" style="display:none" oncontextmenu="return false;" disabled></audio>'+
  ''; 
  
});//skcl manda users a secretroom
          



//====inf user

function nooP(){}//no operations, for swap functions

//cuadro, profile, chat request, al clicar user
function mostrar_userprofilechatr(ele,ev){
 
  if(ele.id!=socketclient.id)//if no es el mismo 
  if(typeof(dvinfuser)=="undefined"){
   
    var nuedvinfuser=document.createElement("DIV");
    nuedvinfuser.id="dvinfuser";
    nuedvinfuser.style="position:fixed;"+
    "left:"+ev.clientX+"px;"+
    "top:"+ev.clientY+"px";

    nuedvinfuser.innerHTML='<div id="dvinfprofilechat">'+
        '<li id="liprofile'+ele.id+
      '" data-userid="'+
      ele.getAttribute("data-userid")+
      '" onclick="informar_profile(this)">Profile</li>'+

        '<li id="lichatrequest'+ele.id+
      '" onclick="mandar_chatrequest(this)" data-userid="'+
        ele.getAttribute("data-userid")+
        '">Chat Request</li>'+
        '</div>'+
        '<div id="dvcerrarprofilechat" onclick="cerrar_infuser()">x</div>';

     dvconchat.appendChild(nuedvinfuser);
   }//if no existe: crea
}//mostrar_userprofilechatr


/*
function informar_profile(ele){
  
  //make request of user id in skcl.emit
  alert("in construction, "+ele.id);
  
}//info profile*/

function informar_profile(ele){
  
  if(ele.id!=socketclient.id){//if no es el mismo 
    
    var useridrcv= ele.getAttribute("data-userid");
    var sktidrcv= ele.id;
  
     socketclient.emit("ver su profile",
                {useridrcv:useridrcv,
                 sktidrcv:sktidrcv,
                 sktidmnd:socketclient.id});
  }//if no el mismo
}//informar_profile


socketclient.on("perfil a ver",function(objuserf){
  //objuserf{user,useridrcv,sktidrcv}
  console.log("perfil a ver");
  console.log(JSON.stringify(objuserf.user));
 
  if(typeof(dvprofileuser)=="undefined"){
    
    var nudiv= document.createElement("div");
    nudiv.id="dvprofileuser";
    nudiv.classList.add("alfrente");    

    nudiv.innerHTML= '<div id="dvprofileuser_tit">'+
    '<div id="dvprofileuser_titnme">'+
    objuserf.user.firstnm+" "+objuserf.user.lastnm+
    '</div><div id="dvprofileuser_titcerrar" onclick="cerrar_profileuser()">X</div>'+
    '</div>'+

    '<div id="dvprofileuser_con">'+
    '<img id="imgprofileuser" src="'+
    objuserf.user.avatar+
    '" alt="imgprofile"><p>'+
    objuserf.user.age+", "+objuserf.user.gender+
    '</p><p>'+objuserf.user.country+
    '</p><p>'+objuserf.user.speaks+
    '</p><p>'+objuserf.user.learning+
    '</p><p>'+objuserf.user.aboutme+
    '</div>'+
    '<div id="dvprofileuser_chatrequest">'+
    '<input type="button" value="Chat Request" '+
     ' data-useridrcv="'+objuserf.useridrcv+
    '" data-sktidrcv="'+objuserf.sktidrcv+ 
    '" onclick="mandar_chatrequestprofile(this)">'+
    '</div>';  

    dvconchat.appendChild(nudiv); 
  
    jQuery(function($){

      var draggableDiv= $("#dvprofileuser").draggable();
      $("#dvprofileuser_con", draggableDiv)
        .mousedown(function(ev){
        draggableDiv.draggable('disable');
      }).mouseup(function(ev){
        draggableDiv.draggable('enable');
      });

      $("#dvprofileuser").resizable();

    });//jQuery  
  }//if no dvprofileuser
});//skcl perfil a ver


function mandar_chatrequest(ele){
  console.log("1mando chatrequest");
  var prtid=ele.id.substr(8,ele.id.length);
  
  var useridrcv= ele.getAttribute("data-userid");
  
  socketclient.emit("manda chatrequest",
              {sktidrcv:prtid,
               useridrcv: useridrcv,
              sktidmnd:socketclient.id});
 
  cerrar_infuser();
}//mandar_chatrequest


function mandar_chatrequestprofile(ele){
  console.log("manda chat request");

  var sktidrcv=ele.getAttribute("data-sktidrcv");
  var useridrcv=ele.getAttribute("data-useridrcv");  

  socketclient.emit("manda chatrequest",
              {sktidrcv:sktidrcv,
               useridrcv: useridrcv,
              sktidmnd:socketclient.id});
  cerrar_profileuser();
}//mandar_chatrequestprofile


function cerrar_profileuser(){
  dvconchat.removeChild(dvprofileuser);
}//cerrar_profileuser


function cerrar_infuser(){
  dvconchat.removeChild(dvinfuser);
}//cerrar inf profile y chat request



socketclient.on("recibe chatrequest",function(objroomf){
  //objroomf{nmemnd,idrcv,sktidmnd,sktidrcv,roombth}
  console.log("3me dieron chatrequest");
  console.log(JSON.stringify(objroomf));
  
  var nudiv=document.createElement("div");
  nudiv.id="dvchatrequestof_"+objroomf.roombth;
  nudiv.classList.add("dvchatrequestof");  

  nudiv.innerHTML='<div id="dvchatrequestof_t">Chat request from '+
  objroomf.nmemnd+'</div>'+
    '<div id="dvchatrequestof_m" onclick="abrir_chatrequest(\''+
  objroomf.roombth+'\',\''+
  objroomf.sktidmnd+'\')">+</div>'+
    '<div id="dvchatrequestof_x">X</div>';

  dvconchat.appendChild(nudiv);
  
});//skclon recibe chatrequest



socketclient.on("espera chatrequest",function(objroomf){
  //objroomf{idmnd,idrcv,sktidmnd,sktidrcv,nmercv,roombth}
  
  //if(objroomf.sktidmnd==socketclient.id){
    
  console.log("3espera chatrequest");
  console.log(JSON.stringify(objroomf));
  
  var dvwaiting_= document.getElementById("dvwaiting_"+objroomf.roombth);
  
  if(!dvwaiting_){ 
    
    var nudiv=document.createElement("div");
    nudiv.id="dvwaiting_"+objroomf.roombth;
    nudiv.classList.add("dvwaiting");

    nudiv.innerHTML='<div id="dvwaiting_t">Waiting for '+objroomf.nmercv+'...</div>'+
     '<div id="dvwaiting_x" onclick=\'cerrar_waiting("'+
         objroomf.sktidrcv+'","'+
         objroomf.roombth+
                   '")\'>X</div>';

    dvconchat.appendChild(nudiv);
  }//if dvwaiting no creado
  //}//if es el que espera
});//skcl espera chatrequest



function cerrar_waiting(sktidrcvf,roombthf){

  var dvwaiting= document.getElementById("dvwaiting_"+roombthf);

  dvconchat.removeChild(dvwaiting);

  socketclient.emit("cancel chatrequest",
              {sktidrcv:sktidrcvf,
               roombth:roombthf});
}//cerrar_waiting



socketclient.on("eliminar chatrequest",function(objroomf){
  //objroomf{roombth}
  console.log("eliminar chatrequest")
  var dvchatrequestof= document.getElementById("dvchatrequestof_"+objroomf.roombth);

  dvconchat.removeChild(dvchatrequestof);
});//skcl eliminar chat request



function abrir_chatrequest(roombthx,sktidmndx){
  
  var dvchatroom_= document.getElementById("dvchatroom_"+roombthx); 
  
  if(!dvchatroom_){
    
    var dvs= document.querySelectorAll("#dvconchat>div");

    for(var i=0;i<dvs.length;i++){
     dvs[i].classList.remove("alfrente");
    }//for    

    var nudiv=document.createElement("DIV");
    nudiv.id="dvchatroom_"+roombthx;
    nudiv.classList.add("dvchatroom");    

    nudiv.innerHTML='<div class="dvchatroom_tit">'+

        '<div class="dvchatroom_titnm prv_titnm">Chat with</div>'+

      '<div id="dvchatroom_titmin_'+roombthx+
      '" class="dvchatroom_titmin"'+
      ' onclick="minimizar_dvchat(\''+roombthx+'\')">-</div>'+

      '<div class="dvchatroom_titrsz"'+
      ' onclick="restaurar_tamchat(\''+roombthx+'\')">L</div>'+

      '<div class="dvchatroom_titcerrar prv_titcerrar"'+
      ' onclick="cerrar_dvchat(\''+roombthx+'\')">x</div>'+

      '</div>'+//dvchatroom_tit


      '<div id="dvchatroom_conuser_'+roombthx+
      '" class="dvchatroom_conuser">'+

      '<div id="dvchatroom_con_'+roombthx+'" class="dvchatroom_con prv_con"></div>'+

    '<div id="dvchatroom_user_'+roombthx+'" class="dvchatroom_user prv_user">'+

    '<div id="dvchatroom_usernm_'+roombthx+'" class="dvchatroom_usernm"></div>'+

        '<div class="dvchatroom_userbts">'+  

      '<button id="btcall_'+roombthx+
      '" onclick="solicitar_llamada(this,\''+roombthx+'\')">'+

    '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-53-3.5t-57.5-12.5-47-14.5-55.5-20.5-49-18q-98-35-175-83-127-79-264-216t-216-264q-48-77-83-175-3-9-18-49t-20.5-55.5-14.5-47-12.5-57.5-3.5-53q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"/></svg>'+//phone
    '</button>'+

      '<button id="btmtecall_'+roombthx+'" class="btmtecall">'+
    '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M463 945l-101 101q-42-103-42-214v-128q0-26 19-45t45-19 45 19 19 45v128q0 53 15 113zm1114-602l-361 361v128q0 132-94 226t-226 94q-55 0-109-19l-96 96q97 51 205 51 185 0 316.5-131.5t131.5-316.5v-128q0-26 19-45t45-19 45 19 19 45v128q0 221-147.5 384.5t-364.5 187.5v132h256q26 0 45 19t19 45-19 45-45 19h-640q-26 0-45-19t-19-45 19-45 45-19h256v-132q-125-13-235-81l-254 254q-10 10-23 10t-23-10l-82-82q-10-10-10-23t10-23l1234-1234q10-10 23-10t23 10l82 82q10 10 10 23t-10 23zm-380-132l-621 621v-512q0-132 94-226t226-94q102 0 184.5 59t116.5 152z"/></svg>'+//microphhone-slash
    '</button>'+
      '<audio id="lclaud" style="display:none" oncontextmenu="return false;" disabled></audio>'+  
      '</div>'+//_userbts
      '</div>'+//_user
      '</div>'+//_conuser

      '<div id="dvchatroom_msg_'+roombthx+'" class="dvchatroom_msg">'+
      '<form class="fmchatroom_msg" onsubmit="enviar_msgprv(event,\''+roombthx+'\')">'+

      '<input type="text" id="inchatroom_msg_'+roombthx+'" class="inchatroom_msg" autocorrect="off" autocomplete="off"'+
      ' data-room="'+roombthx+
      '" placeholder="write your message...">'+

      '<button id="btnchatroom_msg_'+roombthx+'" class="btnchatmsg" type="submit" >'+
      '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z"/></svg>'+//paper-plane
      '</button>'+
    '</form>'+
      '<button class="btnchatroom_emj"  onclick="seleccionar_emoji(\''+roombthx+'\')">'+
      '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1262 1075q-37 121-138 195t-228 74-228-74-138-195q-8-25 4-48.5t38-31.5q25-8 48.5 4t31.5 38q25 80 92.5 129.5t151.5 49.5 151.5-49.5 92.5-129.5q8-26 32-38t49-4 37 31.5 4 48.5zm-494-435q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm512 0q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm256 256q0-130-51-248.5t-136.5-204-204-136.5-248.5-51-248.5 51-204 136.5-136.5 204-51 248.5 51 248.5 136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5zm128 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/></svg>'+//smile-o
        '</button>'+
      '</div>';    
    
    dvconchat.appendChild(nudiv);

    
    nudiv.addEventListener("click",function(){

      var clsact= nudiv.getAttribute("class");
      var re= new RegExp("alfrente","i");

      if(!re.test(clsact)){
        var dvs= document.querySelectorAll("#dvconchat>div");

        for(var i=0;i<dvs.length;i++){
         dvs[i].classList.remove("alfrente");
        }//for

        this.classList.add("alfrente");
        //console.log("al frente");
      }//if no la tiene

    });//click, poner al frente     
    
    
    jQuery(function($){

      var dvchatroom_= "#dvchatroom_"+roombthx;
      var dvchatroom_con_= "#dvchatroom_con_"+roombthx;  

      var draggableDiv= $(dvchatroom_).draggable();
      $(dvchatroom_con_, draggableDiv)
        .mousedown(function(ev){
        draggableDiv.draggable('disable');
      }).mouseup(function(ev){
        draggableDiv.draggable('enable');
      });

      $(dvchatroom_).resizable();

      var inchatroom_msg_= document.getElementById("inchatroom_msg_"+roombthx);

      inchatroom_msg_.addEventListener("keydown",
                            function(){
            esta_tipeando(inchatroom_msg_);
      });//addeventlistener keydown tyP  

    });//jQuery

    if(sktidmndx){

      var dvchatrequestof= document.getElementById("dvchatrequestof_"+roombthx);

      dvconchat.removeChild(dvchatrequestof);

        socketclient.emit("abrir chatrequest",
                    {roombth:roombthx,
                     sktidmnd:sktidmndx});
    }//if objeto sktidmndx existe
    console.log("abrio chat request");
  }//if dvchatrequestwth no creado
  
}//abrir_chatrequest



socketclient.on("acepta chatrequest",function(objroomf){
  //objroomf{nmemnd,nmercv,sktidrcv,sktidmnd,roombth}
  console.log("5aceptada chatrequest");
  console.log(JSON.stringify(objroomf));
  
  var dvwaiting= document.getElementById("dvwaiting_"+objroomf.roombth);

  dvconchat.removeChild(dvwaiting);
  
  abrir_chatrequest(objroomf.roombth);
  socketclient.emit("users al chatrequest",objroomf);  
});//skcon acepta chat reqquest



socketclient.on("mete users en chatrequest",function(objroomf){
  //objroomf{nmemnd,nmercv,sktidrcv,sktidmnd,roombth,chatprv}
  
  console.log("7mete users");
  //console.log(objroomf);
  
  var dvchatroom_usernm_= document.getElementById("dvchatroom_usernm_"+objroomf.roombth);
  
  dvchatroom_usernm_.innerHTML= objroomf.nmercv+"<br id='brrcv' data-sktid='"+
    objroomf.sktidrcv+"'/>"+
    objroomf.nmemnd+"<br id='brmnd' data-sktid='"+objroomf.sktidmnd+"'/>";
  
  var lichat="";

  for(var msgchat in objroomf.chatprv){
   lichat+=objroomf.chatprv[msgchat]+"<br>";
  }//for

  var dvchatroom_con_= document.getElementById("dvchatroom_con_"+objroomf.roombth);

  dvchatroom_con_.innerHTML=lichat;
  
});//skcl meter users chatrequest



function enviar_msgprv(ev,roombthx){
  ev.preventDefault();
  
  var inchatroom_msg_= document.querySelector("#inchatroom_msg_"+roombthx);
  
  if(inchatroom_msg_.value!=""){
    socketclient.emit("send messagechat_r",
               {msg:inchatroom_msg_.value,
                roombth:roombthx});
   //inr_msg.getAttribute("data-room")  
  }//if no vacio

  inchatroom_msg_.value="";
  
}//enviar_msgprv chat prv



socketclient.on("new msgchatrequest",function(objmsgf){
  //objmsgf{msg,nick,room}
  console.log("nuevo msgchatrequest")
  jQuery(function($){

    var dvchatroom_con_= "#dvchatroom_con_"+objmsgf.room;

    $(dvchatroom_con_).append('<b>'+objmsgf.nick+":</b> "+objmsgf.msg+"<br/>");
    $(dvchatroom_con_).stop().animate(
      {scrollTop:$(dvchatroom_con_)[0].scrollHeight}, 200);
  });//jQuery
});//skcl new msgchatrequest msg privado



/*
socketclient.on("dejar prv",function(dt){
  cerrar_dvchat(dt);
});//deja el privado
*/


socketclient.on("se desconecto",function(objmsgf){
 //objmsgf{msg}
  console.log("se desconecto +"+ JSON.stringify(objmsgf));
  alert("lost connection, for appear on the user table again, click on the chat tab"); 
});//skcl se desconecto o cerro



//=====juego


//opciones de juego para crear etw
function mostrar_etwgameopt(){
  console.log("1opciones de juego");
  
  if(typeof(dvcreategame)=="undefined"){
  
    var nudiv=document.createElement("DIV");
    nudiv.id="dvcreategame";

    nudiv.innerHTML='<div id="dvtitoptgame">'+
     '<div id="dvtitoptgamenme">Game Options</div>'+
     '<div id="dvtitoptgame_x" onclick="cerrar_gameopt()">X</div></div>'+

     '<div style="display:inline-block">'+
     '<span>Select word list:</span><br>'+
     '<select id="sllist">'+
     '<option id="nros">20 numbers</option>'+
      '<option id="essentials">essentials</option>'+
      '<option id="business">business</option>'+
      '<option id="sharedlingo">sharedlingo\'s words</option>'+
    '<option id="proposed">proposed words</option>'+
     '<option id="optld">load list, in future</option>'+
     '</select></div>'+

     '<div style="display:inline-block;text-align:center">'+
     '<span>Nro of players:</span><br>'+
     '<select id="slnroplayer">'+
     '<option id="opt2">2</option>'+
     '<option id="opt3">3</option>'+
     '<option id="opt4">4</option>'+
     '<option id="opt5">5</option>'+
     '<option id="opt6">6</option>'+
     '<option id="opt8">8</option>'+
     '</select></div><br>'+
    '<label><input type="checkbox" id="inchvce">By Voice</label><br>'+
     '<div id="dvrdygame">'+
     '<input type="button" id="btrdygame" value="Create" onclick="solicitar_juego()">'+
     '</div></div>';

    dvcongame.appendChild(nudiv);
  }//if dvcreategame no existe
    
}//mostrar_etwgameopt



function cerrar_gameopt(){
  dvcongame.removeChild(dvcreategame);
}//cerrar_gameopt



//solicitar juego explain the word
function solicitar_juego(){
  //var typegame= sltypgame.options[sltypgame.selectedIndex].value;
  var typegame= inchvce.checked? "Explain The Word (By Voice)": "Explain The Word"; 
  var listword= sllist.options[sllist.selectedIndex].id;
  var nroplayer= slnroplayer.options[slnroplayer.selectedIndex].value;
 
  dvcongame.removeChild(dvcreategame);  
  
  socketclient.emit("solicitar game",
         {typegame: typegame,
          listword: listword,
          nroplayer: nroplayer});
}//solicitar_juego



socketclient.on("crear juego",function(objgamef){
  //objgamef{nrogame,typegame,listword,nroplayer}

  console.log("2crear juego");
  console.log(JSON.stringify(objgamef));
  
  crear_juego(objgamef.nrogame,objgamef.typegame,
       objgamef.listword,objgamef.nroplayer); 
});//skcl crear juego



socketclient.on("los demas barjue",function(objbarjuef){
  //objbarjuef{nrogame,typegame,listwordnm,nroplayer}

  console.log("los demas barjue");
  console.log(JSON.stringify(objbarjuef));
  dar_barjue(objbarjuef.nrogame,objbarjuef.typegame,
        objbarjuef.listwordnm,objbarjuef.nroplayer);
});//skcl los demas barjue



function dar_barjue(roomjf,nmejuef,
                lisjuef,nroplayerf){

  console.log("crear barra de juego");
  var dvgamebar_= document.getElementById("dvgamebar_"+roomjf);

  if(!dvgamebar_){
    var nudiv=document.createElement("DIV");
    nudiv.id="dvgamebar_"+roomjf;

    nudiv.setAttribute("class","dvgamebar");
    nudiv.setAttribute("onclick","juntarse_a_juego(\'"+roomjf+"\',\'"+
                       nmejuef+"\',\'"+
                       lisjuef+"\',\'"+
                       nroplayerf+"\')");

    nudiv.setAttribute("data-idgm",roomjf);

    nudiv.innerHTML= '<div id="dvbarjuenm">'+
     nmejuef+'</div>'+
     '<div id="dvbarjuelis">'+lisjuef+
     '</div>'+
     '<div id="dvbarjuenroplayer>1/'+ //nrojug/totjug
    '<span id="spnroplayer">'+ nroplayerf+
      '</span>'+'</div>';

    dvcongame.appendChild(nudiv);
  }//if no esta la barra
}//dar_barjue



//mostrar cuadro, join, spectate
function juntarse_a_juego(roomj,nmejuef,lisjuef,nroplayerf){
  
  console.log("juntarse juego");
  crear_juego(roomj,nmejuef,lisjuef,nroplayerf);
}//juntarse o spectate



//crear ventana juego
function crear_juego(roomjf,nmejuef,lisjuef,nroplayerf){
  console.log("2creando vent juego");
  
  if(typeof(dvjue)=="undefined"){
     
    var nudivj=document.createElement("DIV");
    nudivj.id="dvjue";

    nudivj.innerHTML='<div id="dvjue_cab">'+
    '<div id="dvjue_tit" class="dvchatroom_tit">'+
      '<div id="dvjue_titnm">'+nmejuef+'</div>'+
      '<div id="dvjue_titrsz" onclick="restaurar_tamjue()">L</div>'+
      '<div id="dvjue_titcerrar" class="prv_titcerrar" onclick="cerrar_juego(\''+roomjf+'\')">X</div>'+
      '</div>'+

    '<div id="dvjue_exp">Explains: <span id="spwordtoguess">wordX</span'+
    '><span id="sptimer">00</span></div>'+
    '</div>'+//dvjue_cab

    '<div id="dvjue_conuser" class="">'+
    '<div id="dvjue_con" class=""></div>'+
    '<div id="dvjue_user" class="">'+

      '<div id="dvjue_usernm_'+roomjf+'" class="dvchatroom_usernm"></div>'+

        '<div id="dvjue_userbts_'+roomjf+'" class="dvchatroom_userbts">'+          
        '<input type="button" value="_"'+
       ' onclick="es_botonvacio()"></div>'+
      '</div>'+
    '</div>'+//_conuser

      '<div id="dvjue_msg">'+

    '<form id="fmjue_msg" class="fmchatroom_msg" onsubmit="enviar_msgjue(event)">'+
    '<input type="text" id="injue_msg" class="inchatroom_msg" placeholder="write your text..." data-room="'+roomjf+'">'+

    '<button id="btnjue_sndmsg" class="btchatroom_msg" type="submit" >'+
      '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z"/></svg>'+//paper-plane
      '</button>'+  
    '<button class="btchatroom_emj"  onclick="seleccionar_emojijue()">'+
      '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1262 1075q-37 121-138 195t-228 74-228-74-138-195q-8-25 4-48.5t38-31.5q25-8 48.5 4t31.5 38q25 80 92.5 129.5t151.5 49.5 151.5-49.5 92.5-129.5q8-26 32-38t49-4 37 31.5 4 48.5zm-494-435q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm512 0q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm256 256q0-130-51-248.5t-136.5-204-204-136.5-248.5-51-248.5 51-204 136.5-136.5 204-51 248.5 51 248.5 136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5zm128 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/></svg>'+//smile-o
        '</button>'+  
    '</form></div>';

    dvcongame.appendChild(nudivj);

    socketclient.emit("entrar roomj",
                {nrogame:roomjf, //idjue
                 typegame:nmejuef,
                 listword:lisjuef,
                 nroplayer:nroplayerf});
 
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



socketclient.on("manda user al juego",function(objgamef){
  /*objgamef{usersjue{userid[fn,sktid]}},
  nrogame,typegame,listword,nroplayer}*/
  
  console.log("4recibe user pal juego");
  console.log(JSON.stringify(objgamef));
  
  var userj="";

  for(var nom in objgamef.usersjue){
   userj+= '<div id="dvjuepnt_'+nom+'" class="dvjuepnt">0</div>'+ 
            objgamef.usersjue[nom][0]+"<br>";
  }//for

  var dvjue_usernm_= document.getElementById("dvjue_usernm_"+objgamef.nrogame);

  dvjue_usernm_.innerHTML="";
  dvjue_usernm_.innerHTML=userj;

  if(objgamef.typegame!="Explain The Word"){

    var dvjue_userbts_= document.getElementById("dvjue_userbts_"+objgamef.nrogame);

    dvjue_userbts_.innerHTML= '<button id="btcallsecret_'+objgamef.nrogame+
    //  '" data-room="'+objgamef.room+
    '" onclick="juntarse_llamadasecret(this,\''+objgamef.nrogame+'\')">'+
    '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-53-3.5t-57.5-12.5-47-14.5-55.5-20.5-49-18q-98-35-175-83-127-79-264-216t-216-264q-48-77-83-175-3-9-18-49t-20.5-55.5-14.5-47-12.5-57.5-3.5-53q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"/></svg>'+//phone
    '</button>'+

    '<button id="btmtecallsecret_'+objgamef.nrogame+'" class="btmtecall">'+
    '<svg width="16" height="16" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M463 945l-101 101q-42-103-42-214v-128q0-26 19-45t45-19 45 19 19 45v128q0 53 15 113zm1114-602l-361 361v128q0 132-94 226t-226 94q-55 0-109-19l-96 96q97 51 205 51 185 0 316.5-131.5t131.5-316.5v-128q0-26 19-45t45-19 45 19 19 45v128q0 221-147.5 384.5t-364.5 187.5v132h256q26 0 45 19t19 45-19 45-45 19h-640q-26 0-45-19t-19-45 19-45 45-19h256v-132q-125-13-235-81l-254 254q-10 10-23 10t-23-10l-82-82q-10-10-10-23t10-23l1234-1234q10-10 23-10t23 10l82 82q10 10 10 23t-10 23zm-380-132l-621 621v-512q0-132 94-226t226-94q102 0 184.5 59t116.5 152z"/></svg>'+//microphhone-slash
    '</button>'+
      '<audio id="lclaud" style="display:none" oncontextmenu="return false;" disabled></audio>'+
    ''; 
  }//if es voice  
});//manda user al juego



socketclient.on("ya comenzo jue",function(objmsgf){
  //objmsgf{msg} 

  alert(objmsgf.msg);
});//skcl ya comenzo juego, esta completo
     
          

socketclient.on("el del turno",function(objwordf){
  //objwordf{word}
  console.log("te toca explicar");
  spwordtoguess.innerHTML=objwordf.word;
});//skcl el del turno



socketclient.on("corre reloj",function(objtmpf){
  //objtmpf{tiempo}
  
  sptimer.innerHTML=objtmpf.tiempo;
  
});//skcl empieza a correr el reloj



socketclient.on("los que adivinan",function(objuserexplf){
  //objuserexplf{userexpl}
  console.log("a adivinar!: "+JSON.stringify(objuserexplf));
  spwordtoguess.innerHTML=objuserexplf.userexpl;
  dvjue_con.innerHTML="";
});//skcl los que adivinan



socketclient.on("no se adivino",function(objwordtoguessf){
//objwordtoguessf{wordtoguess}
  console.log("no se adivino");
  dvjue_con.innerHTML+="The word was <b>"+
         objwordtoguessf.wordtoguess+"</b><br>";
  
  jQuery(function($){
    $("#dvjue_con").stop().animate(
      {scrollTop:$("#dvjue_con")[0].scrollHeight}, 100);
  });//jquery
});//skcl si no se adivina



socketclient.on("actualiza puntaje",function(objpntf){
   //objpntf{userid,pntplayer}
  console.log("acutaliza puntaje: "+JSON.stringify(objpntf))
  var dvjuepnt= document.getElementById("dvjuepnt_"+objpntf.userid);

  dvjuepnt.innerHTML=objpntf.pntplayer;
});//skcl actualiza puntaje



socketclient.on("quien gano",function(objwinnerf){
  //objwinnerf{winnernme}
  console.log("ganador: "+objwinnerf)
  dvjue_con.innerHTML="The winner is: <b>"+
                objwinnerf.winnernme+"</b>!<br>";

});//skcl quien gano




function restaurar_tamjue(){
  
  if(dvjue.offsetWidth<dvcongame.offsetWidth){
    
    dvjue.style.height=dvcongame.offsetHeight+"px";
    dvjue.style.width=dvcongame.offsetWidth+"px";
    dvjue.style.left=0;
    dvjue.style.top=0;
  }//if pequeño
  else{
    dvjue.removeAttribute("style");
  }//else retorna
}//restaurar tamaño del juego


function cerrar_juego(roomj){
  dvcongame.removeChild(dvjue);
  socketclient.emit("salir del juego",{room:roomj});
}//cerrar juego



socketclient.on("eliminar gamebar",function(objroomgamef){
  //objroomgamef{roomgame}
  console.log("eliminar gamebar")
  var dvgamebar= document.getElementById("dvgamebar_"+objroomgamef.roomgame);

  dvcongame.removeChild(dvgamebar);

});//skcl eliminar gamebar



function enviar_msgjue(ev){
  ev.preventDefault();

  if(injue_msg.value!=""){

    var msg= injue_msg.value;	

    var pal= spwordtoguess.innerHTML;
    var palval= pal[0]!=pal[0].toUpperCase();

    if(palval){
      var re= new RegExp("\\b"+pal+"\\b","i");
      
      if(re.test(msg)){
        alert("can't say the word, explain it!");
      }//if esta, alerta
      else{
       socketclient.emit("send messagejue",
                   {msg:injue_msg.value,
              nrogame:injue_msg.getAttribute("data-room")});
      }//else
    }//if pal val true p dif P
    else{
      socketclient.emit("send messagejue",
                   {msg:injue_msg.value,
                    nrogame:injue_msg.getAttribute("data-room")});
    }//else enviar normal
		
  }//if no vacio

  injue_msg.value="";
}//on send msg jue, del form enviar_msgjue(event)



socketclient.on('new messagejue', function(objmsggamef){
  //objmsggamef{msg,nrogame,nick,guess}
  console.log("nuevo msgjue")
  if(objmsggamef.guess){

   dvjue_con.innerHTML+="<b>"+objmsggamef.nick+":</b> "+
     objmsggamef.msg+"<br/>"+
     "BINGO, you guessed the word!<br>";
   socketclient.emit("10 seg",{nrogame: objmsggamef.nrogame});

  }else{
   dvjue_con.innerHTML+="<b>"+objmsggamef.nick+":</b> "+
     objmsggamef.msg+"<br/>";
  }//else no bingo
  
  jQuery(function($){
    $("#dvjue_con").stop().animate(
      {scrollTop:$("#dvjue_con")[0].scrollHeight}, 100);
  });//jquery
});//on receive msg juego




//dv dictionary, movible y resizable
jQuery(function($){

  var draggableDiv = $('#dvdict').draggable();

  $('#dvresultdict', draggableDiv)
    .mousedown(function(ev){
    draggableDiv.draggable('disable');
  })//mousedown
    .mouseup(function(ev){
    draggableDiv.draggable('enable');
  });//mouseup
  
  
  $('#dvdict').resizable();


  var draggableDivnts = $('#dvntswrp').draggable();

  $('#dvntscon', draggableDivnts)
    .mousedown(function(ev){
    draggableDivnts.draggable('disable');
  })//mousedown
    .mouseup(function(ev){
    draggableDivnts.draggable('enable');
  });//mouseup


  $('#dvntswrp').resizable();  
  

});//dvdict y dvntswrp, movibles y resizable


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

  socketclient.emit("reporte",{
             tit:inreportetit.value,
             rpt:tareporte.value});
  alert("Thanks for your report");
  cerrar_reporte();  

}//enviar reporte


//----notas

//editar notas
function editar_nota(){

  tanotescon.removeAttribute("readonly");
  
  btnotesedit.style.display="none";
  btnotessave.style.display="inline-block";
}//editar_nota



//guardar nota
function guardar_nota(){

  socketclient.emit("save note",{nte: tanotescon.value}); 

  tanotescon.setAttribute("readonly","");

  btnotesedit.style.display="inline-block";
  btnotessave.style.display="none";

}//guardar_nota



//====diccionario

//definicion wordnik wordnet.3.0
function definir_wordnik(word){
      
  var hk="https://cors-anywhere.herokuapp.com/";     

  var url1="http://api.wordnik.com:80/v4/word.json/";

  //var url2="/hyphenation?useCanonical=true&limit=50&api_key="+
  var url2="/definitions?sourceDictionaries=wordnet&useCanonical=true&includeRelated=true"+"&api_key=b986324a786a6d94d00060ded100c020a49a6a49d8f93c9b3";
      //"a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";  //de prueba
        
      
  var xhr=new XMLHttpRequest();
    
  xhr.open("GET", hk+url1+word+url2, true);
    
         
  dvresultdict.innerHTML ="loading...";    
      
  xhr.onload = function() {
          
    //console.log(this.response);
    var resp=JSON.parse(this.response);//matriz objetos

    var list="";

    for(var pr in resp){

      var relwords="";

      //console.log(resp[pr].relatedWords[0].words)

      if(resp[pr].relatedWords[0].words)
        resp[pr].relatedWords[0].words.forEach(function(v){
        relwords+= v+", "
      });//for each

      list+=resp[pr].partOfSpeech+". "+
         resp[pr].text+"<br>"+
         "["+relwords+"]<br>";
    }//for

    dvresultdict.innerHTML=list;
    
  };//onload
    
  xhr.send();

}//.definir_wordnik



function definir_yandex(word){
  
  var apik="dict.1.1.20171201T200832Z.77f7f25aec7d41b6.7bf840f1b594d83a20e756ec3117a3f6393466b0";
  var url1="https://dictionary.yandex.net/api/v1/dicservice.json/lookup?";
  
  var langfrom=inlistlangfrom.value||"en";
  var langto=inlistlangto.value||"es";
  
  var url2="key="+apik+"&text="+word+"&lang="+
           langfrom+"-"+langto;
  
  var xhr=new XMLHttpRequest();
  
  xhr.open("POST",url1,true);
  
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(url2);
  
    
  dvresultdict.innerHTML="loading...";
  
  xhr.onload=function(){
    //console.log(this.response);
    
    var resp=JSON.parse(this.response);
    
    
    var result="";

    for(var i in resp.def){

      result+= resp.def[i].pos+". "+
       resp.def[i].text+" / "+
       resp.def[i].ts+"<br>";

      for(var j in resp.def[i].tr){
        result+="  "+resp.def[i].tr[j].text+
           "<br> syn: ";
      for(var l in resp.def[i].tr[j].syn){
        result+=resp.def[i].tr[j].syn[l].text+", ";
      }//for l

      result+="<br> mean: ";

      for(var k in resp.def[i].tr[j].mean){
        result+=resp.def[i].tr[j].mean[k].text+", ";
      }//for k
      result+="<br>";
      }//for j
    }//for i
    
    dvresultdict.innerHTML=result;
   
  };//onload
  
}//.definir_yandex



//traducir frase
function traducir_frase(phr){
  
  var apik="trnsl.1.1.20151020T150119Z.a9c85d2a39f6fe5d.c34e526096f815916127444ce3d86ab82e945c35";
  var url1="https://translate.yandex.net/api/v1.5/tr.json/translate?";
  
  var langfrom=inlistlangfrom.value||"en";
  var langto=inlistlangto.value||"es";
  
  var url2="key="+apik+"&text="+phr+"&lang="+
           langfrom+"-"+langto;
  
  var xhr=new XMLHttpRequest();
  
  xhr.open("POST",url1,true);
  
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(url2);
    
  
  dvresultdict.innerHTML="loading...";
  
  xhr.onload=function(){
    //console.log(this.response);
    //{code,lang,text}
    var resp=JSON.parse(this.response);
    
    dvresultdict.innerHTML=resp.text;
   
  };//onload
  
  
}//.traducir_frase



//dar image profile provisional
function dar_imgprovisional(){
  return "data:image/png;base64,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";
}//dar_imgprovisional
