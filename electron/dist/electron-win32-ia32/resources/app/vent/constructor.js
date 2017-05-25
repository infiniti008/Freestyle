var pos = require('./vent.json');
var fs = require('fs');
var exec = require('child_process').execFile;
var text_vent; //переменная в которой собираются все сценарии
var to_do = ''; //переменная определяющая что нужно сделать включить или выключить насосы
var com = {
  "del" : "Delay (by milliseconds)|{{time}}\r",
  "pos" : "Mouse Position|X:{{x}} Y:{{y}}\r",
  "down" : "Mouse Event|Left Down\r",
  "up" : "Mouse Event|Left Up\r",
  "click" : "Delay (by milliseconds)|200\rMouse Event|Left Down\rDelay (by milliseconds)|200\rMouse Event|Left Up\rDelay (by milliseconds)|500\r"
};
//Начало составление файла сценария
function start_constructor(data) {
  console.log('In constructor');
  create_vent(data, function () {
    write_file();
  });
}
//Старт составления файла сценария
function create_vent(data, cb) {
  var first = {
    "vfirst" : "0",
    "vsecond" : "0"
  };
  to_do = data.to_do;
  text_vent = 'Delay (by milliseconds)|1000\r';
  //Сделать активной рабочую область
  text_vent += com.pos.replace('{{x}}', 1822).replace('{{y}}', 13);
  text_vent += com.click;
  text_vent += com.pos.replace('{{x}}', 1822).replace('{{y}}', 13);
  text_vent += com.click;
  //////////////////////////////////////////////////////////////////
  //Обрабатываем поступившие параметры
  for (var p in data) {
    if (p.indexOf('vfirst_') + 1) {
      if (first.vfirst == '0') {
        console.log('enter vfirst');
        //Вход в vfirst
        text_vent += com.pos.replace('{{x}}', pos.x.vfirst_enter).replace('{{y}}', pos.y.vfirst_enter);
        text_vent += com.click;
        text_vent += com.del.replace('{{time}}', 1000);
        first.vfirst = 1;
      }
      stop_(p);
    }
    else if (p.indexOf('vfirst_') == '-1') {
      if (p.indexOf('vsecond_') + 1) {
        //выход из обработки vfirst
        if (first.vfirst == '1') {
          console.log('exit vfirst 1');
          //Выход из vfirst
          text_vent += com.pos.replace('{{x}}', pos.x.vfirst_exit).replace('{{y}}', pos.y.vfirst_exit);
          text_vent += com.click;
          text_vent += com.del.replace('{{time}}', 1000);
          first.vfirst = 2;
        }
        //вход в обработку vsecond
        if (first.vsecond == '0') {
          console.log('enter vsecond');
          //Вход в подростковый
          text_vent += com.pos.replace('{{x}}', pos.x.vsecond_enter).replace('{{y}}', pos.y.vsecond_enter);
          text_vent += com.click;
          text_vent += com.del.replace('{{time}}', 1000);
          first.vsecond = 1;
        }
        stop_(p);
      }
    }
  }
  if (first.vfirst == '1') {
    console.log('exit vfirst 2');
    //Выход из vfirst
    text_vent += com.pos.replace('{{x}}', pos.x.vfirst_exit).replace('{{y}}', pos.y.vfirst_exit);
    text_vent += com.click;
    text_vent += com.del.replace('{{time}}', 1000);
    first.vfirst = 2;
  }
  if (first.vsecond == '1') {
    console.log('exit vsecond 2');
    //Выход из vsecond
    first.vsecond = 2;
    text_vent += com.pos.replace('{{x}}', pos.x.vsecond_exit).replace('{{y}}', pos.y.vsecond_exit);
    text_vent += com.click;
    text_vent += com.del.replace('{{time}}', 1000);
  }
  cb();
}
//Функция включения/отключения вытяжки в зависимости от пареметра то_до
function stop_(p) {
  console.log(p);
  text_vent += com.pos.replace('{{x}}', pos.x[p]).replace('{{y}}', pos.y[p]);
  text_vent += com.click;
  //Проверка необходимого действия
  if (to_do == 'on') {
    //Нажать Включить
    text_vent += com.pos.replace('{{x}}', pos.x.conf_on).replace('{{y}}', pos.y.conf_on);
    text_vent += com.click;
    console.log('to_do = ' + to_do);
  }
  else if (to_do == 'off') {
    //Нажать отключить
    text_vent += com.pos.replace('{{x}}', pos.x.conf_off).replace('{{y}}', pos.y.conf_off);
    text_vent += com.click;
    console.log('to_do = ' + to_do);
  }
  //Нажать подтвердить
  text_vent += com.pos.replace('{{x}}', pos.x.conf_conf).replace('{{y}}', pos.y.conf_conf);
  text_vent += com.click;
  //Нажать Выйти
  text_vent += com.pos.replace('{{x}}', pos.x.conf_exit).replace('{{y}}', pos.y.conf_exit);
  text_vent += com.click;
}
//Функция записи файла сценария
function write_file() {
  //Завершение работы программы
  text_vent += 'Key Press|{F12}\r';
  fs.writeFile(__dirname + '/vent.mrs', text_vent, function () {
    console.log('Мы записали в файл');
    text_vent = '';
    run_bat();
  });
}
//Функция запуска бат файла после сборки сценария
function run_bat() {
  check_bat(function (bat) {
    exec(bat, function (err) {
      console.log(err);
    });
  });
}
//Функция проверки бат файла и если его нет - создание
function check_bat(cb) {
  console.log('Check BAT file');
  var bat = __dirname + '/vent.bat';
  var exists = fs.existsSync(bat);
  if (!exists) {
    console.log('ISNT bat file');
    var bat_text = 'start \/min \"\" \"C:\\Program Files\\Nemex\\Mouse Recorder Pro\\Mouse Recorder Pro.exe\" \"';
    bat_text += __dirname + '\\vent.mrs\" -count1 -autorun -end';
    fs.writeFile(bat, bat_text, function () {
      console.log('Write to prokrutka.BAT succeeded');
      cb(bat);
    });
  }
  else {
    console.log('BAT file are');
    cb(bat);
  }
}

module.exports = {
  start_constructor : start_constructor
}
