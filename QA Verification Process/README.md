QA Verification Process
====================

*   Notifies a user when he/she is set to verify an issue
*   Requires setting 'Verified in build' value when changing state to 'Verified', and sets current user name for 'Verified by' field value.
*   Requires adding a comment when changing state to 'W/O verification'.
    
>Requirements:
>field 'Verified by' of 'user' type,
>field 'Verified in build' of 'build' type,
>state 'W/O verification'

```java
rule Notify on set Verify by user

when isReported() && Verified by.changed {
  if (Verified by != null && loggedInUser != Verified by) {
    Verified by.notify("[Youtrack, Verify by] You became the 'Verified by' user for issue "
    + issue.getId() + " " + issue.summary, "Hi, " + Verified by.fullName +
    "! <br><br> You became the 'Verified by' user for issue <a href="" + issue.getUrl()
    + "">" + issue.getId() + "</a>" + " " + " <a href="" + issue.getUrl() + "">"
    + issue.summary + "</a>" + "<br> Please verify it or close as "W/O verification".<br><br>"
    + "<p style="color: gray;font-size: 12px;margin-top: 1em;border-top: 1px solid #D4D5D6">"
    + "Best regards, YouTrack" + "</p>");

  }
}
```
Set 'verified in build' value
```java
rule Set Verified State on specifying Verified In Build

when Verified in build != null && State != {Verified} {
  State = {Verified};
}
```
Set 'verified by' user name when adding 'verified in build' value
```java
rule Set verified by user on specifying Verified in build

when Verified in build != null && Verified in build.changed {
  Verified by = loggedInUser;
}
```
States machine
```java
...
state W/O verification {
  enter {
    Verified by = loggedInUser;
  }

  on reopen[always] do {<define statements>} transit to Open
}
state Verified {
  on reopen[always] do {<define statements>} transit to Open

  enter {
    Verified in build.required("Specify 'Verified in build'");
    Verified by = loggedInUser;
  }

  exit {
    Verified in build = null;
  }
...
```
Require adding a new comment when changing an issue state
```java
rule Require comment on w/o verification

when State.becomes({W/O verification}) {
  assert comments.added.isNotEmpty: "Add a comment about the missing details";
}
```