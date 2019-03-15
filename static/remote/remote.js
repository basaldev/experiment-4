var socket = io();
var params = location.search.slice(1).split('&').map(function(p) { return p.split('='); });
var channel = (params.length > 0 && params[0] && params[0][0] !== '')
  ? params.find(function(e) { return e[0] === 'channel' })[1]
  : 'left';

var $title = document.querySelector('title');
var $heading = document.querySelector('h1');
var $console = document.getElementById('console'); 
var $reset= document.getElementById('reset');
$title.innerText = channel + ' controller';
$heading.innerText = channel + ' controller';
$reset.addEventListener('click', function() {
  location.reload();
});

function main(socket) {
  function handleOrientation(event) {
    var alpha = event.alpha > 270 ? -(event.alpha - 360) : -event.alpha;
    var beta = event.beta;
    var gamma = -event.gamma;
    $console.innerHTML = `
      channel: ${channel}<br>
      alpha: ${alpha}<br>
      beta: ${beta}<br>
      gamma: ${gamma}<br>
    `;
    socket.emit('remote', channel, { x: alpha, y: beta, z: gamma }, { x: alpha, y: beta, z: gamma });
  }

  window.addEventListener("deviceorientation", handleOrientation, true);
}

socket.on('connect', function() {
  main(socket);

  socket.emit('controller-loaded', channel);

  socket.on('reload', function() {
    location.reload();
  });
});
