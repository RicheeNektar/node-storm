module.exports = {
  days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  teams: [
    {
      token: 'eG94Yi04MzE4NTY0OTcxMTEtODM2MTkzNjA4ODM5LU8xdjNQWGQybE9odzdmWmliclBtZXVlbg==',
      team: 'TQFR6EM39',
      channel: 'C01K3TXL88Y',
      time: {
        hour: 11,
        minute: 30,
      },
    },
  ].map(team => ({...team, token: Buffer.from(team.token, 'base64').toString()})),
};
