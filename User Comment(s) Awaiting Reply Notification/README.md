User Comment(s) Awaiting Reply Notification  
====================
If an issue has a recent non-developer comment, send a notification to a specific user (support team member). This check is performed at a given time (daily at 12pm by default).

>Requirements: group 'developers-team'

```java
schedule rule Notify on no comments during time period

daily at 12 : 00 : 00 [!issue.State.isResolved] {
  if (comments.last != null && !comments.last.author.isInGroup("developers-team")) {
    project.leader.notify("[Youtrack, Notifier] Issue " +
    getId() + " needs your attention",
    "Issue " + summary + " has a recent comment added by a non-developer.");
  }
}
```
