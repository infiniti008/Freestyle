// var fs = require('fs');
// var tes = require('./test.json');
// tes.rt = 'dsf';
// console.log(tes);
// fs.writeFile('./test.json', JSON.stringify(tes), function () {
//   console.log('succ');
// });

// function key() {
//   window.addEventListener('keydown', function(e) {
//     document.getElementById('inp').value = 'screen: ' + e.screenX + 'x' + e.screenY;
//   }, false);
// }


function key() {
  window.addEventListener('keydown', function(e) {
    document.getElementById('inp').value = screen.getCursorScreenPoint();
  }, false);
}



const electron = require('electron');
const {ipcRenderer} = require('electron');

function asd(){
  console.log(electron.screen.getCursorScreenPoint());
  ipcRenderer.send('on', 'data');
}
