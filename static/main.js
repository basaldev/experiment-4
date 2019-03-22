var isMobile = /Mobile/.test(navigator.userAgent);

Array.from(document.querySelectorAll(isMobile ? '.desktop' : '.mobile'))
  .forEach(function(el) {
    el.style.display = 'none';
  });

var $vrUrl = document.getElementById('vrUrl');
var vrUrl = location.href + $vrUrl.innerText;
$vrUrl.innerText = vrUrl;
new QRCode(document.getElementById('vrQr'), { text: vrUrl, width: 200, height: 200, correctLevel : QRCode.CorrectLevel.H });

var $leftUrl = document.getElementById('leftUrl');
var leftUrl = location.href + $leftUrl.innerText;
$leftUrl.innerText = leftUrl;
new QRCode(document.getElementById('leftQr'), { text: leftUrl, width: 200, height: 200, correctLevel : QRCode.CorrectLevel.H });

var $rightUrl = document.getElementById('rightUrl');
var rightUrl = location.href + $rightUrl.innerText;
$rightUrl.innerText = rightUrl;
new QRCode(document.getElementById('rightQr'), { text: rightUrl, width: 200, height: 200, correctLevel : QRCode.CorrectLevel.H });

var socket = io();
var state = isMobile
  ? {
    left: false,
    right: false
  }
  : {
    vr: false,
    left: false,
    right: false
  };

socket.on('connect', function() {
  socket.on('device-ready', function(channel) {
    var $state = document.getElementById(channel + 'State');
    $state.innerHTML =
      'Ready <br>' +
      '<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">' +
      '<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />' +
      '<path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />' +
      '</svg>';
    $state.classList.remove('error');
    $state.classList.add('success');
    state[channel] = true;
    if (!Object.values(state).includes(false)) {
      location.href = isMobile ? 'main?channel=vr' : 'main';
    }
  });
});