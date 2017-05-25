var stop = require(__dirname + '/stop.js');
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
