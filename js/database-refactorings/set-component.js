var entities = require('@jetbrains/youtrack-scripting-api/entities');
var search = require('@jetbrains/youtrack-scripting-api/search');

var TITLE = 'Set Component';
var SEARCH = 'has:-Component sort by: created asc';
var LIMIT = 100;
var CRON = '0 * * * * ?';
var ANCHOR = '#GD-1';

var process = function(ctx, issue) {
  var summary = issue.summary.toLowerCase();
  var fs = issue.fields;
  
  if (summary.includes('welcome') || summary.includes('landing')) {
    fs[ctx.Component.name] = ctx.Component.Landing;
  } else if (summary.includes('products') || summary.includes('goods')) {
    fs[ctx.Component.name] = ctx.Component.Products;
  } else if (summary.includes('cart')) {
    fs[ctx.Component.name] = ctx.Component.Cart;
  } else {
    fs[ctx.Component.name] = ctx.Component.Uncertain;
  }
};

var REQUIREMENTS = {
  Component: {
    type: entities.EnumField.fieldType,
    Landing: {},
    Products: {},
    Cart: {},
    Uncertain: {}
  }
};

exports.rule = entities.Issue.onSchedule({
  title: TITLE,
  cron: CRON,
  search: ANCHOR,
  muteUpdateNotifications: true,
  action: function(ctx) {
    var issues = search.search(ctx.issue.project, SEARCH);
    var entries = issues.entries();
    var i = entries.next();
    var n = 0;
    var firstIssueId = i.done ? '' : i.value.id;
    
    while (n < LIMIT && !i.done) {
      var issue = i.value;
      process(ctx, issue);
      n += 1;
      i = entries.next();
    }
    
    var name = ctx.issue.project.name + ' : ' + TITLE + ' : ';
    if (n) {
      console.log(name + n + ' issues are processed, starting with ' + firstIssueId);
    } else {
      console.log(name + 'no issues are processed, as nothing is left to process');
    }
  },
  requirements: REQUIREMENTS
});
