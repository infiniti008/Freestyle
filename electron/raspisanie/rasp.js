var bat = require('./grafic_3/batut.json');
var hor = require('./grafic_3/horeograf.json');
var sau = require('./grafic_3/sps.json');
var spo = require('./grafic_3/sport.json');
var tre = require('./grafic_3/tren.json');
// var plan = require('./plan.json');
// var arry = [];
var plan;
var arry;
var fs = require('fs');
var file_list;
var chb;

function reload_plan() {
  plan = require('./plan.json');
  arry = [];
  for (var p in plan) {
    arry[p] = plan[p];
  }
}

//Функция построение массива из файлов расписаний
function create_file_name() {
  file_list = fs.readdirSync(__dirname + '/grafic_3');
  // console.log(file_list);
}
var kl = 0;
function as() {
  console.log('adff - ' + kl);
  setTimeout(as, 3000);
  kl +=1;
}


//Функция при загрузке страницы
function onloa() {
  as();
  reload_plan();
  create_file_name();
  data_time();
  // div_table.removeChild(document.getElementById('table_id'));
  check_radio();
}
//Функция проверки выбранного режима отображения в чекбоксах
function check_radio() {
  var radio_vid = document.getElementsByName('radio_vid');
  // console.log(radio_vid);
  for (var i = 0; i < radio_vid.length; i++) {
    if (radio_vid[i].checked == true) {
      if (radio_vid[i].value == 'spisok') {
        //удаление блока с пареметрами списка планирования
        if (document.getElementById('div_plan_menu')) {
          div_btn.removeChild(document.getElementById('div_plan_menu'));
        }
        if (document.getElementById('table_id')) {
          div_table.removeChild(document.getElementById('table_id'));
        }
        chb = 'spisok';
        generate_table(radio_vid[i].value);

      }
      else if (radio_vid[i].value == 'table') {
        //удаление блока с пареметрами списка планирования
        if (document.getElementById('div_plan_menu')) {
          div_btn.removeChild(document.getElementById('div_plan_menu'));
        }
        chb = 'table';
        div_table.removeChild(document.getElementById('table_id'));
        // generate_raspisanie();

      }
      else if (radio_vid[i].value == 'plan') {
        chb = 'plan';
        div_table.removeChild(document.getElementById('table_id'));
        // console.log(plan);
        add_plan_menu();
        generate_table(radio_vid[i].value);
      }
    }
  }
}
//Функция добавления меню планирования
function add_plan_menu() {
  var nasos = require('../nasos/scenario.json');
  var svet = require('../svet/scenario_svet.json');
  var vent = require('../vent/scenario_vent.json');
  var di = document.getElementById('div_btn');
  var ndiv = document.createElement('div');
  ndiv.setAttribute('class', 'plan_menu');
  ndiv.id = 'div_plan_menu';
  var sel = document.createElement('select');
  di.appendChild(ndiv);
  ndiv.appendChild(sel);
  for (var p in nasos) {
    console.log('nasos ' + p);
    var opt = document.createElement('option');
    opt.innerHTML = 'nasos: ' + p;
    sel.appendChild(opt);
  }
  for (var p in svet) {
    console.log('svet ' + p);
    var opt = document.createElement('option');
    opt.innerHTML = 'svet: ' + p;
    sel.appendChild(opt);
  }
  for (var p in vent) {
    console.log('vent ' + p);
    var opt = document.createElement('option');
    opt.innerHTML = 'vent: ' + p;
    sel.appendChild(opt);
  }
}
//Функция генерации меню для добавления напоминания из расписания
function generate_menu_add_to_plan(elem){
  console.log(elem.parentElement.id);
  if (chb == 'spisok') {
    if (!document.getElementById('div_add_to_plan')) {
      var di = document.getElementById('div_btn');
      var ndiv = document.createElement('div');
      ndiv.setAttribute('class', 'add_to_plan');
      ndiv.id = 'div_add_to_plan';
      var text = '';
      text += 'Занятия в '+ elem.parentElement.id + ' c ' + elem.innerHTML.substring(0,5) + ' до ' + elem.innerHTML.substring(8,13)  + ', цвет занятия - ' + elem.innerHTML.substring(17,20) + '\
      <figure>\
        <input type="checkbox" name="chb_nap" value="before">\
        <caption>Напомнить заранее, за </caption>\
        <input type="number" min="1" name="nap_val" max="60" step="1" value="1" id="time_before"> минут до начала\
      </figure>';
      text += '<figure>\
        <input type="checkbox" name="chb_nap" value="start">\
        <caption>Напомнить вначале, в </caption>\
        <input type="text" name="nap_val" size="2" id="time_start" value="' + elem.innerHTML.substring(0,5) + '">\
      </figure>';
      text += '<figure>\
        <input type="checkbox" name="chb_nap" value="stop">\
        <caption>Напомнить вконце, в </caption>\
        <input type="text" name="nap_val" size="2" id="time_stop" value="' + elem.innerHTML.substring(8,13) + '">\
      </figure>';
      text += '<figure>\
        <input type="checkbox" name="chb_nap" value="after">\
        <caption>Напомнить после, через </caption>\
        <input type="number" min="1" name="nap_val" max="60" step="1" value="1" id="time_before"> минут\
      </figure>';
      text += '<button onclick="generate_remind(this)">Добавить в план</button>';
      ndiv.innerHTML = text;
      di.appendChild(ndiv);
    }
    else {
      div_btn.removeChild(document.getElementById('div_add_to_plan'));
      generate_menu_add_to_plan(elem);
    }
    // console.log(elem.innerHTML.substring(0,5));
  }
}
//Функция генерации напоминания из расписания
function generate_remind(div_rem) {
  // console.log(div_rem.parentElement);
  var chbo = document.getElementsByName('chb_nap');
  var remind = {};
  // console.log();
  remind.color = div_rem.parentElement.innerHTML.substring(47,50);
  remind.type = 'remind';
  remind.from = div_rem.parentElement.innerHTML.substring(10,13);
  remind.time_on = div_rem.parentElement.innerHTML.substring(16,21);
  remind.time_off = div_rem.parentElement.innerHTML.substring(25,30);
  for (var i = 0; i < 4; i++) {
    if (chbo[i].checked) {
      if (i == 0) {
        remind.before = 'on';
        remind.time_before = document.getElementsByName('nap_val')[i].value;
      }
      else if (i == 1) {
        remind.start = 'on';
        // remind.start = document.getElementsByName('nap_val')[i].value;
      }
      else if (i == 2) {
        remind.stop = 'on';
        // remind.stop = document.getElementsByName('nap_val')[i].value;
      }
      else if (i == 3) {
        remind.after = 'on';
        remind.time_after = document.getElementsByName('nap_val')[i].value;
        // remind.stop = document.getElementsByName('nap_val')[i].value;
      }
    }
    else {
      if (i == 0) {
        remind.before = 'off';
        remind.time_before = '0';
      }
      else if (i == 1) {
        remind.start = 'off';
      }
      else if (i == 2) {
        remind.stop = 'off';
      }
      else if (i == 3) {
        remind.after = 'off';
        remind.time_after = '0';
      }
    }
  }
  div_btn.removeChild(document.getElementById('div_add_to_plan'));
  console.log(remind);
  add_to_plan_file(remind);
}
//Функция генерации таблицы
function generate_table(to) {
  if (document.getElementById('table_id')) {
    div_table.removeChild(document.getElementById('table_id'));
  }
  var tabl = document.createElement('table');
  tabl.setAttribute('class','table');
  tabl.setAttribute('id','table_id');
  div_table.appendChild(tabl);
  if (to == 'spisok') {
    for (var i = 0; i < 24; i++) {
      var row = tabl.insertRow(i);
      row.setAttribute('class','tr_row');
      row.setAttribute('id','tr_' + add_nul(i));
      var cell1 = row.insertCell(0);
      cell1.setAttribute('class','td_time');
      cell1.setAttribute('name','td_time');
      cell1.setAttribute('accesskey','td_time_' + add_nul(i));
      cell1.innerHTML = add_nul(i) + ':00';
      var cell2 = row.insertCell(1);
      cell2.setAttribute('class','td_spisok');
      cell2.setAttribute('name','td_spisok');
      // cell2.setAttribute('accesskey','td_spisok_' + add_nul(i));
    }
    generate_spisok();
  }
  else if (to == 'plan') {
    // console.log(plan);
    for (var p in plan) {
      var row = tabl.insertRow(i);
      var cell1 = row.insertCell(0);
      // console.log(plan[p].time);
      cell1.innerHTML = plan[p].time;
      var cell2 = row.insertCell(1);
      cell2.innerHTML = plan[p].message;
      cell2.setAttribute('onclick','click_sob(this)');
      cell2.id = plan[p].key;
    }
  }
}
//Функция добавления строки в конец
function generate_spisok() {
  var table = document.getElementById('table_id');
  for (var i = 0; i < file_list.length; i++) {
    var ho = parse_cur_day(file_list[i]);
    // console.log(ho);
    for (var p in ho) {
      // var u = ho[p].begin.charAt(0) + ho[p].begin.charAt(0);
      // // console.log(u);
      var text = '';
      var glob_div = document.createElement('div');
      var new_div = document.createElement('div');
      var u = ho[p].begin.charAt(0) + ho[p].begin.charAt(1);
      // console.log(u);
      var td = document.getElementById('tr_' + u).cells[1];
      td.setAttribute('accesskey','td_spisok_' + u);
      // console.log(td);
      text += ho[p].begin + ' - ' + ho[p].end;
      text += '<br>' + ho[p].color;
      // text += file_list[i];
      new_div.innerHTML = text;
      new_div.id = ho[p].color; //Устанавливаем цвет блока
      new_div.setAttribute('onclick', 'generate_menu_add_to_plan(this)');
      // new_div.setAttribute('class', 'hor');
      glob_div.id = file_list[i].substring(0,3); //Устанавливаем цвет блока
      glob_div.innerHTML = to_name(file_list[i]);
      glob_div.appendChild(new_div);
      td.appendChild(glob_div);
    }
  }
  //Удаление строк ничего не содержащих
  for (var j = 0; j < 24; j++) {
    if (document.getElementsByName('td_spisok')[j].accessKey.indexOf('td') + 1) {
      // console.log(j);
    }
    else {
      document.getElementById('tr_' + add_nul(j)).setAttribute('class', 'invis');
    }
  }
}
//Функция постороения расписания
function generate_raspisanie() {
  for (var i = 0; i < file_list.length; i++) {
    var ho = parse_cur_day(file_list[i]);
  // console.log(ho);
    for (var p in ho) {
      // var width = schet_razn(ho[p].begin, ho[p].end);
      // console.log(width);
      var text = '';
      var new_div = document.createElement('div');
      var u = ho[p].begin.charAt(0) + ho[p].begin.charAt(1);
      console.log(u);
      var td = document.getElementById('tr_' + u).cells[2];
      // console.log(td);
      text += ho[p].begin + ' - ' + ho[p].end;
      text += '<br>' + ho[p].color;
      new_div.innerHTML = text;
      new_div.id = ho[p].color;
      new_div.setAttribute('onclick', 'alert("dddd")');
      new_div.setAttribute('class', 'hor');
      td.appendChild(new_div);
    }
  }
}
//Функция считает продолжительность одного занятия в минутах
function schet_razn(b,e) {
  var r = ((b.charAt(0) + b.charAt(1)) * 60) + ((b.charAt(3) + b.charAt(4)) * 1);
  var t = ((e.charAt(0) + e.charAt(1)) * 60) + ((e.charAt(3) + e.charAt(4)) * 1);
  // console.log(t - r);
  return(t - r);
}
//Функция отображения текущей даты и времени
function data_time() {
  var div = document.getElementById('div_data');
  var dat = new Date();
  var sec = add_nul(dat.getSeconds());
  var min = add_nul(dat.getMinutes());
  var hour = add_nul(dat.getHours());
  var chislo = add_nul(dat.getDate());
  var year = dat.getFullYear();
  var mon = add_nul(dat.getMonth()+1);
  div.innerHTML = chislo + '\/' + mon + '\/' + year + '<br>&nbsp;' + hour + ':' + min + ':' + sec;
  // console.log(hour);
  setTimeout(data_time, 1000);
}
//Функция добавляеь ноль
function add_nul(p) {
  if (p < 10) {
    return('0' + p);
  }
  else {
    return(p);
  }
}
//Функция выбора дел на текущий день для выбранного в параметре расписания
function parse_cur_day(name) {
  var obj = require('./grafic_3/' + name);
  // console.log(obj);
  var dat = new Date();
  var chislo = dat.getDate();
  var day = obj[chislo];
  // console.log(day + chislo);
  return(day);
}
//Функция преобразование в название места тренировки
function to_name(name) {
  if (name == 'sport.json') {
    return('Спортивный бассейн');
  }
  if (name == 'batut.json') {
    return('Батутный зал');
  }
  if (name == 'horeograf.json') {
    return('Зал хореографии');
  }
  if (name == 'sps.json') {
    return('Спортивная сауна');
  }
  if (name == 'tren.json') {
    return('Тренажерный зал');
  }

  else {
    return('Место не определено');
  }
}


