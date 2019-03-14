function main(socket) {
  var channel = 'left';

  function handleOrientation(event) {
    var $console = document.getElementById('console1'); 
    var alpha = event.alpha > 180 ? -(event.alpha - 360) : -event.alpha;
    var beta = event.beta;
    var gamma = -event.gamma;
    $console.innerHTML = `
      channel: ${channel}<br>
      alpha: ${alpha}<br>
      beta: ${beta}<br>
      gamma: ${gamma}<br>
    `;
    socket.emit('remote', channel, { x:alpha, y:gamma, z:beta });
  }

  $reload = document.getElementById('reload');
  $left = document.getElementById('left');
  $right = document.getElementById('right');

  $reload.addEventListener('click', function() {
    location.reload();
  });
  $left.addEventListener('click', function() {
    $active = document.querySelector('.active');
    $active.classList.remove('active');
    $left.classList.add('active');
    channel = 'left';
  });
  $right.addEventListener('click', function() {
    $active = document.querySelector('.active');
    $active.classList.remove('active');
    $right.classList.add('active');
    channel = 'right';
  });
  window.addEventListener("deviceorientation", handleOrientation, true);
}

var socket = io();

socket.on('connect', function() {
  main(socket);
});
