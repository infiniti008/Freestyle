var fs = require('fs');
var tbody = require('./tbody.json');
var pos = require('./svet.json');
var constr = require('./constructor.js');
var scenario_svet = require('./scenario_svet.json');
const electron = require('electron');
const {ipcRenderer} = require('electron');
var mon = '1';
var cbox = '1'; //Переменная для мультизапуска
var multi = {};

//Функция при загрузке страницы
function onload() {
  //функция создания селект эдемента
  create_select('create');
  //Вызов функции для первого построения таблицы с указанными параметрами
  table_generator('lev', function () {
    console.log('first generate');
  });
  here();
}
//функция выделения места нахождения
function here(){
  var fro = document.getElementsByName('name_table')[0].accessKey;
  var ar = document.getElementsByClassName('btn_et');
  var btn = document.getElementsByClassName('btn_et')['btn_' + fro];

  for (var i = 0; i < ar.length; i++) {
    if (ar[i] == ar['btn_' + fro]) {
      document.getElementById(ar[i].id).style.border = "5px solid #e8472e";
    }
    else {
      document.getElementById(ar[i].id).style.border = "5px solid #2e69e8";
    }
  }
  // console.log('sdkjdksjhndkfsjg = ' + btn.id);
}
//функция изменения надписи на кнопке
function check_radio(id) {
  if (id == 'radio_on') {
    document.getElementById('btn_submit').innerHTML = 'Включить освещение';
    document.getElementById('btn_submit').style.border = "5px solid #2e69e8";
  }
  else if (id == 'radio_off') {
    document.getElementById('btn_submit').innerHTML = 'Отключить освещение';
    document.getElementById('btn_submit').style.border = "5px solid #e8472e";
  }
}
//Функция отмены выделения на всем
function unchecked_all() {
  var l = document.getElementsByName('checkbox');
  for (var i = 0; i < l.length; i++) {
    l[i].checked = false;
  }
}
//функция построения селекта
function create_select(fro) {
  if (fro == 'create') {
    var sel = document.createElement('select');
    sel.setAttribute('class', 'select_scen');
    sel.name = 'scenario';
    sel.id = 'select_scen';
    div_btn.insertBefore(sel, btn_conf);
    for (var p in scenario_svet) {
      var new_opt = document.createElement('option');
      // new_opt.id = p;
      new_opt.value = p;
      new_opt.innerHTML = p;
      sel.appendChild(new_opt);
    }
  }
  else if (fro == 'add') {
    div_btn.removeChild(document.getElementById('select_scen'));
    create_select('create')
  }
}
//Функция создания области ввода информации о сценарии
function create_scenario() {
  if (document.getElementById('btn_add_scen').value == 'create') {
    // unchecked_all();
    var new_div = document.createElement('div');
    new_div.id = 'div_scenerio';
    new_div.class = 'div_scenerio';
    div_btn.appendChild(new_div);
    new_div.innerHTML = '\
    <label for="inp_scen_name" style="font-size:15px; font-weight:bold">1. Введите название сценария</label>\
    <input id="inp_scen_name" type="text" name="name_scenario" style="width:210px">\
    <br>\
    <label for="inp_scen_name" style="font-size:15px; font-weight:bold">2. Выберите элементы для запуска</label>\
    <br>\
    <label for="inp_scen_name" style="font-size:15px; font-weight:bold">3. Выберите "Запустить" или "Остановить"</label><br>';

    document.getElementById('btn_add_scen').value = 'save';
    document.getElementById('btn_add_scen').innerHTML = 'Сохранить сценарий';
    document.getElementById('btn_add_scen').style.border = "5px solid #e8472e";
  }
  else if (document.getElementById('btn_add_scen').value == 'save') {
    document.getElementById('btn_add_scen').value = 'create';
    document.getElementById('btn_add_scen').innerHTML = 'Создать сценарий';
    document.getElementById('btn_add_scen').style.border = "5px solid #05a189";
    save_scenario();
    div_btn.removeChild(document.getElementById('div_scenerio'));
  }
}
//Функция сохранения сценария
function save_scenario() {
  if (document.getElementById('inp_scen_name').value != '') {
    var data = {};
    var l = document.getElementsByName('checkbox');
    for (var i = 0; i < l.length; i++) {
      if (l[i].checked == true) {
        data[l[i].id] = 'on';
      }
    }

    if (document.getElementById('radio_on').checked == true) {
      data.to_do = 'on';
    }
    else if (document.getElementById('radio_off').checked == true) {
      data.to_do = 'off';
    }
    data.from = document.getElementsByName('name_table')[0].accessKey;
    //Вызываем функцию для очистки выделений
    unchecked_all();
    //Добавляем строку в селект
    scenario_svet[document.getElementById('inp_scen_name').value] = data;
    var add_to_json = JSON.stringify(scenario_svet);
    // console.log(add_to_json);
    fs.writeFile(__dirname + '/scenario_svet.json', add_to_json, function () {
      create_select('add');
    });
  }
  else {
    alert('Вы не ввели имя сценария!\nПопробуйте еще раз!!!');
  }

}
//Функция подтверждения сценария
function confirm_scenario() {
  unchecked_all();
  var scenario = document.getElementById('select_scen').value;
  // console.log(scenario_vent[scenario]);
  for (var p in scenario_svet[scenario]) {
    if (p != 'to_do' && p!= 'from') {
      document.getElementById(p).checked = true;
    }
    else if (p == 'to_do') {
      if (scenario_svet[scenario].to_do == 'on') {
        document.getElementById('radio_on').checked = true;
        check_radio('radio_on');
      }
      else if (scenario_svet[scenario].to_do == 'off') {
        document.getElementById('radio_off').checked = true;
        check_radio('radio_off');
      }
    }
  }
}
//Функция удаления сценария
function del_scenario(fro) {
  var btn_del = document.getElementById('btn_del');
  if (fro == 'btn_del') {
    var new_div = document.createElement('div');
    new_div.id = 'div_scenerio';
    new_div.class = 'div_scenerio';
    div_btn.appendChild(new_div);
    new_div.innerHTML = '\
    <label for="select_del" style="font-size:15px; font-weight:bold">1. Выберите сценария для удаления</label>\
    <select class="select_scen" name="scenario" id="select_del">\
    </select>\
    <br>\
    <label for="select_del" style="font-size:15px; font-weight:bold">2. Нажмите "УДАЛИТЬ"</label>';

    for (var p in scenario_svet) {
      var new_opt = document.createElement('option');
      new_opt.id = p;
      new_opt.value = p;
      new_opt.innerHTML = p;
      select_del.appendChild(new_opt);
    }
    btn_del.innerHTML = 'УДАЛИТЬ';
    btn_del.style.border = "5px solid #e8472e";
    btn_del.value = 'btn_del_conf';
  }
  else if (fro == 'btn_del_conf') {
    if(confirm('Вы действительно хотите удалить сценарий \"' + document.getElementById('select_del').value + '"?') == true){
      delete scenario_svet[document.getElementById('select_del').value];
      var add_to_json = JSON.stringify(scenario_svet);
      fs.writeFile(__dirname + '/scenario_svet.json', add_to_json, function () {
        create_select('add');
      });
    }
    btn_del.innerHTML = 'Удалить сценарий';
    btn_del.style.border = "5px solid #05a189";
    btn_del.value = 'btn_del';
    div_btn.removeChild(document.getElementById('div_scenerio'));
  }
}
//Функция изменения таблицы на выбранную
function change_table(value_btn) {
  if (cbox == '2') {
    console.log('sdffffff');
    var data = {};
    var len = 0;
    var l = document.getElementsByName('checkbox');
    for (var i = 0; i < l.length; i++) {
      if (l[i].checked == true) {
        data[l[i].id] = 'on';
        len += 1;
      }
    }
    if (document.getElementById('radio_on').checked == true) {
      data.to_do = 'on';
      len += 1;
    }
    else if (document.getElementById('radio_off').checked == true) {
      data.to_do = 'off';
      len += 1;
    }
    data.from = document.getElementsByName('name_table')[0].accessKey;
    len += 1;

    if (len > 2) {
      multi[data.from] = data;
      console.log(multi);
    }
    // constr.start_constructor(data);
    // console.log('len = ' + len);
  }
  console.log('in chenge table');
  //Вызов функции сохранения текущей конфигурации
  save_tbody(function () {
    console.log('exit save');
    //Вызов функции построения новой таблицы
    table_generator(value_btn, function () {
      console.log('end');
      here();
    });
  });
}
//Функция сохранения текущей конфигурации таблицы
function save_tbody(cb) {
  var accessKey = document.getElementsByName('name_table')[0].accessKey;
  console.log(accessKey);
  console.log('in save table');
  tbody[accessKey] = document.getElementsByName('name_table')[0].innerHTML;
  var add_to_json = JSON.stringify(tbody);
  fs.writeFile(__dirname + '/tbody.json', add_to_json, function () {
    console.log('Succed save ' + accessKey);
    cb();
  });
}
//Функция построения таблицы по указанным параметрам
function table_generator(val, cb) {
  console.log('in table generator, val = ' + val);
  document.getElementsByName('name_table')[0].innerHTML = tbody[val];
  document.getElementsByName('name_table')[0].id = 'table_' + val;
  document.getElementsByName('name_table')[0].accessKey = val;
  //если стоит галочка мульти выделение
  if (cbox == '2' && multi[val]) {
    console.log(multi[val]);
    for (var p in multi[val]) {
      if (p != 'from' && p!= 'to_do') {
        console.log('asdasdas' + p);
        document.getElementById(p).checked = true;
      }
    }
  }
  cb();
}
//Функция добавления строки в конец
function add_tr(text) {
  console.log('in add tr');
  var table = document.getElementsByName('name_table')[0];
  var col_row = document.getElementsByName('name_table')[0].rows.length;
  // Create an empty <tr> element and add it to the 1st position of the table:
  var row = table.insertRow(col_row);
  // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var new_inp = document.createElement('input');
  new_inp.type = 'checkbox';
  new_inp.name = 'checkbox';
  new_inp.value = document.getElementsByName('name_table')[0].accessKey + '_' + col_row;
  new_inp.id = document.getElementsByName('name_table')[0].accessKey + '_' + col_row;
  // Add some text to the new cells:
  cell1.appendChild(new_inp);
  cell2.innerHTML = text;
}
//Функция удаления последней строки
function del_tr() {
  var ch = document.getElementsByName('checkbox');
  var f = document.getElementsByName('name_table')[0].rows.length;
  document.getElementsByName('name_table')[0].deleteRow(f - 1);
  //Если нужно удалить выбраную строку
  // for (var i = 0; i < ch.length; i++) {
  //   if (ch[i].checked == true) {
  //     console.log(ch[i]);
  //     document.getElementsByName('name_table')[0].deleteRow(i);
  //   }
  // }
}
//Функция сохранения координат в файл с возможностью указания описания и названия ключа по которому поизойдет сохранения
function save_coord() {
  if (document.getElementById('btn_add_tr').value == 'create') {
    var new_div = document.createElement('div');
    new_div.id = 'div_opisanie';
    new_div.class = 'div_opisanie';
    div_btn.appendChild(new_div);
    new_div.innerHTML = '\<br>\
    <label for="inp_scen_name" style="font-size:15px; font-weight:bold">1. Введите описание точки</label>\
    <input id="inp_opisanie" type="text" name="opisanie" style="width:220px">';
    document.getElementById('btn_add_tr').value = 'save';
    document.getElementById('btn_add_tr').innerHTML = 'Сохранить точку';
    document.getElementById('btn_add_tr').style.border = "5px solid #e8472e";
    document.onkeydown = function(e) {
      e = e || window.event;
      if (e.keyCode == 17) {
        var key = document.getElementsByName('name_table')[0].accessKey + '_' + document.getElementsByName('name_table')[0].rows.length;
        //Для ввода ключа с которым сохраняем
        // var key = document.getElementById('inp_opisanie').value;
        var coord = electron.screen.getCursorScreenPoint();
        pos.x[key] = coord.x;
        pos.y[key] = coord.y;
        console.log(pos);
        new_div.innerHTML +='<br><br>x = ' + coord.x + ' || y = ' + coord.y;
        mon = '2';
      }
      return true;
    }
  }
  else if (document.getElementById('btn_add_tr').value == 'save') {
    if (document.getElementById('inp_opisanie').value == '') {
      alert('Введите описание')
    }
    if (mon == '1') {
      alert('Выберите координаты');
    }
    if (document.getElementById('inp_opisanie').value != '' && mon == '2') {
      document.getElementById('btn_add_tr').value = 'create';
      document.getElementById('btn_add_tr').innerHTML = 'Создать точку';
      document.getElementById('btn_add_tr').style.border = "5px solid #05a189";
      var add_to_json = JSON.stringify(pos);
      fs.writeFile(__dirname + '/svet.json', add_to_json, function () {
        console.log('zapis');
      });
      add_tr(document.getElementById('inp_opisanie').value);
      div_btn.removeChild(document.getElementById('div_opisanie'));
      mon = '1';
    }
  }
}
//Старт сбора макроса
function get_data() {
  if (confirm('Вы действительно хотите выполнить выбранные действия???') == true) {
    var data = {};
    var l = document.getElementsByName('checkbox');
    for (var i = 0; i < l.length; i++) {
      if (l[i].checked == true) {
        data[l[i].id] = 'on';
      }
    }
    if (document.getElementById('radio_on').checked == true) {
      data.to_do = 'on';
    }
    else if (document.getElementById('radio_off').checked == true) {
      data.to_do = 'off';
    }
    data.from = document.getElementsByName('name_table')[0].accessKey;
    // console.log(data);
    // constr.start_constructor(data);
    multi[data.from] = data;
    console.log(multi);
    constr.create_arr(multi);
  }
}
//Функция удаления объекта мульти
function del_multi() {
  for (var p in multi) {
    delete multi[p];
  }
  console.log('multi is deleted!!!');
  var l = document.getElementsByName('checkbox');
  for (var i = 0; i < l.length; i++) {
    l[i].checked = false
  }
  document.getElementById('cbox_multi').checked = false;
  cbox = '1';
}
//Функция обработки нескольких этажей
function cbox_multi() {
  if (document.getElementById('cbox_multi').checked == true) {
    cbox = '2';
  }
  else if (document.getElementById('cbox_multi').checked == false) {
    del_multi();
    cbox = '1';
    // console.log(multi);
  }
  console.log(cbox);
}

module.exports = {
  del_multi : del_multi
}

// function asd(){
//   console.log(electron.screen.getCursorScreenPoint());
//   ipcRenderer.send('on', 'data');
// }
