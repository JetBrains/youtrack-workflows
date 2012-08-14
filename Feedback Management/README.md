Feedback Management  
====================
Handle feedback getting from mailbox.

>Requirements:
>    states: 'Answered', 'Unanswered'
>    group 'developers'
?    type 'Spam'

Set the state to 'Answered' if a new comment is posted:
```java
rule issue is answered if new comment posted

when comments.added.isNotEmpty {
  if (comments.last.author.isInGroup("developers")) {
    State = {Answered};
  } else {
    State = {Unanswered};
  }
}
```
Issue becomes answered if a new comment posted
```java
rule issue is answered if new comment posted

when comments.added.isNotEmpty {
  if (comments.last.author.isInGroup("developers")) {
    State = {Answered};
  } else {
    State = {Unanswered};
  }
}
```
SPAM issues become answered
```java
rule resolve on mark as SPAM

when Type.becomes({Spam}) {
  State = {Answered};
}
```
Assign an issue to the author of the last 'developer group' comment
```java
rule set assignee on developer comment

when comments.added.isNotEmpty && comments.added.last.author.isInGroup("developers")
     && comments.added.last.author != Assignee {
  Assignee = comments.added.last.author;
}
```
