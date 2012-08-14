Fix Version and Fixed State 
====================

This workflow requires 'Fix Version' for 'Fixed' state. Also it sets an issue state to 'Fixed' when 'Fixed Version' is added.

Require Fix Version value for Fixed state
```java
rule Assert Fix version is set for Fixed issues

when State.becomes({Fixed}) {
  Fix versions.required("Please set the 'Fix versions' field!");
}
```
Set Fixed state on specifying Fixed in version
```java
rule Set Fixed state on specifying Fixed in version

when State != {Fixed} && Fix versions.added.isNotEmpty {
  State = {Fixed};
}
```
