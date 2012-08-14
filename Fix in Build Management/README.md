Fix in Build Management 
====================

Clear Fixed in build value when issue becomes unresolved.
Copy Fixed in Build value from duplicate.
Set Fixed in Build value for duplicate when it's specified in the main issue.

Clear Fixed in build on issue unresolve
```java
rule Clear Fixed in build on issue unresolve

when issue.isReported() && !(issue.State.isResolved)
 && issue.State.oldValue != null && issue.State.oldValue.isResolved {
  if (issue.Fixed in build != null) {
    issue.Fixed in build = null;
  }
}
```
Copy Fixed in build to duplicate from the main issue
```java
rule Copy Fixed in build from duplicated issue
when State.becomes({Duplicate}) && duplicates.isNotEmpty {
  for each duplicatedIssue in duplicates {
    if (duplicatedIssue.project == project && duplicatedIssue.Fixed in build != null) {
      Fixed in build = duplicatedIssue.Fixed in build;
      break;
    }
  }
}
```
Copy Fixed in build to duplicates when it is set in the main issue
```java
rule Copy Fixed in build to duplicate issues when it is set

when Fixed in build.changed && Fixed in build != null {
  var duplicatedBy = is duplicated by;
  for each duplicate in duplicatedBy {
    if (duplicate.project == project) {
      duplicate.Fixed in build = Fixed in build;
    }
  }
}
```
