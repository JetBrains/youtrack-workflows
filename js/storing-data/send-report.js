var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onSchedule({
  title: 'Reporter',
  search: '#WS-279',
  cron: '0 0 18 LW * ?',
  action: function(ctx) {
    var data = ctx.issue.description;
    var map = JSON.parse(data);
    if (!map) {
      map = {};
    }
    var month = new Date().getMonth();
    var report = '';
    if (!map[month]) {
      report = 'No changes were made in previous month.';
    } else {
      var max = 0;
      for (var login in map[month]) {
        var line = 'User ' + login + ' made ' + map[month][login] + ' changes.\n';
        report += line;
        max = Math.max(max, map[month][login]);
      }
      var winners = [];
      for (login in map[month]) {
        if (map[month][login] === max) {
          winners.push(login);
        }
      }
      var winnerLine = winners.length === 1 ? 'The winner is ' + login + '.\n' :
        'The winners are ' + winners.join(', ') + '.\n';
      report += winnerLine;
    }
    ctx.issue.project.leader.notify('Activity report', report);
  }
});
