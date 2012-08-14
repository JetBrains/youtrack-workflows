Voting for Resolved Issues 
====================

Disable voting for resolved issues
```java
rule jetbrains-youtrack-doNotVoteForResolvedIssue

when isResolved() {
  assert !votes.changed: "Voting for resolved issues is disabled.";
}
```
