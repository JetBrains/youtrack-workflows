Votes and Watchers
====================
Add the project lead to an issue watchers list once the issue collects a certain number of votes.
```java
rule watch if lots of votes

when votes == 10 {
  project.leader.watchIssue(issue);
}
```
