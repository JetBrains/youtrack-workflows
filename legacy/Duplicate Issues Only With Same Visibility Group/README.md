Duplicate Issues Only With Same Visibility Groups
====================
Disable duplicating issues with different visibility groups.
```java
rule Different duplicates issues visibility

when issue.duplicates.added.isNotEmpty {
  for each duplicate in issue.duplicates.added {
    assert permittedGroup == duplicate.permittedGroup:
       "Issues can only be duplicated if they have the same visibility groups";
  }
}
```
