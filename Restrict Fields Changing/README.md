Restrict Fields Changing 
====================
Make some fields editable only by the issue assignee. Display an error message to any other user who attempts to modify the fields.
```java
rule assert assignee can change field

when Priority.changed || Fix versions.changed || Fixed in build.changed {
  assert loggedInUser == Assignee: "Only the Issue Assignee can set this field";
}
```
