'On Duty' Management
====================
Manage duties. Requires a separate project to store duties. Duty is stored in the 'Assignee' field. The chain of duties is implemented as linked by 'is required for' link issues.

>Requirements:
>    states: 'On duty', 'Active', 'On a rest'
>    new field 'day of week' of type 'integer'

Set today's person-on-duty based on 'is required for' link
```java
schedule rule Set Today's Duty Based on is required for

daily at 10 : 00 : 00 [issue.State == {On duty} && issue.Day of week != 5 && issue.Day of week != 6] {
  if (updated + 10 seconds < now) {
    // set new duty
    var nextDuty = is required for.first;
    var stop = 0;

    if (nextDuty == null || nextDuty.Assignee == null) {
      project.leader.notify("Duty",
        "Duties chain should be implemented via 'is required for' links, and 'Duty' store field must be non-empty.",
        true);
    }

    while (stop != -1 && stop < 50) {
      if (nextDuty.State == {Active}) {
        nextDuty.Day of week = Day of week;
        nextDuty.State = {On duty};

        Assignee.notify("Duty: You are no longer on duty", Assignee.fullName + ", "
                        + " you just came off duty.<br><br>The new person on duty is "
                        + nextDuty.Assignee.fullName + ".", true);

        State = {Active};
        debug("Duty changed to: " + nextDuty.Assignee.fullName);

        stop = -1;
      } else if (nextDuty.State == {On a rest}) {
        nextDuty = nextDuty.is required for.first;
        stop = stop + 1;

      } else {
        project.leader.notify("Duty", "States should be only 'Active' or 'On a rest'", true);

        stop = -1;
      }
    }

    nextDuty.Assignee.notify("Duty: You are on duty", nextDuty.Assignee.fullName + ", "
    + "you are on duty today.<br><br> Don't forget to process "
    + "<a href="http://youtrack.jetbrains.net/issues/JT?"
    + "q=%23Unassigned+%23Unresolved+created%3A+Yesterday%2C+Today+sort+by%3A+Priority+">"
    + "any new issues in YouTrack." + "</a>" + "<br>"
    + "<p style="color: gray;font-size: 12px;margin-top: 1em;border-top: 1px solid #D4D5D6">"
    + "Sincerely yours, YouTrack" + "</p>", true);

    var curIssue = nextDuty;
    var preventInfinite = 0;
    while (curIssue != issue && preventInfinite < 50) {
      if (curIssue.State == {Active}) {
        assert curIssue.Assignee != null: "Assignee cannot not be null!";

        curIssue.Assignee.notify("Duty: Person on duty has changed", "Today's person on duty is "
        + nextDuty.Assignee.fullName + ".", true);
      }
      curIssue = curIssue.is required for.first;
      preventInfinite = preventInfinite + 1;
    }
  }
}

Manage day of week:
```java
schedule rule Set day of week

daily at 00 : 00 : 00 [issue.State == {On duty}] {
  Day of week = (Day of week + 1) % 7;
}

Disable dropping Assignee:
```java
rule Assert Assignee not null

when Assignee.changed {
  assert Assignee != null: "Assignee cannot be null!";
}
```
