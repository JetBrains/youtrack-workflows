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