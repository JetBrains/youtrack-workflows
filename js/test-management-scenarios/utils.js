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
exports.createTestCaseRun = function(testCase, testRun, ctx) {
  // New issue creation
  var testCaseRun = testCase.copy();

  testCaseRun.Type = ctx.Type.TestExecution.name;
  testCaseRun.Status = ctx.Status.NoRun.name;

  // Remove all links from Test Case Execution
  Object.keys(testCaseRun.links).forEach(function(linkType) {
    if (!testCaseRun.links[linkType])
      return;
    testCaseRun.links[linkType].clear();
  });
  testCaseRun.summary = "[TEST_CASE_EXECUTION" + "] [" + testCaseRun.summary + "]";

  // Links population
  testCaseRun.links[ctx.Subtask.inward].add(testRun);
  testRun.links[ctx.Subtask.outward].add(testCaseRun);
  testCaseRun.links[ctx.Execution.outward].add(testCase);
};