function add_to_plan_file(ob) {
  console.log(ob);
  //Если пришло напоминание из расписания
  if (ob.type == 'remind') {
    //если стоит галочка напомнить зараенее
    if (ob.before == 'on') {
      console.log('bef');
      var to_arry = {};
      // to_arry.time = ob.time_on;
      to_arry.minute = ((ob.time_on.substring(0,2)*1)*60 + ob.time_on.substring(3,5)*1) - ob.time_before;
      to_arry.message = 'Тренировка для ' + ob.color + ' в ' + ob.from + ' начинается через ' + ob.time_before + ' минут';
      to_arry.time = add_nul((to_arry.minute - to_arry.minute%60)/60) + ':' + add_nul(to_arry.minute%60);
      to_arry.key = to_arry.time + ob.color + ob.from;
      console.log(to_arry);
      arry.push(to_arry);
    }
    //Если стои галочка напомнить вначале
    if (ob.start == 'on') {
      console.log('start');
      var to_arry = {};
      to_arry.time = ob.time_on;
      to_arry.minute = (ob.time_on.substring(0,2)*1)*60 + ob.time_on.substring(3,5)*1;
      to_arry.message = 'Тренировка для ' + ob.color + ' в ' + ob.from + ' начинается прямо сейчас!';
      to_arry.key = ob.time_on + ob.color + ob.from;
      arry.push(to_arry);
    }
    //если стоит галочка напомнить вконце
    if (ob.stop == 'on') {
      console.log('end');
      var to_arry = {};
      to_arry.time = ob.time_off;
      to_arry.minute = (ob.time_off.substring(0,2)*1)*60 + ob.time_off.substring(3,5)*1;
      to_arry.message = 'Тренировка для ' + ob.color + ' в ' + ob.from + ' заканчивается прямо сейчас!';
      to_arry.key = ob.time_off + ob.color + ob.from;
      arry.push(to_arry);
    }
    //если стоит галочка напомнить после
    if (ob.after == 'on') {
      console.log('aft');
      var to_arry = {};
      // to_arry.time = ob.time_on;
      to_arry.minute = ((ob.time_off.substring(0,2)*1)*60 + ob.time_off.substring(3,5)*1) + ob.time_after*1;
      to_arry.message = 'Тренировка для ' + ob.color + ' в ' + ob.from + ' закончилась ' + ob.time_after + ' минут назад!';
      to_arry.time = add_nul((to_arry.minute - to_arry.minute%60)/60) + ':' + add_nul(to_arry.minute%60);
      to_arry.key = to_arry.time + ob.color + ob.from;
      console.log(to_arry);
      arry.push(to_arry);
    }
    //Если ничего не выбрано напоминаем только о начале
    if (ob.before == 'off' && ob.start == 'off' && ob.stop == 'off' && ob.after == 'off') {
      console.log('nothing');
      var to_arry = {};
      to_arry.time = ob.time_on;
      to_arry.minute = (ob.time_on.substring(0,2)*1)*60 + ob.time_on.substring(3,5)*1;
      to_arry.message = 'Тренировка для ' + ob.color + ' в ' + ob.from + ' начинается прямо сейчас!';
      to_arry.key = ob.time_on + ob.color + ob.from;
      arry.push(to_arry);
    }
  }
  arry.sort(sort_arry);
  save_to_json(arry, function () {

  });
  // console.log(arry);
}

