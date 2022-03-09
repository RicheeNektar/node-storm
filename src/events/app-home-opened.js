const index = require('../index');
const slackApi = require('../slack-request');

module.exports = json => {
  const team = index.getTeamById(json.team_id);

  slackApi('views.publish', team.token, {
    user_id: json.event.user,
    view: {
      type: 'home',
      blocks: index.buildMenu(new Date()),
    }
  });
};
