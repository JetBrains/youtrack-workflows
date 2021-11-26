/**
 * This is a template for an on-change rule. This rule defines what
 * happens when a change is applied to an issue.
 *
 * For details, read the Quick Start Guide:
 * https://www.jetbrains.com/help/youtrack/incloud/2020.3/Quick-Start-Guide-Workflows-JS.html
 */

var entities = require('@jetbrains/youtrack-scripting-api/entities');
var workflow = require('@jetbrains/youtrack-scripting-api/workflow');
var utils = require('./utils');
 
exports.rule = entities.Issue.onChange({
  title: 'Populate-test-run',
  guard: function(ctx) {
    var issue = ctx.issue;
    return !issue.isChanged('project') && issue.Type && (issue.Type.name == ctx.Type.TestRun.name) && issue.links[ctx.Execution.outward].added.isNotEmpty() && issue.isReported;
  },
  action: function(ctx) {
    var issue = ctx.issue;
    var totalTestRuns = issue.links[ctx.Execution.outward].added.size;
    issue.links[ctx.Execution.outward].added.forEach(function(TestCase) {
      var message = '<a href="' + TestCase.url + '"> ' + TestCase.id + '</a>';
      workflow.check((TestCase.Type.name == ctx.Type.TestCase.name) || (TestCase.Type.name == ctx.Type.TestSuite.name), workflow.i18n('\'Test Run\' can be linked to \'Test Case\' and \'Test Suite\' only, but {0} has \'{1}\' type!', message, TestCase.Type.name));
      TestCase.links[ctx.Execution.inward].delete(issue);

      if (TestCase.Type.name == ctx.Type.TestSuite.name) {
        var linkedTestCases = TestCase.links[ctx.Subtask.outward]
        linkedTestCases.forEach(function(testCase) {
          utils.createTestCaseRun(testCase, issue, ctx);
        });
      } else {
        utils.createTestCaseRun(TestCase, issue, ctx);
      }

    issue.fields['Total number of test cases'] = totalTestRuns;
  },
  requirements: {
    Execution: {
      type: entities.IssueLinkPrototype,
      name: 'Execution',
      inward: 'Execution',
      outward: 'Assigned test case or test suite'
    },
    Subtask: {
      type: entities.IssueLinkPrototype,
      name: 'Subtask',
      inward: 'parent for',
      outward: 'subtask of'
    },
    Type: {
      type: entities.EnumField.fieldType,
      TestExecution: {
        name: "Test Case Execution"
      },
      TestRun: {
        name: "Test Run"
      },
      TestCase: {
        name: "Test Case"
      },
      TestSuite: {
        name: "Test Suite"
      }
    },
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
        name: 'In Progress'
      },
      Passed: {
        name: 'Passed'
      },
      Failed: {
        name: 'Failed'
      },
      NoRun: {
        name: 'No Run'
      },
    },
  }
});