function sort_arry(a,b) {
  if (a.minute > b.minute) return 1;
  if (a.minute < b.minute) return -1;
}

function save_to_json(ar, cb) {
  for (var p in plan) {
    delete plan[p];
  }
  // arry = ar;
  for (var i = 0; i < ar.length; i++) {
    plan[i] = ar[i];
  }
  // console.log(plan);
  var to_js = JSON.stringify(plan);
  fs.writeFileSync(__dirname + '/plan.json', to_js);
  reload_plan();
  cb();
}

function click_sob(tr) {
  if (document.getElementById('div_curr_row_menu')) {
    div_plan_menu.removeChild(document.getElementById('div_curr_row_menu'));
    document.getElementById('div_plan_menu').innerHTML = '';
  }
  if (tr) {
    document.getElementById('div_plan_menu').innerHTML += '<div id="div_curr_row_menu"><button id="btn_delete_row" onclick="delete_row(\'' + tr.id + '\')">Удалить строку</button>';
    for (var p in plan) {
      if (plan[p].key == tr.id) {
        // console.log(plan[p]);
        for (var r in plan[p]) {
          document.getElementById('div_plan_menu').innerHTML +='<br>' + r + ' - ' + plan[p][r];
        }
      }
    }
    document.getElementById('div_plan_menu').innerHTML += '<br><button onclick="click_sob()">Отмена</button></div>';
  }
}

function delete_row(id) {
  console.log(id);
  var arr_temp = [];
  for (var p in plan) {
    if (id != plan[p].key) {
      arr_temp.push(plan[p]);
    }
  }
  save_to_json(arr_temp, function () {
    generate_table('plan');
  });
  // console.log(arr_temp);

  document.getElementById('div_plan_menu').removeChild(document.getElementById('btn_delete_row'));
}
