/**
 * This is a template for an on-change rule. This rule defines what
 * happens when a change is applied to an issue.
 *
 * For details, read the Quick Start Guide:
 * https://www.jetbrains.com/help/youtrack/incloud/2020.3/Quick-Start-Guide-Workflows-JS.html
 */

var entities = require('@jetbrains/youtrack-scripting-api/entities'); 
var utils = require('./utils'); 

exports.rule = entities.Issue.onChange({
  title: 'Calculate TMS Statistics',
  guard: function(ctx) {
    var issue = ctx.issue;
    return issue.isChanged(ctx.Status) && (issue.isReported) && (issue.Type.name == ctx.Type.TestExecution.name);
  },
  action: function(ctx) {
    var issue = ctx.issue;
    if (!issue.links['subtask of'].isEmpty()) { 
      var parent = issue.links['subtask of'].first();
      utils.calculateStatuses(parent);
    } 
  },   
  requirements: {
    Total: {
      type: entities.Field.integerType,
      name: 'Total number of test cases'
    },
    TotalFailed: {
      type: entities.Field.integerType,
      name: 'Number of failed test cases'
    },
    TotalPassed: {
      type: entities.Field.integerType,
      name: 'Number of passed test cases'
    },
    Status: {
      type: entities.EnumField.fieldType,
      InProgress: {
        name: 'No Run' 
      },
      Passed: {
        name: 'Passed'
      },
      Failed: {
        name: 'Failed' 
      },
    },
    Type: {
      type: entities.EnumField.fieldType,
      TestExecution: {
        name: "Test Case Execution" 
      } 
    }, 
    Subtask: {
      type: entities.IssueLinkPrototype,
      name: 'Subtask',
      inward: 'subtask of',
      outward: 'parent for'
    },
  }
});