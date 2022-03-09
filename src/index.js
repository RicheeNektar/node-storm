const { teams } = require('./config');
const fetchMenu = require('./fetch-menu');
const formatMenu = require('./format-menu');
const slackApi = require('./slack-request');
const listen = require('./backend');

var lastFetch;
var menu;

exports.buildMenu = today => formatMenu(today, menu[today.getDay() - 1]);
exports.getTeamById = teamId => teams.find(team => team.team === teamId);

const monday = () => {
  const date = new Date(new Date().toISOString().slice(0, 10));
  const offset = date.getDay() === 0 ? -6 : 1;
  return date.getTime() - (date.getDay() - offset) * 86400000;
};

async function main() {
  if (menu === undefined || lastFetch !== monday()) {
    console.log('Fetching menu..')
    menu = await fetchMenu();
    lastFetch = monday();
    console.log('Fetched');
  }

  const today = new Date();
  const day = today.getDay();

  if (today.getSeconds() == 0) {
    if (day > 0 && day < 6)  {
      const daily = menu[day - 1];
      const blocks = formatMenu(today, daily);

      teams.forEach(team => {
          const hour = today.getHours();
          const minute = today.getMinutes();

          if (hour === team.time.hour && minute === team.time.minute) {
            console.log('Posting at ' + team.team);

            slackApi('chat.postMessage', team.token, {
              channel: team.channel,
              blocks
            });
        }
      });
    }
  }
};

console.log('Joining convos..');

teams.forEach(team => {
  slackApi('conversations.join', team.token, {
    channel: team.channel,
  });
});

console.log('Starting timer');
setInterval(main, 1000);

console.log('Listening on Requests');
listen();
