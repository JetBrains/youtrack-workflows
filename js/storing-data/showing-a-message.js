var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Congratulations!',
  guard: function(ctx) {
    return ctx.issue.isReported && !ctx.issue.becomesReported;
  },
  action: function(ctx) {
    // Retrieva data
    ctx.db.applyCommand('visible to All Users', ctx.db.reporter);
    var data = ctx.db.description;
    var map = JSON.parse(data);
    if (!map) {
      map = {};
    }

    // Do stuff
    if (!map[ctx.currentUser.login]) {
      workflow.message('<h1>Congratulations with amazing release!</h1>');
    }
    map[ctx.currentUser.login] = true;

    // Save data
    ctx.db.description = JSON.stringify(map, null, '  ');
    ctx.db.applyCommand('visible to ' + ctx.db.reporter.login, ctx.db.reporter);
  },
  requirements: {
    db: {
      type: entities.Issue,
      id: 'WS-280'
    }
  }
});
