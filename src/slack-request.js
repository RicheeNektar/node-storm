const fetch = require('node-fetch');

module.exports = (endpoint, token, args) => {
  return fetch(`https://slack.com/api/${endpoint}`, {
    method: 'post',
    body: JSON.stringify(args),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
  }).then(response => response.json())
    .catch(err => console.log(err));
}
