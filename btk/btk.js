var screenshot = require('desktop-screenshot');
var resemble = require('node-resemble-js');
var fs =  require('fs');
var gm = require('gm');
var exec = require('child_process').execFile;
var kl_id;
var nas_id;
var nas_stop_id;
var bak_id;

mon_bak();
// mon_kl();
// mon_nas();
//Мониторинг насоса
function mon_kl(){
  screensot(function () {
    crop_shu(function () {
      diff_kl(function (stat) {
        console.log(stat);
        //если разница есть
        if (stat == true) {
          console.log('we run macsos napolnenie basseina');
          clearTimeout(kl_id);
          run_btk();
        }
        //если нет разницы
        else {
          console.log('povtor klapan');
          kl_id = setTimeout(mon_kl, 10000);
        }
      });
    });
  });
}
//Мониторинг насоса
function mon_nas() {
  screensot(function () {
    crop_nas(function () {
      diff_nas(function (stat) {
        //если разницы нет значит насос остановился и мы можем начать мониторить пока он закрутится чтобы остановить его
        if (stat == false) {
          clearTimeout(nas_id);
          // run_bak();
          mon_nas_stop();
        }
        //если разница есть значит мотор крутится
        else {
          console.log('povtor nasos poka ostanovitsya');
          nas_id = setTimeout(mon_nas, 10000);
        }
      });
    });
  });
}
//Мониторинг бака
function mon_bak() {
  screensot(function () {
    crop_bak(function () {
      diff_bak(function (stat) {
        //если разницы нет значит насос остановился и мы можем начать мониторить пока он закрутится чтобы остановить его
        if (stat == true) {
          clearTimeout(bak_id);
          run_bak();
        }
        //если разница есть значит мотор крутится
        else {
          console.log('povtor bak');
          bak_id = setTimeout(mon_bak, 10000);
        }
      });
    });
  });
}
//Мониторинг насоса stop
function mon_nas_stop() {
  screensot(function () {
    crop_nas(function () {
      diff_nas(function (stat) {
        //если разница есть значит мотор крутится и нужно его остановить
        if (stat == true) {
          clearTimeout(nas_stop_id);
          run_bak();
        }
        //если разницы нет значит мотор стоит и мы не можем его выключить
        else {
          console.log('povtor nasos poka zapustitsya');
          nas_stop_id = setTimeout(mon_nas_stop, 10000);
        }
      });
    });
  });
}
//Наполнение бассейна
function run_btk() {
  var btk = __dirname + '\\btk.bat';
  console.log('run macros BTK');
  exec(btk, function(err) {
    console.log(err);
    console.log('We run mon_nas');
    setTimeout(mon_bak, 20000);
  });

}
//Наполнение бака
function run_bak() {
  var bak = __dirname + '\\bak.bat';
  console.log('run macros BAK');
  exec(bak, function(err) {
      console.log(err);
      console.log('We run mon_kl');
      setTimeout(mon_kl, 20000);
    });

}
//Создание скриншота
function screensot(cb) {
  screenshot("screenshot.png", function(error, complete) {
    if(error)
      console.log("Screenshot failed", error);
    else
      console.log("Screenshot succeeded");
      cb();
  });
}
//Функция вырезания части экрана для ШУ
function crop_shu(cb) {
  gm('./screenshot.png')
  .crop(30, 27, 165, 553)
  .write('./kl.png', function (err) {
    if (!err) {
      console.log('Cropped klapan');
      cb();
    }
    if (err) console.log('false');
  });
}
//Функция вырезания части экрана для ШУ
function crop_nas(cb) {
  gm('./screenshot.png')
  .crop(45, 70, 447, 629)
  .write('./nas.png', function (err) {
    if (!err) {
      console.log('Cropped nasos');
      cb();
    }
    if (err) console.log('false');
  });
}
//Функция вырезания части экрана для ШУ
function crop_bak(cb) {
  gm('./screenshot.png')
  .crop(120, 120, 150, 650)
  .write('./bak.png', function (err) {
    if (!err) {
      console.log('Cropped bak');
      cb();
    }
    if (err) console.log('false');
  });
}
//Проверяем на наличие разницы между изображениями PLC
function diff_kl(cb) {
  resemble('./kl.png').compareTo('./kl_et.png').ignoreColors().onComplete(function(data){
    if (data.misMatchPercentage == 0) {
      console.log('Here ISNT diff');
      cb(false);
    }
    else {
      console.log('Here IS diff');
      console.log('diff = ' + data.misMatchPercentage);
      cb(true);
    }
  });
}
//Проверяем на наличие разницы между изображениями PLC
function diff_nas(cb) {
  resemble('./nas.png').compareTo('./nas_et.png').ignoreColors().onComplete(function(data){
    if (data.misMatchPercentage == 0) {
      console.log('Here ISNT diff');
      cb(false);
    }
    else {
      console.log('Here IS diff');
      console.log('diff = ' + data.misMatchPercentage);
      cb(true);
    }
  });
}
//Проверяем на наличие разницы между изображениями PLC
function diff_bak(cb) {
  resemble('./bak.png').compareTo('./bak_et.png').ignoreColors().onComplete(function(data){
    if (data.misMatchPercentage == 0) {
      console.log('Here ISNT diff');
      cb(false);
    }
    else {
      console.log('Here IS diff');
      console.log('diff = ' + data.misMatchPercentage);
      cb(true);
    }
  });
}
