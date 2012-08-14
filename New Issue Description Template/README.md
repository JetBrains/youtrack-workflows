New Issue Description Template 
====================

Provide external reporters with a description template for New Issue.

Description template for external users
```java
rule Description template for external users

when !isReported() && description == null {
  description = "What are the steps to reproduce the problem?n" + "1.n2.n3.nn" +
"What is the expected result?nn" + "What happens instead?nn" +
"Please provide any additional information below.n" +
"Attach a screenshot if possiblen";}
```
