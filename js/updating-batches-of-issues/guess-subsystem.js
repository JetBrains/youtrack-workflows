var entities = require('@jetbrains/youtrack-scripting-api/entities');
var search = require('@jetbrains/youtrack-scripting-api/search');

var guessSubsystem = function(ctx, issue) {
  var summary = issue.summary.toLowerCase();
  var value = null;
  
  if (summary.includes('welcom') || summary.includes('landing')) {
    value = ctx.Subsystem.Landing;
  } else if (summary.includes('product') || summary.includes('catalogue')) {
    value = ctx.Subsystem.Catalogue;
  } else if (summary.includes('profile')) {
    value = ctx.Subsystem.Profile;
  } else if (summary.includes('cart')) {
    value = ctx.Subsystem.Cart;
  }
  
  issue.fields[ctx.Subsystem.name] = value;
};

exports.rule = entities.Issue.onSchedule({
  title: 'Guess Subsystem from summary',
  cron: '0 * * * * ?',
  search: '#WS-1',
  muteUpdateNotifications: true,
  action: function(ctx) {
    var searchQuery = 'has:-Subsystem sort by: {issue id} asc';
    var issues = search.search(ctx.issue.project, searchQuery);
    var entries = issues.entries();
    var i = entries.next();
    var n = 0;
    var firstIssueId = i.done ? '' : i.value.id;
    
    while (n < 100 && !i.done) {
      var issue = i.value;
      guessSubsystem(ctx, issue);
      n += 1;
      i = entries.next();
    }
    
    var name = ctx.issue.project.name + ' : Set Subsystem from summary : ';
    if (n) {
      console.log(name + n + ' issues are processed, starting with ' + firstIssueId);
    } else {
      console.log(name + 'no issues are processed, as nothing is left to process');
    }
  },
  requirements:   {
    Subsystem: {
      type: entities.OwnedField.fieldType,
      Landing: {},
      Catalogue: {},
      Profile: {},
      Cart: {}
    }
  }
});
