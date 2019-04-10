var entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onChange({
  title: 'Counter',
  guard: function(ctx) {
    return ctx.issue.isReported;
  },
  action: function(ctx) {
    // Retrieve data
    ctx.db.applyCommand('visible to All Users', ctx.db.reporter);
    var data = ctx.db.description;
    var map = JSON.parse(data);
    if (!map) {
      map = {};
    }

    // Do stuff
    console.log(map);
    var month = new Date().getMonth();
    if (!map[month]) {
      map[month] = {};
    }
    console.log(map[month]);
    var login = ctx.currentUser.login;
    if (map[month][login] || map[month][login] === 0) {
      map[month][login] += 1;
    } else {
      map[month][login] = 0;
    }
    console.log(map[month][login]);

    // Save data
    ctx.db.description = JSON.stringify(map, null, '  ');
    ctx.db.applyCommand('visible to ' + ctx.db.reporter.login, ctx.db.reporter);
  },
  requirements: {
    db: {
      type: entities.Issue,
      id: 'WS-279'
    }
  }
});
