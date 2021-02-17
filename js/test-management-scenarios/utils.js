exports.calculateStatuses = function(parent) {
  var totalTR = 0;
  var totalFailed = 0;
  var totalPassed = 0;
  if (!parent.links['parent for']) {
    return; 
  } else {
    parent.links['parent for'].forEach(function(tr) {
      totalTR++;
      if (tr.Status.name == 'Passed') {
        totalPassed++;
      }
      if (tr.Status.name == 'Failed') {
        totalFailed++;
      }
    });
    parent.fields['Total number of test cases'] = totalTR;
    parent.fields['Number of passed test cases'] = totalPassed;
    parent.fields['Number of failed test cases'] = totalFailed;
    return true;
  }
};
exports.resetStatuses = function(testRun, testRunCopy) {
   testRunCopy.fields['Total number of test cases'] = testRun.fields['Total number of test cases'];
   testRunCopy.fields['Number of passed test cases'] = 0;
   testRunCopy.fields['Number of failed test cases'] = 0;
  return true; 
};

// Create a test case execution.
exports.createTestCaseExecution = function(workflow, ctx, testRun, testCase) {
  var message = '<a href="' + testCase.url + '"> ' + testCase.id + '</a>';
  workflow.check((testCase.Type.name == ctx.Type.TestCase.name) || (testCase.Type.name == ctx.Type.TestSuite.name), workflow.i18n('\'Test Run\' can be linked to \'Test Case\' and \'Test Suite\' only, but {0} has \'{1}\' type!', message, testCase.Type.name));
  testCase.links[ctx.Execution.inward].delete(testRun);

  // New issue creation 
  var testCaseExecution = testCase.copy();
  testCaseExecution.Type = ctx.Type.TestExecution.name;
  testCaseExecution.Status = ctx.Status.NoRun.name;

  // Remove all links from Test Case Execution       
  Object.keys(testCaseExecution.links).forEach(function(linkType) {
    if (!testCaseExecution.links[linkType])
      return;
    testCaseExecution.links[linkType].clear();
  });
  testCaseExecution.summary = "[TEST_CASE_EXECUTION" + "] [" + testCaseExecution.summary + "]";

  // Links population 
  testCaseExecution.links[ctx.Subtask.inward].add(testRun);
  testRun.links[ctx.Subtask.outward].add(testCaseExecution);
  testCaseExecution.links[ctx.Execution.outward].add(testCase);
};