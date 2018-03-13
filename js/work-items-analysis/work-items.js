var search = require('@jetbrains/youtrack-scripting-api/search');
var dates = require('@jetbrains/youtrack-scripting-api/date-time');

function formatter(timestamp) {
  return dates.format(timestamp, 'yyyy-MM-dd');
}

/**
 * @param {User} [author] work items author
 * @param {Project} [project] project to get issue from
 * @param {Number} [from] starting date in ms from the epoch start
 * @param {Number} [to] ending date in ms from the epoch start
 * @return {[WorkItem]} list of work items matching the parameters
 */
var fetchWorkItems = function(author, project, from, to) {
  // Generate a search string to find issues,
  // where at least one work item was added by `author` between `from` and `to`:
  var searchQuery = 'work author: ' + author.login + ' ';
  searchQuery += 'work date: ' + formatter(from) + ' .. ' + formatter(to);
  
  // Now we can traverse over these issues in a `project`
  // and choose the work items we need:
  var items = [];
  var issues = search.search(project, searchQuery);
  issues.forEach(function(issue) {
    issue.workItems.forEach(function(item) {
      if (item.author.login === author.login &&
        item.date >= from && item.date <= to) {
        items.push(item);
      }
    })
  });
  
  // Return the array:
  return items;
};

exports.fetchWorkItems = fetchWorkItems;