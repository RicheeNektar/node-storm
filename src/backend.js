const http = require('http');
const events = require('./events/index.js');
const crypto = require('crypto');

const calcHash = (req, data) => {
  const hmac = crypto.createHmac('sha256', process.env.SLACK_KEY);
  const timestamp = req.headers['x-slack-request-timestamp'];

  hmac.update(Buffer.from(`v0:${timestamp}:${data}`));
  
  return `v0=${hmac.digest('hex')}`;
};

module.exports = () => {
  http
    .createServer((req, res) => {
      req.on('data', (data) => {
        data = data.toString();

        if (calcHash(req, data) === req.headers['x-slack-signature']) {
          const json = JSON.parse(data);
          const type = json.type;
          let response;

          if (type === 'url_verification') {
            response = {
              challenge: json.challenge,
            };
          } else if (type === 'event_callback') {
            const event = json.event;
            const handler = events[event.type]

            if (handler) {
              handler(json);
            } else {
              console.log('unknown event: ' + event.type);
            }
          } else {
            console.log('unknown type: ' + type);
          }

          if (response) {
            res.writeHead(200, {
              'Content-Type': 'application/json;charset=utf-8'
            });
            res.write(JSON.stringify(response));
          } else {
            res.writeHead(204);
          }
        } else {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.write('Success!.. Not really');
        }

        res.end();
      });
    })
    .listen(6969);
};
