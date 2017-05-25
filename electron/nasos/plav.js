var stop = require(__dirname + '/stop.js');
var scenario_nasos = require('./scenario.json');
var fs = require('fs');
function onload() {
  //функция создания селект эдемента
  create_select('create');
}
//функция построения селекта
function create_select(fro) {
  if (fro == 'create') {
    var sel = document.createElement('select');
    sel.setAttribute('class', 'select_scen');
    sel.name = 'scenario';
    sel.id = 'select_scen';
    div_btn.insertBefore(sel, ins_here);
    for (var p in scenario_nasos) {
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
  if (document.getElementById('scenario').value == 'create') {
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

    document.getElementById('scenario').value = 'save';
    document.getElementById('scenario').innerHTML = 'Сохранить сценарий';
    document.getElementById('scenario').style.border = "5px solid #e8472e";
  }
  else if (document.getElementById('scenario').value == 'save') {
    document.getElementById('scenario').value = 'create';
    document.getElementById('scenario').innerHTML = 'Создать сценарий';
    document.getElementById('scenario').style.border = "5px solid #05a189";
    save_scenario();
    div_btn.removeChild(document.getElementById('div_scenerio'));
  }
}
//Функция сохранения сценария
function save_scenario() {
  if (document.getElementById('inp_scen_name').value != '') {
    var data = {};

    for (var i = 1; i < 23; i++) {
      id = 'plav_' + i;
      if (document.getElementById(id).checked == true) {
        data[id] = 'on';
      }
    }
    for (var i = 1; i < 5; i++) {
      id = 'pod_' + i;
      if (document.getElementById(id).checked == true) {
        data[id] = 'on';
      }
    }
    for (var i = 1; i < 4; i++) {
      id = 'btk_' + i;
      if (document.getElementById(id).checked == true) {
        data[id] = 'on';
      }
    }
    id = 'mal_1';
    if (document.getElementById(id).checked == true) {
      data[id] = 'on';
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
    scenario_nasos[document.getElementById('inp_scen_name').value] = data;
    console.log(data);
    var add_to_json = JSON.stringify(scenario_nasos);
    // console.log(add_to_json);
    fs.writeFile(__dirname + '/scenario.json', add_to_json, function () {
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
  for (var p in scenario_nasos[scenario]) {
    if (p != 'to_do' && p!= 'from') {
      document.getElementById(p).checked = true;
    }
    else if (p == 'to_do') {
      if (scenario_nasos[scenario].to_do == 'on') {
        document.getElementById('radio_on').checked = true;
        check_radio('radio_on');
      }
      else if (scenario_nasos[scenario].to_do == 'off') {
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

    for (var p in scenario_nasos) {
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
      delete scenario_nasos[document.getElementById('select_del').value];
      var add_to_json = JSON.stringify(scenario_nasos);
      fs.writeFile(__dirname + '/scenario.json', add_to_json, function () {
        create_select('add');
      });
    }
    btn_del.innerHTML = 'Удалить сценарий';
    btn_del.style.border = "5px solid #05a189";
    btn_del.value = 'btn_del';
    div_btn.removeChild(document.getElementById('div_scenerio'));
  }
}




//Функция выделения всех насосов
function checked_all() {
  // if (confirm('Вы действительно хотите выбрать все?')) {
    change_check(true);
  // }
}
//Функция отмены выбора
function unchecked_all() {
  // if (confirm('Вы действительно хотите отменить выбор?')) {
    change_check(false);
  // }
}
//Функция изменения состояния чекбокса
function change_check(ans) {
  for (var i = 1; i < 23; i++) {
    id = 'plav_' + i;
    document.getElementById(id).checked = ans;
  }
  for (var i = 1; i < 5; i++) {
    id = 'pod_' + i;
    document.getElementById(id).checked = ans;
  }
  for (var i = 1; i < 4; i++) {
    id = 'btk_' + i;
    document.getElementById(id).checked = ans;
  }
  id = 'mal_1';
  document.getElementById(id).checked = ans;
}
//функция изменения надписи на кнопке
function check_radio(id) {
  if (id == 'radio_on') {
    document.getElementById('submit').innerHTML = 'Запустить выбранные насосы';
    document.getElementById('submit').style.border = "5px solid #05a189";
  }
  else if (id == 'radio_off') {
    document.getElementById('submit').innerHTML = 'Остановить выбранные насосы';
    document.getElementById('submit').style.border = "5px solid #e8472e";
  }
}
//Функция создания переменной
function get_data() {
  var id;
  var data = {};
  for (var i = 1; i < 23; i++) {
    id = 'plav_' + i;
    if (document.getElementById(id).checked) {
      data[id] = 'on';
    }
  }
  for (var i = 1; i < 5; i++) {
    id = 'pod_' + i;
    if (document.getElementById(id).checked) {
      data[id] = 'on';
    }
  }
  for (var i = 1; i < 4; i++) {
    id = 'btk_' + i;
    if (document.getElementById(id).checked) {
      data[id] = 'on';
    }
  }
  id = 'mal_1';
  if (document.getElementById(id).checked) {
    data[id] = 'on';
  }
  if (document.getElementById('radio_on').checked) {
    data.to_do = 'on';
  }
  else if (document.getElementById('radio_off').checked) {
    data.to_do = 'off';
  }
  stop.constr_scenar(data);
  console.log(data);
}
