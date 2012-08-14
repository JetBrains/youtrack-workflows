Intelligent Duplicates Management 
====================

    Automatically relink all duplicates directly to the main duplicated issue.
    User can't remove all duplicate links from issue in Duplicate state.
    Set issue state to duplicate when a Duplicate link is added.
    Raise the Priority of a duplicated issue.
    Require adding a duplicate link when changing issue state to Duplicate.

Users cannot remove all duplicate links from issue in state Duplicate
```java
rule User can't remove all duplicate links from issue in state Duplicate

when issue.State == {Duplicate} && duplicates.removed.isNotEmpty {
 assert duplicates.isNotEmpty: "Issue in Duplicate state should have at least one duplicate.";
}
```
Set issue state to Duplicate when duplicate link is added
```java
rule When have duplicate link set issue state to Duplicate

when duplicates.added.isNotEmpty && State != {Duplicate} {
  if (State.canBeUpdatedBy(loggedInUser)) {
    State = {Duplicate};
  }
}
```
Require adding a link to the main issue when issue state is set to Duplicate
```java
rule When issue becomes duplicate it must have duplicate link

when State.becomes({Duplicate}) {
  duplicates.required("Add link to duplicate issue.");
}
```
Don't allow duplicates to form a tree structure with height greater than one (target)
```java
rule Don't allow duplicates to form a tree structure with height greater than one (target)

when issue.is duplicated by.added.isNotEmpty {
  info("Processing duplicate-target issue " + issue.getId());
  var target = issue.duplicates.first;
  if (target != null) {
    // ban several duplicates for one issue
    issue.duplicates.clear;
    issue.duplicates.add(target);
    for each incoming in issue.is duplicated by {
      incoming.duplicates.remove(issue);
      if (incoming == target) {
        info("Target cycle resolved for issue " + target.getId());
      } else {
        incoming.duplicates.add(target);
      }
    }
  }
}
```
Don't allow duplicates to form a tree structure with height greater than one (source)
```java
rule Don't allow duplicates to form a tree structure with height greater than one (source)

when issue.duplicates.added.isNotEmpty {
  info("Processing duplicate-source issue " + issue.getId());
  var target = issue.duplicates.added.first;
  for each incoming in issue.is duplicated by {
    incoming.duplicates.remove(issue);
    if (incoming == target) {
      info("Source cycle resolved for issue " + target.getId());
    } else {
      incoming.duplicates.add(target);
    }
  }
}
```
When 'is duplicated by' link is added, try to raise priority
```java
rule When is duplicated by link is added try to raise priority

when issue.is duplicated by.added.isNotEmpty {
  var priorityOrdinal = issue.Priority.ordinal;
  for each source in issue.is duplicated by.added {
    var sourcePriority = source.Priority;
    var sourcePriorityOrdinal = sourcePriority.ordinal;
    if (priorityOrdinal > sourcePriorityOrdinal) {
      priorityOrdinal = sourcePriorityOrdinal;
      issue.Priority = sourcePriority;
    }
  }
}
```
