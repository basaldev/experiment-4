document.addEventListener("DOMContentLoaded", function(event) {
  var socket = io();
  var moment = 0.1;
  var prev = {};
  
  AFRAME.registerComponent('collider-check', {
    dependencies: ['raycaster'],
    init: function () {
      this.el.addEventListener('raycaster-intersection', function () {
        console.log('hit!')
      });
      this.el.addEventListener('raycaster-intersection-cleared', function () {
        console.log('left!')
      });
    }
  });

  function main(channel, remote) {
    // console.log(channel)
    $hand = document.getElementById(channel);
    var current = $hand.getAttribute('position');
    if (typeof prev[channel] === 'undefined') {
      prev[channel] = remote;
      return;
    }
    var next = {
      x: current.x + (remote.x - prev[channel].x) * moment,
      y: current.y + (remote.y - prev[channel].y) * moment,
      z: current.z + (remote.z - prev[channel].z) * moment
    };
    // console.log(current.y, remote.y - prev.y)
    prev[channel] = remote;
    $hand.setAttribute('position', next);
  }
  
  socket.on('connect', function() {
    console.log('connected')
    socket.on('main', function(channel, remote) {
      // var remote = { x: 0, y:0, z:0 }
      main(channel, remote);
    });
  });
});