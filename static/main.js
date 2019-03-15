var $vrUrl = document.getElementById('vrUrl');
var vrUrl = location.href + $vrUrl.innerText;
$vrUrl.innerText = vrUrl;
new QRCode(document.getElementById('vrQr'), vrUrl);

var $leftUrl = document.getElementById('leftUrl');
var leftUrl = location.href + $leftUrl.innerText;
$leftUrl.innerText = leftUrl;
new QRCode(document.getElementById('leftQr'), leftUrl);

var $rightUrl = document.getElementById('rightUrl');
var rightUrl = location.href + $rightUrl.innerText;
$rightUrl.innerText = rightUrl;
new QRCode(document.getElementById('rightQr'), rightUrl);

var socket = io();
var state = {
  vr: false,
  left: false,
  right: false
};

socket.on('connect', function() {
  socket.on('device-ready', function(channel) {
    var $state = document.getElementById(channel + 'State');
    $state.innerText = 'Ready';
    $state.classList.remove('error');
    $state.classList.add('success');
    state[channel] = true;
    if (!Object.values(state).includes(false)) {
      location.href = 'main';
    }
  });
});