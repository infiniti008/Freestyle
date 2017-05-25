var pos = require('./svet.json');
var svet = require('./svet.js');
var fs = require('fs');
var exec = require('child_process').execFile;
var text_svet; //переменная в которой собираются все сценарии
var to_do = ''; //переменная определяющая что нужно сделать включить или выключить насосы
var mul; //Переменная получаемых данных
var com = {
  "del" : "Delay (by milliseconds)|{{time}}\r",
  "pos" : "Mouse Position|X:{{x}} Y:{{y}}\r",
  "down" : "Mouse Event|Left Down\r",
  "up" : "Mouse Event|Left Up\r",
  "click" : "Delay (by milliseconds)|200\rMouse Event|Left Down\rDelay (by milliseconds)|200\rMouse Event|Left Up\rDelay (by milliseconds)|500\r"
};


//Функция создангия массива перечисления этажей
function create_arr(multi_) {
  var arr = [];
  var j = 0;
  for (var p in multi_) {
      arr[j] = p;
      j+=1;
  }
  mul = multi_;
  multi_start(arr);
}
//Функция мультизапуска
function multi_start(arr_) {
  // console.log(arr_);
  if (arr_.length != 0) {
    var ind = arr_.shift();
    // console.log(ind);
    // console.log(mul);
    start_constructor(mul[ind], function () {
      multi_start(arr_);
    });
  }
  else {
    for (var p in mul) {
      delete mul[p];
    }
    svet.del_multi();
  }
}
//Начало составление файла сценария
function start_constructor(data, cb) {
  console.log('In constructor');
  create_svet(data, function () {
    write_file(function () {
      run_bat(function () {
        console.log('we ended');
        cb();
      });
    });
  });
}
//Старт составления файла сценария
function create_svet(data, cb) {
  var first = {
    "lev" : "0",
    "prav" : "0",
    "vtor" : "0",
    "tret" : "0",
    "kupol" : "0"
  };
  to_do = data.to_do;
  text_svet = 'Delay (by milliseconds)|1000\r';
  //Сделать активной рабочую область
  text_svet += com.pos.replace('{{x}}', 1822).replace('{{y}}', 13);
  text_svet += com.click;
  text_svet += com.pos.replace('{{x}}', 1822).replace('{{y}}', 13);
  text_svet += com.click;
  //////////////////////////////////////////////////////////////////
  //Обрабатываем поступившие параметры
  for (var p in data) {
    var fr = data.from + '_';
    if (p.indexOf(fr) + 1) {
      if (first[data.from] == '0') {
        console.log('enter lev');
        //Вход в svet
        text_svet += com.pos.replace('{{x}}', pos.x[fr + 'enter']).replace('{{y}}', pos.y[fr + 'enter']);
        text_svet += com.click;
        text_svet += com.del.replace('{{time}}', 2000);
        first[data.from] = 1;
      }
      stop_(p);
    }
  }
  if (first[data.from] == '1') {
    console.log('exit vfirst 2');
    //Выход из svet
    text_svet += com.del.replace('{{time}}', 1000);
    text_svet += com.pos.replace('{{x}}', pos.x.svet_exit).replace('{{y}}', pos.y.svet_exit);
    text_svet += com.click;
    text_svet += com.del.replace('{{time}}', 1000);
    first[data.from] = 2;
  }
  cb();
}


//Функция включения/отключения вытяжки в зависимости от пареметра то_до
function stop_(p) {
  console.log(p);
  text_svet += com.pos.replace('{{x}}', pos.x[p]).replace('{{y}}', pos.y[p]);
  text_svet += com.click;
  //Проверка необходимого действия
  if (to_do == 'on') {
    //Нажать Включить
    text_svet += com.pos.replace('{{x}}', pos.x.conf_on).replace('{{y}}', pos.y.conf_on);
    text_svet += com.click;
    console.log('to_do = ' + to_do);
  }
  else if (to_do == 'off') {
    //Нажать отключить
    text_svet += com.pos.replace('{{x}}', pos.x.conf_off).replace('{{y}}', pos.y.conf_off);
    text_svet += com.click;
    console.log('to_do = ' + to_do);
  }
  //Нажать подтвердить
  // text_svet += com.pos.replace('{{x}}', pos.x.conf_conf).replace('{{y}}', pos.y.conf_conf);
  // text_svet += com.click;
  //Нажать Выйти
  text_svet += com.pos.replace('{{x}}', pos.x.conf_exit).replace('{{y}}', pos.y.conf_exit);
  text_svet += com.click;
}
//Функция записи файла сценария
function write_file(cb) {
  //Завершение работы программы
  text_svet += 'Key Press|{F12}\r';
  fs.writeFile(__dirname + '/svet.mrs', text_svet, function () {
    console.log('Мы записали в файл');
    text_svet = '';
    cb();
  });
}
//Функция запуска бат файла после сборки сценария
function run_bat(cb) {
  check_bat(function (bat) {
    exec(bat, function (err) {
      console.log(err);
      cb();
    });
  });
}
//Функция проверки бат файла и если его нет - создание
function check_bat(cb) {
  console.log('Check BAT file');
  var bat = __dirname + '/svet.bat';
  var exists = fs.existsSync(bat);
  if (!exists) {
    console.log('ISNT bat file');
    var bat_text = 'start \/min \"\" \"C:\\Program Files\\Nemex\\Mouse Recorder Pro\\Mouse Recorder Pro.exe\" \"';
    bat_text += __dirname + '\\svet.mrs\" -count1 -autorun -end';
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
  start_constructor : start_constructor,
  create_arr : create_arr
}
