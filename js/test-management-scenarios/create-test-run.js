var workflow = require('@jetbrains/youtrack-scripting-api/workflow');
var entities = require('@jetbrains/youtrack-scripting-api/entities');
var utils = require('./utils');
 
exports.rule = entities.Issue.action({ 
  title: 'Create Test Run copy',
  command: 'Test Run Creation',
  guard: function(ctx) {
    return ctx.issue.isReported && (ctx.issue.Type.name == ctx.Type.TestRun.name); 
  },
  action: function(ctx) {
    var issue = ctx.issue;
    var TestRunCopy = issue.copy(issue.project); 
    TestRunCopy.Status = ctx.Status.InProgress; 
    var oldTestList = issue.links[ctx.Subtask.outward];
    oldTestList.forEach(function(v) {
      var newTest = v.copy(v.project);
      newTest.Status = ctx.Status.InProgress;
      newTest.links[ctx.Subtask.inward].delete(issue);
      newTest.links[ctx.Subtask.inward].add(TestRunCopy);
    });
    utils.resetStatuses(issue, TestRunCopy); 
    var newTestRunLink = '<a href="' + TestRunCopy.url + '"> ' + TestRunCopy.id + '</a>';
    var message = 'New Test Run has been created ' + newTestRunLink + '.';
    workflow.message(message);
  },
  requirements: {
    Execution: {
      type: entities.IssueLinkPrototype,
      name: 'Execution',
      inward: 'Execution',
      outward: 'Assigned Test case or test suite'
    },
    Subtask: {
      type: entities.IssueLinkPrototype,
      name: 'Subtask',
      inward: 'subtask of',
      outward: 'parent for'
    },
    Type: {
      type: entities.EnumField.fieldType,
      TestRun: {
        name: "Test Run"
      },
    },
    Status: {
      type: entities.EnumField.fieldType,
      InProgress: {
        name: 'No Run'
      },
    }
  }
});