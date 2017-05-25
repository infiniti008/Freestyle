//Подключаем модули
var alarm = require('./alarm.js');
var screenshot = require('desktop-screenshot');
var fs = require('fs');
var gm = require('gm');
var resemble = require('node-resemble-js');
var exec = require('child_process').execFile;
//Объявляем переменные
var bat = __dirname +'/mus/mus.bat'; //Адрес для запуска бат файла
var id_serena; //ИД процессе перезапуска сирены
var id_monitor; //ИД процесс перезапуска мониторинга экрана
//Cтаруем мониторинг
// start_momitor();
//Функция запуска мониторинга
function start_momitor() {
  alarm.cleare_table();
  check_bat(function () {
    check_vbs(function () {
      create_screensot();
    });
  });
}
//Функция проверки бат файла и если его нет - создание
function check_bat(cb) {
  console.log('Check BAT file');
  alarm.change_table('Check BAT file');
  var exists = fs.existsSync(__dirname + '/mus/mus.bat');
  if (!exists) {
    console.log('ISNT bat file');
    alarm.change_table('ISNT bat file');
    var bat_text = 'start /min "" "' + __dirname;
    bat_text += "\\mus\\mus.vbs\"";
    fs.writeFile(__dirname + '/mus/mus.bat', bat_text, function () {
      console.log('Write to MUS.BAT succeeded');
      alarm.change_table('Write to MUS.BAT succeeded');
      cb();
    });
  }
  else {
    console.log('BAT file are');
    alarm.change_table('BAT file are');
    cb();
  }
}
//Функция проверки VBS файла и если его нет - создание
function check_vbs(cb) {
  console.log('Check VBS file');
  alarm.change_table('Check VBS file');
  var exists = fs.existsSync(__dirname + '/mus/mus.vbs');
  if (!exists) {
    console.log('ISNT vbs file');
    alarm.change_table('ISNT vbs file');
    var vbs_text = 'Set oVoice = CreateObject(\"SAPI.SpVoice\")\nset oSpFileStream = CreateObject(\"SAPI.SpFileStream\")\n';
    vbs_text += 'oSpFileStream.Open \"' + __dirname + '\\mus\\serena.wav"\n';
    vbs_text += 'oVoice.SpeakStream oSpFileStream\noSpFileStream.Close';
    fs.writeFile(__dirname + '/mus/mus.vbs', vbs_text, function () {
      console.log('Write to MUS.VBS succeeded');
      alarm.change_table('Write to MUS.VBS succeeded');
      cb();
    });
  }
  else {
    console.log('VBS file are');
    alarm.change_table('VBS file are');
    cb();
  }
}
//Функция создания скриншота экрана
function create_screensot() {
  screenshot(__dirname + "/img/screenshot.png", function(error, complete) {
    if(error){
      console.log("Screenshot failed", error);
      alarm.change_table(error);
      id_monitor = setTimeout(start_momitor, 20000); //Перезапускаем мониторинг через 20 секунд если не удалос сделать скриншот
    }
    else{
      console.log("Screenshot succeeded");
      alarm.change_table("Screenshot succeeded");
      crop_shu();
    }
  });
}
//Функция вырезания части экрана для ШУ
function crop_shu() {
  gm(__dirname + '/img/screenshot.png')
  .crop(184, 596, 18, 165)
  .write(__dirname + '/img/shu.png', function (err) {
    if (!err) {
      console.log('Cropped Shu');
      alarm.change_table('Cropped Shu');
      crop_plc();
    }
    if (err) {
      console.log('false');
      alarm.change_table('false');
    }
  });
}
//Функция вырезания части экрана для ПЛК
function crop_plc() {
  gm(__dirname + '/img/screenshot.png')
  .crop(1285, 94, 595, 855)
  .write(__dirname + '/img/plc.png', function (err) {
    if (!err) {
      console.log('Cropped Plc');
      alarm.change_table('Cropped Plc');
      diff_plc();
    }
    if (err) {
      console.log('false');
      alarm.change_table('false');
    }
  });
}
//Проверяем на наличие разницы между изображениями PLC
function diff_plc() {
  resemble(__dirname + '/img/plc.png').compareTo(__dirname + '/img/etalon_plc.png').ignoreColors().onComplete(function(data){
    if (data.misMatchPercentage == 0) {
      console.log('Here ISNT diff in PLC');
      alarm.change_table('Here ISNT diff in PLC');
      diff_shu();
    }
    else {
      console.log('Here IS diff in PLC');
      alarm.change_table('Here IS diff in PLC');
      console.log('diff = ' + data.misMatchPercentage);
      alarm.change_table('diff = ' + data.misMatchPercentage);
      start_serena();
    }
  });
}
//Проверяем на наличие разницы между изображениями SHU
function diff_shu() {
  resemble(__dirname + '/img/shu.png').compareTo(__dirname + '/img/etalon_shu.png').ignoreColors().onComplete(function(data){
    if (data.misMatchPercentage == 0) {
      console.log('Here ISNT diff in SHU');
      alarm.change_table('Here ISNT diff in SHU');
      id_monitor = setTimeout(start_momitor, 15000);
    }
    else {
      console.log('Here IS diff in SHU');
      alarm.change_table('Here IS diff in SHU');
      console.log('diff = ' + data.misMatchPercentage);
      alarm.change_table('diff = ' + data.misMatchPercentage);
      start_serena();
    }
  });
}
//Функция запуска сирены
function start_serena() {
  console.log('We run serena!!!');
  alarm.change_table('We run serena!!!');
  exec(bat, function(err) {
    console.log(err);
    alarm.change_table(err);
  });
  id_serena = setTimeout(start_serena, 13000);
}
//Функция остановки мониторинга
function stop_monitor() {
  alarm.change_table('We stopping monitor!!!');
  clearTimeout(id_monitor);
  clearTimeout(id_serena);
}
//Функция проверки серены
function check_serena() {
  console.log('We check serena!!!');
  alarm.change_table('We check serena!!!');
  exec(bat, function(err) {
    console.log(err);
    alarm.change_table(err);
  });
}

module.exports = {
  start_momitor : start_momitor,
  stop_monitor : stop_monitor,
  check_serena : check_serena
}
