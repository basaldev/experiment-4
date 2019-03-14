document.addEventListener("DOMContentLoaded", function(event) {
  var socket = io();
  var positionMoment = 0.1;
  var rotationMoment = -3;
  var prevPosition = {};
  var prevRotation = {};
  var step = 0;
  var targets = [
    'left',
    'right'
  ];
  var messages = [
    'Hold the affected area with left hand.',
    'Put the scalpel to the affected area with right hand.',
    'You passed this test!'
  ];

  function transition() {
    if (step < messages.length - 1) {
      step++;
    } else {
      step = 0;
    }
    var $message = document.getElementById('message');
    $message.setAttribute('value', messages[step]);
  }

  function reset() {
    // socket.emit('reload');
    prev = {};
    step = 0;
    $left = document.getElementById('left');
    $right = document.getElementById('right');
    $message = document.getElementById('message');
    $left.setAttribute('rotation', {x: 7.56, y: -10.53, z: 90 });
    $left.setAttribute('position', {x: -1.05413, y: 0.04497, z: -2.42308});
    $right.setAttribute('rotation', {x: 7.56, y: -8.21, z: 90 });
    $right.setAttribute('position', {x: 0.86416, y: -0.00792, z: -2.41991});
    $message.setAttribute('value', 'Hold the affected area with left hand')
  }

  function main(channel, remote1, remote2) {
    $hand = document.getElementById(channel);
    var position = $hand.getAttribute('position');
    var rotation = $hand.getAttribute('rotation');
    if (typeof prevPosition[channel] === 'undefined' || typeof prevRotation[channel] === 'undefined') {
      prevPosition[channel] = remote1;
      prevRotation[channel] = remote2;
      return;
    }
    var nextPosition = {
      x: position.x + (remote1.x - prevPosition[channel].x) * positionMoment,
      y: position.y + (remote1.y - prevPosition[channel].y) * positionMoment,
      z: position.z + (remote1.z - prevPosition[channel].z) * positionMoment
    };
    var nextRotation = {
      x: rotation.x + (remote2.x - prevRotation[channel].x) * rotationMoment,
      y: rotation.y + (remote2.y - prevRotation[channel].y) * rotationMoment,
      z: rotation.z + (remote2.z - prevRotation[channel].z) * rotationMoment
    };
    prevPosition[channel] = remote1;
    prevRotation[channel] = remote2;
    $hand.setAttribute('position', nextPosition);
    // $hand.setAttribute('rotation', { x: nextRotation.x, y: rotation.y, z: rotation.z });
  }

  AFRAME.registerComponent('collider-check', {
    dependencies: ['raycaster'],
    init: function () {
      this.el.addEventListener('raycaster-intersection', function(e) {
        if (targets[step] && targets[step] === e.target.id) {
          transition(e.target);
        }
      });
    }
  });

  socket.on('connect', function() {
    console.log('connected');

    socket.on('main', function(channel, remote1, remote2) {
      main(channel, remote1, remote2);
    });

    var $reload = document.getElementById('reload');
    $reload.addEventListener('click', function() {
      reset();
    });
  });
});