Clear 'Fix For Version' 
====================
Clear 'Fix for version' field when an issue is reopened.
```java
rule Clear Fix versions in reopened issues 
 
when State.oldValue != null && State.oldValue.isResolved && !State.isResolved { 
  Fix versions.clear; 
}
```
