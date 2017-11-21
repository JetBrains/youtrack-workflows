Fixed in Build for Won't Fix 
====================

Set Fixed in build to 'Never' for 'Won't fix' state.

>Requirements: fixed in build 'Never'

Set 'Never' fixed in build for 'Won't fix' state
```java
rule Set 'Never' fixed in build for 'Won't fix' state

when State.becomes({Won't fix}) {
  Fixed in build = {Never};
}
```
