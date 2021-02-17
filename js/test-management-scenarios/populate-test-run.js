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
    var testRun = ctx.issue;
  
    testRun.links[ctx.Execution.outward].added.forEach(function (testCase) {

      if (testCase.Type.name == ctx.Type.TestCase.name) {
        utils.createTestCaseExecution(workflow, ctx, testRun, testCase);       
      }
      else { // We are a Test Suite so clone any subtasks that are Test Cases
        testCase.links[ctx.Subtask.outward].forEach(function (subTestCase) {
          utils.createTestCaseExecution(workflow, ctx, testRun, subTestCase);     
       });
        
        testCase.links[ctx.Execution.inward].delete(testRun);
      }
    });
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