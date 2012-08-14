Last Submitted Date for Duplicate Exceptions
====================
Show the last submitted date for the main issue when a new 'is duplicated by' link is added to it.

>Requirements: field 'Last duplicate' of 'date' type

```java
rule Display last submitted date for duplicated exceptions

when issue.is duplicated by.added.isNotEmpty {
  var lastDuplicate = issue.Last duplicate;
  for each source in issue.is duplicated by.added {
    var addedDuplicate = source.created;
    if (lastDuplicate < addedDuplicate) {
      lastDuplicate = addedDuplicate;
      issue.Last duplicate = lastDuplicate;
    }
  }
}
```
