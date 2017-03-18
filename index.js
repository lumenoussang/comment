const Monitor = require('monitor');
const request = require('request')
const LOW_MEMORY_THRESHOLD = 100000000;
const token = 'ZOEF0kIkwihPvsuBYOcDssyIWcYwsQ54sfOAxiR50XE';

var options = {
  probeClass: 'Process',
  initParams: {
    pollInterval: 10000
  }
}
var processMonitor = new Monitor(options);

processMonitor.on('change', () => {
  var freemem = processMonitor.get('freemem');
  var msg = "Your Free memory Left "+freemem;
  if (freemem < LOW_MEMORY_THRESHOLD) {
    var msg = 'Low memory warning: ' + freemem;
    request({
         method: 'POST',
         uri: 'https://notify-api.line.me/api/notify',
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
         },
         'auth': {
           'bearer': token
         },form: {
           message: msg,
         }
    }, function(err,httpResponse,body){
         console.log(JSON.stringify(err));
    })
  }
});

processMonitor.connect((error) => {
  if (error) {
    console.error('Error connecting with the process probe: ', error);
    process.exit(1);
  }
});
