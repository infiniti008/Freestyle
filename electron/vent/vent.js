var constr = require('./constructor.js');
var scenario_vent = require('./scenario_vent.json');
var fs = require('fs');
//Функция при загрузке страницы
function onload() {
  create_select('create');
}
//функция изменения надписи на кнопке
function check_radio(id) {
  if (id == 'radio_on') {
    document.getElementById('btn_submit').innerHTML = 'Запустить вытяжки';
    document.getElementById('btn_submit').style.border = "5px solid #2e69e8";
  }
  else if (id == 'radio_off') {
    document.getElementById('btn_submit').innerHTML = 'Остановить вытяжки';
    document.getElementById('btn_submit').style.border = "5px solid #e8472e";
  }
}

// //Функция выделения всего
// function checked_all(){
//   var f = document.getElementsByName('vfirst');
//   for (var i = 0; i < f.length; i++) {
//     f[i].checked = true;
//   }
//   var s = document.getElementsByName('vsecond');
//   for (var i = 0; i < s.length; i++) {
//     s[i].checked = true;
//   }
// }

//Функция отмены выделения
function unchecked_all(){
  var f = document.getElementsByName('vfirst');
  for (var i = 0; i < f.length; i++) {
    f[i].checked = false;
  }
  var s = document.getElementsByName('vsecond');
  for (var i = 0; i < s.length; i++) {
    s[i].checked = false;
  }
}
//Старт сбора макроса
function get_data() {
  if (confirm('Вы действительно хотите выполнить выбранные действия???') == true) {
    var data = {};
    var f = document.getElementsByName('vfirst');
    for (var i = 0; i < f.length; i++) {
      if (f[i].checked == true) {
        data[f[i].id] = 'on';
      }
    }
    var s = document.getElementsByName('vsecond');
    for (var i = 0; i < s.length; i++) {
      if (s[i].checked == true) {
        data[s[i].id] = 'on';
      }
    }
    if (document.getElementById('radio_on').checked == true) {
      data.to_do = 'on';
    }
    else if (document.getElementById('radio_off').checked == true) {
      data.to_do = 'off';
    }
    console.log(data);
    constr.start_constructor(data);
  }
}
//Функция создания области ссода информации о сценарии
function create_scenario() {
  if (document.getElementById('btn_add_scen').value == 'create') {
    // unchecked_all();
    var new_div = document.createElement('div');
    new_div.id = 'div_scenerio';
    new_div.class = 'div_scenerio';
    div_btn.insertBefore(new_div, btn_ex);
    new_div.innerHTML = '\
    <label for="inp_scen_name" style="font-size:15px; font-weight:bold">1. Введите название сценария</label>\
    <input id="inp_scen_name" type="text" name="name_scenario" style="width:210px">\
    <br>\
    <label for="inp_scen_name" style="font-size:15px; font-weight:bold">2. Выберите элементы для запуска</label>\
    <br>\
    <label for="inp_scen_name" style="font-size:15px; font-weight:bold">3. Выберите "Запустить" или "Остановить"</label>\
    <script type="text/javascript" src="vent.js"></script>';

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
    var f = document.getElementsByName('vfirst');
    for (var i = 0; i < f.length; i++) {
      if (f[i].checked == true) {
        data[f[i].id] = 'on';
      }
    }
    var s = document.getElementsByName('vsecond');
    for (var i = 0; i < s.length; i++) {
      if (s[i].checked == true) {
        data[s[i].id] = 'on';
      }
    }
    if (document.getElementById('radio_on').checked == true) {
      data.to_do = 'on';
    }
    else if (document.getElementById('radio_off').checked == true) {
      data.to_do = 'off';
    }
    //Вызываем функцию для очистки выделений
    unchecked_all();
    //Добавляем строку в селект
    scenario_vent[document.getElementById('inp_scen_name').value] = data;
    var add_to_json = JSON.stringify(scenario_vent);
    // console.log(add_to_json);
    fs.writeFile(__dirname + '/scenario_vent.json', add_to_json, function () {
      create_select('add');
    });
  }
  else {
    alert('Вы не ввели имя сценария!\nПопробуйте еще раз!!!');
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
    for (var p in scenario_vent) {
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
//Функция удаления сценария
function del_scenario(fro) {
  var btn_del = document.getElementById('btn_del');
  if (fro == 'btn_del') {
    var new_div = document.createElement('div');
    new_div.id = 'div_scenerio';
    new_div.class = 'div_scenerio';
    div_btn.insertBefore(new_div, btn_ex);
    new_div.innerHTML = '\
    <label for="select_del" style="font-size:15px; font-weight:bold">1. Выберите сценария для удаления</label>\
    <select class="select_scen" name="scenario" id="select_del">\
    </select>\
    <br>\
    <label for="select_del" style="font-size:15px; font-weight:bold">2. Нажмите "УДАЛИТЬ"</label>';

    for (var p in scenario_vent) {
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
      delete scenario_vent[document.getElementById('select_del').value];
      var add_to_json = JSON.stringify(scenario_vent);
      fs.writeFile(__dirname + '/scenario_vent.json', add_to_json, function () {
        create_select('add');
      });
    }
    btn_del.innerHTML = 'Удалить сценарий';
    btn_del.style.border = "5px solid #05a189";
    btn_del.value = 'btn_del';
    div_btn.removeChild(document.getElementById('div_scenerio'));
  }
}
//Функция подтверждения сценария
function confirm_scenario() {
  unchecked_all();
  var scenario = document.getElementById('select_scen').value;
  // console.log(scenario_vent[scenario]);
  for (var p in scenario_vent[scenario]) {
    if (p != 'to_do') {
      document.getElementById(p).checked = true;
    }
    else if (p == 'to_do') {
      if (scenario_vent[scenario].to_do == 'on') {
        document.getElementById('radio_on').checked = true;
        check_radio('radio_on');
      }
      else if (scenario_vent[scenario].to_do == 'off') {
        document.getElementById('radio_off').checked = true;
        check_radio('radio_off');
      }
    }
  }
}
function test() {
  alert('dsjhfbkdjvf');
}
