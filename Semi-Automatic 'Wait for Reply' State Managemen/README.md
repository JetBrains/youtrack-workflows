Semi-Automatic 'Wait for Reply' State Management
====================
* When a comment from an external user is required, internal user sets issue state to 'Wait for reply' manually. 
* When a comment is added, issue is automatically reopened. 
* Assignee gets a notification if no comment is added within 5 days.

>Requirements:
>state 'Wait for Reply', 
>group 'developers'

Statemachine with 'Waiting for reply' state:
```java
statemachine States for field State {

  initial state Submitted {
    on wait[always] do {<define statements>} transit to Wait for Reply
    ...
  }

  state Open {
    on wait[always] do {<define statements>} transit to Wait for Reply
    ...
  }

  state Wait for Reply {
    on fix[always] do {<define statements>} transit to Fixed

    on open[always] do {<define statements>} transit to Open

    on in progress[always] do {<define statements>} transit to In Progress

    ...
  }

}
```
Changes issue state from 'Wait for reply' to 'Open' when comment is added by an external user
```java
rule Wait for reply: reopen on answer

when State == {Wait for Reply} && comments.added != null && comments.added.isNotEmpty &&
  comments.added.last != null && !comments.added.last.author.isInGroup("developers") {

  State = {Open};
}
```
Notify assignee if no answer is received within 5 days
```java
schedule rule Wait for reply reminder

daily at 12 : 05 : 00 [issue.State == {Wait for Reply}] {
  var lastComment = comments.last;
  if (lastComment != null && lastComment.author.isInGroup("developers")
      && lastComment.created + 5 days < now) {
    if (Assignee != null) {
      Assignee.notify("[Youtrack, 'Wait for reply' reminder] Unanswered comment within 5 days",
      "Hi, " + Assignee.fullName + "! <br><br> Issue <a href="" + getUrl() + "">" + getId()
      + " " + summary + "</a>" + " is in state "Wait for reply" more than 5 days."
      + " It has unanswered comment:<br><b>" + lastComment.text
      + "</b><br><br> Please answer or resolved issue.<br><br>"
      + "<p style="color: gray;font-size: 12px;margin-top: 1em;border-top: 1px solid #D4D5D6">"
      + "Sincerely yours, YouTrack" + "</p>");
    }
  }
}
```