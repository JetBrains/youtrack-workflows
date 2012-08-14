Additional Notifications 
====================

Notify the previous assignee when issue is reassigned.

Notify the previous issue assignee
```java
rule Notify on issue reassign
when isReported() && Assignee.changed {
  var oldAssignee = Assignee.oldValue;
  var newAssignee = Assignee.login;
  if (newAssignee == null) {
    newAssignee = "nobody";
  }
  if (oldAssignee != null) {
    oldAssignee.notify("[YouTrack, Reassigned] Issue " + getId() + ": " + summary,
         "Issue " + "<a href="" + issue.getUrl() + "">" + issue.getId() + "</a>
was reassigned from you to " + newAssignee);
  }
}
```
