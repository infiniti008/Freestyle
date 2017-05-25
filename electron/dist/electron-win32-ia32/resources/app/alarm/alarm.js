var monitor = require('./monitor.js');
var count = 0;
function onc(id) {
  if (id == 'btn_run') {
    monitor.start_momitor();
  }
  else if (id == 'btn_stop') {
    monitor.stop_monitor();
  }
  else if (id == 'btn_check') {
    monitor.check_serena();
  }
}
function change_table(text) {
  if (count < 12) {
    document.getElementById('table_log').getElementsByTagName('td')[count].innerHTML = text;
    count += 1;
  }
  else {
    cleare_table();
  }
}
function cleare_table() {
  for (var i = 0; i < 12; i++) {
    document.getElementById('table_log').getElementsByTagName('td')[i].innerHTML = ' ';
  }
  count = 0;
}

//Экспорт модулей
module.exports = {
  change_table : change_table,
  cleare_table : cleare_table
}
