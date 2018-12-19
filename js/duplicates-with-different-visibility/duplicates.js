var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');

exports.rule = entities.Issue.onChange({
  title: 'Prohibit duplicates with different visibility',
  guard: function(ctx) {
    return ctx.issue.links['duplicates'].added.isNotEmpty();
  },
  action: function(ctx) {
    var issue = ctx.issue;
    var isSameGroup = function(group1, group2) {
      if (!group1) {
        return !group2;
      }
      if (!group2) {
        return false;
      }
      return group1.name === group2.name;
    };
    issue.links['duplicates'].added.forEach(function(duplicate) {
      workflow.check(isSameGroup(issue.permittedGroup, duplicate.permittedGroup),
        'You can\'t link issues with different visibility restrictions ' +
        'as duplicates. To add these links, update the visibility settings ' +
        'for either ' + issue.id + ' or ' + duplicate.id);
    });
  }
});