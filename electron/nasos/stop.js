var pos = require('./position.json');
var fs = require('fs');
var exec = require('child_process').execFile;
var text_stop; //переменная в которой собираются все сценарии
var to_do = ''; //переменная определяющая что нужно сделать включить или выключить насосы
var com = {
  "del" : "Delay (by milliseconds)|{{time}}\r",
  "pos" : "Mouse Position|X:{{x}} Y:{{y}}\r",
  "down" : "Mouse Event|Left Down\r",
  "up" : "Mouse Event|Left Up\r",
  "click" : "Delay (by milliseconds)|200\rMouse Event|Left Down\rDelay (by milliseconds)|200\rMouse Event|Left Up\rDelay (by milliseconds)|500\r"
};
//функция конструирования сценария на исполнение
function constr_scenar(Data) {
  console.log('in constructor');
  text_stop = 'Delay (by milliseconds)|1000\r';
  var first = {
    "plav" : "0",
    "btk" : "0",
    "pod" : "0",
    "mal" : "0"
  };
  to_do = Data.to_do;
  //Сделать активной рабочую область
  text_stop += com.pos.replace('{{x}}', 1822).replace('{{y}}', 13);
  text_stop += com.click;
  text_stop += com.pos.replace('{{x}}', 1822).replace('{{y}}', 13);
  text_stop += com.click;
  //////////////////////////////////////////////////////////////////
  //работаем с объектами плавательного бассейна
  for (var p in Data) {
    if (p.indexOf('plav_') + 1) {
      if (first.plav == '0') {
        console.log('enter plav');
        //Вход в плавательный
        text_stop += com.pos.replace('{{x}}', pos.x.plav_enter).replace('{{y}}', pos.y.plav_enter);
        text_stop += com.click;
        text_stop += com.del.replace('{{time}}', 1000);
        first.plav = 1;
      }
      stop_(p);
    }
    //работа с объектами подрасткового бассейна
    else if (p.indexOf('plav_') == '-1') {
      if (p.indexOf('pod_') + 1) {
        //выход из обработки плавательного
        if (first.plav == '1') {
          console.log('exit plav_1');
          //Выход из плавательного
          text_stop += com.pos.replace('{{x}}', pos.x.plav_exit).replace('{{y}}', pos.y.plav_exit);
          text_stop += com.click;
          text_stop += com.del.replace('{{time}}', 1000);
          first.plav = 2;
        }
        //вход в обработку подрасткового
        if (first.pod == '0') {
          console.log('enter pod');
          //Вход в подростковый
          text_stop += com.pos.replace('{{x}}', pos.x.pod_enter).replace('{{y}}', pos.y.pod_enter);
          text_stop += com.click;
          text_stop += com.del.replace('{{time}}', 1000);
          first.pod = 1;
        }
        stop_(p);
      }
      //Работа с объектами после подрасткового
      else if (p.indexOf('pod_') == '-1') {
        if (p.indexOf('btk_') + 1) {
          //выход из обработки плавательного
          if (first.plav == '1') {
            console.log('exit plav_1');
            //Выход из плавательного
            text_stop += com.pos.replace('{{x}}', pos.x.plav_exit).replace('{{y}}', pos.y.plav_exit);
            text_stop += com.click;
            text_stop += com.del.replace('{{time}}', 1000);
            first.plav = 2;
          }
          //выход в обработку подрасткового
          if (first.pod == '1') {
            console.log('exit pod_1');
            //Выход из плавательного
            text_stop += com.pos.replace('{{x}}', pos.x.pod_exit).replace('{{y}}', pos.y.pod_exit);
            text_stop += com.click;
            text_stop += com.del.replace('{{time}}', 1000);
            first.pod = 2;
          }
          //вход в обработку БТК
          if (first.btk == '0') {
            console.log('enter btk');
            //Вход в БТК
            text_stop += com.pos.replace('{{x}}', pos.x.btk_enter).replace('{{y}}', pos.y.btk_enter);
            text_stop += com.click;
            text_stop += com.del.replace('{{time}}', 1000);
            first.btk = 1;
          }
          stop_(p);
        }
        //работа с объектами после БТК
        else if (p.indexOf('btk_') == '-1') {
          if (p.indexOf('mal_') + 1) {
            //выход из обработки плавательного
            if (first.plav == '1') {
              console.log('exit plav_1');
              //Выход из плавательного
              text_stop += com.pos.replace('{{x}}', pos.x.plav_exit).replace('{{y}}', pos.y.plav_exit);
              text_stop += com.click;
              text_stop += com.del.replace('{{time}}', 1000);
              first.plav = 2;
            }
            //вход в обработку подрасткового
            if (first.pod == '1') {
              console.log('exit pod_1');
              //Выход из плавательного
              text_stop += com.pos.replace('{{x}}', pos.x.pod_exit).replace('{{y}}', pos.y.pod_exit);
              text_stop += com.click;
              text_stop += com.del.replace('{{time}}', 1000);
              first.pod = 2;
            }
            //вход в обработку БТК
            if (first.btk == '1') {
              console.log('exit btk_1');
              //Выход из плавательного
              text_stop += com.pos.replace('{{x}}', pos.x.btk_exit).replace('{{y}}', pos.y.btk_exit);
              text_stop += com.click;
              text_stop += com.del.replace('{{time}}', 1000);
              first.btk = 2;
            }
            //Обработка малютки
            //Вход в малютку
            first.mal = 1;
            console.log('enter mal');
            text_stop += com.pos.replace('{{x}}', pos.x.mal_enter).replace('{{y}}', pos.y.mal_enter);
            text_stop += com.click;
            text_stop += com.del.replace('{{time}}', 1000);
            stop_(p);
            //Выйти из малютки
            first.mal = 2;
            console.log('exit mal');
            text_stop += com.pos.replace('{{x}}', pos.x.mal_exit).replace('{{y}}', pos.y.mal_exit);
            text_stop += com.click;
            text_stop += com.del.replace('{{time}}', 1000);
          }
        }
      }
    }
  }
  //выход из обработки плавательного
  if (first.plav == '1') {
    console.log('exit plav_2');
    //Выход из плавательного
    text_stop += com.pos.replace('{{x}}', pos.x.plav_exit).replace('{{y}}', pos.y.plav_exit);
    text_stop += com.click;
    text_stop += com.del.replace('{{time}}', 1000);
    first.plav = 2;
  }
  //выход в обработку подрасткового
  if (first.pod == '1') {
    console.log('exit pod_2');
    //Выход из подрасткового
    text_stop += com.pos.replace('{{x}}', pos.x.pod_exit).replace('{{y}}', pos.y.pod_exit);
    text_stop += com.click;
    text_stop += com.del.replace('{{time}}', 1000);
    first.pod = 2;
  }
  //вход в обработку БТК
  if (first.btk == '1') {
    console.log('exit btk_2');
    //Выход из подрасткового
    text_stop += com.pos.replace('{{x}}', pos.x.btk_exit).replace('{{y}}', pos.y.btk_exit);
    text_stop += com.click;
    text_stop += com.del.replace('{{time}}', 1000);
    first.btk = 2;
  }
  //Запись данных в файл скрипта
  write_file();

}
//Функция включения/отключения насоса в зависимости от пареметра то_до
function stop_(p) {
  console.log(p);
  text_stop += com.pos.replace('{{x}}', pos.x[p]).replace('{{y}}', pos.y[p]);
  text_stop += com.click;
  //Проверка необходимого действия
  if (to_do == 'on') {
    //Нажать Включить
    text_stop += com.pos.replace('{{x}}', pos.x.conf_on).replace('{{y}}', pos.y.conf_on);
    text_stop += com.click;
    console.log('to_do = ' + to_do);
  }
  else if (to_do == 'off') {
    //Нажать отключить
    text_stop += com.pos.replace('{{x}}', pos.x.conf_off).replace('{{y}}', pos.y.conf_off);
    text_stop += com.click;
    console.log('to_do = ' + to_do);
  }
  //Нажать подтвердить
  text_stop += 'Mouse Position|X:477 Y:455\r';
  text_stop += com.click;
  //Нажать Выйти
  text_stop += com.pos.replace('{{x}}', pos.x.conf_exit).replace('{{y}}', pos.y.conf_exit);
  text_stop += com.click;
}
//Функция записи в файл
function write_file() {
  //Завершение работы программы
  text_stop += 'Key Press|{F12}\r';
  var mrs = __dirname + '/prokrutka.mrs';
  fs.writeFile(mrs, text_stop, function () {
    console.log('Мы записали в файл');
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
  var bat = __dirname + '/prokrutka.bat';
  var exists = fs.existsSync('./prokrutka.bat');
  if (!exists) {
    console.log('ISNT bat file');
    var bat_text = 'start \/min \"\" \"C:\\Program Files\\Nemex\\Mouse Recorder Pro\\Mouse Recorder Pro.exe\" \"';
    bat_text += __dirname + '\\prokrutka.mrs\" -count1 -autorun -end';
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
  constr_scenar : constr_scenar
}
