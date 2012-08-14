Clear 'Fix For Version' 
====================
Clear 'Fix for version' field when an issue is reopened.
```java
rule Clear fix for version on issue reopen

when State.oldValue != null && State.oldValue.isResolved && !State.isResolved {
  Fix versions.clear;
}
```
