document.addEventListener("DOMContentLoaded", function(event) {
  var socket = io();
  var params = location.search.slice(1).split('&').map(function(p) { return p.split('='); });
  var channel = (params.length > 0 && params[0] && params[0][0] !== '')
    ? params.find(function(e) { return e[0] === 'channel' })[1]
    : '';
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
  var $rig = document.getElementById('rig');
  var $camera = document.getElementById('camera');
  var $cursor = document.getElementById('cursor');
  var $left = document.getElementById('left');
  var $right = document.getElementById('right');
  var $message = document.getElementById('message');
  var $reload = document.getElementById('reload');
  var leftInitPosition = $left.getAttribute('position').split(' ');
  var leftInitotation = $left.getAttribute('rotation').split(' ');
  var rightInitPosition = $right.getAttribute('position').split(' ');
  var rightInitotation = $right.getAttribute('rotation').split(' ');
  var initPosition = [
    { x: leftInitPosition[0], y: leftInitPosition[1], z: leftInitPosition[2] },
    { x: rightInitPosition[0], y: rightInitPosition[1], z: rightInitPosition[2] },
  ];
  var initRotation = [
    { x: leftInitotation[0], y: leftInitotation[1], z: leftInitotation[2] },
    { x: rightInitotation[0], y: rightInitotation[1], z: rightInitotation[2] },
  ];
  function transition() {
    if (step < messages.length - 1) {
      step++;
    } else {
      step = 0;
    }
    $message.setAttribute('value', messages[step]);
  }

  function reset() {
    // socket.emit('reload');
    prevPosition = {};
    prevRotation = {};
    step = 0;

    $left.setAttribute('position', initPosition[0]);
    $left.setAttribute('rotation', initRotation[0]);
    $right.setAttribute('position', initPosition[1]);
    $right.setAttribute('rotation', initRotation[1]);
    $message.setAttribute('value', 'Hold the affected area with left hand')
  }

  function main(channel, remote1, remote2) {
    var $hand = document.getElementById(channel);
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

  var sendCameraRotation = function() {};

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

  AFRAME.registerComponent('rotation-reader', {
    tick: function () {
      sendCameraRotation(this.el.object3D.rotation);
    }
  });

  if (channel !== 'vr') {
    $cursor.setAttribute('visible', false);
    $camera.setAttribute('look-controls', false);
  }

  socket.on('connect', function() {
    console.log('connected');

    socket.on('main', function(channel, remote1, remote2) {
      main(channel, remote1, remote2);
    });

    if (channel === 'vr') {
      socket.emit('vr-loaded', channel);
      sendCameraRotation = function(rotation) {
        socket.emit('camera-rotation', rotation);
      };
    } else {
      socket.on('monitor', function(rotation) {
        var moment = 50;
        $rig.setAttribute('rotation', { x: rotation._x * moment, y: rotation._y * moment, z: rotation._z * moment });
      });
    }

    $reload.addEventListener('click', function() {
      reset();
    });
  });
});